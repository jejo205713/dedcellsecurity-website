import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';
import { adminDisabledReason, adminEnabled } from '@/lib/keystatic-storage';
import {
  commitChanges,
  describeChanges,
  githubCommitConfig,
  type FileChange,
} from '@/lib/github-commit';
import { applyChangesToTree, isTreeEntryArray } from '@/lib/keystatic-tree';

/**
 * Backs the Keystatic UI.
 *
 * Three layers sit in front of this file, and it is worth knowing why each is
 * there:
 *
 *   1. middleware.ts rejects anyone without a valid session. Keystatic's own
 *      local-mode API has no authentication whatsoever, so this is what stands
 *      between the internet and write access.
 *   2. `adminEnabled` refuses to serve the CMS unless both an account and a
 *      writable backend are configured. Fails closed.
 *   3. The `update` interception below replaces filesystem writes - impossible
 *      on a read-only serverless filesystem - with a git commit made using a
 *      server-held token, so publishers never need GitHub accounts.
 *
 * Reads (`tree`, `blob`) fall through to Keystatic's local handler, which reads
 * the content files out of the deployed bundle. See `outputFileTracingIncludes`
 * in next.config.mjs - without it those files are not deployed and the CMS
 * opens empty.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const keystatic = makeRouteHandler({ config });

function notFound() {
  return new Response('Not Found', {
    status: 404,
    headers: { 'x-robots-tag': 'noindex, nofollow' },
  });
}

/** True when writes must go to git because the filesystem is read-only. */
const commitInsteadOfWrite = process.env.NODE_ENV === 'production';

/**
 * The current content tree as Keystatic's own `GET /api/keystatic/tree` reports
 * it, read straight off the deployed bundle.
 *
 * Called in-process rather than over HTTP - the handler derives its route
 * params from the URL string, so a hand-built Request is enough and no network
 * hop, cookie or auth round-trip is involved.
 */
async function readBaseTree(request: Request): Promise<unknown> {
  const treeRequest = new Request(new URL('/api/keystatic/tree', request.url), {
    headers: { 'no-cors': '1' },
  });
  const response = await keystatic.GET(treeRequest);
  if (!response.ok) throw new Error(`tree read failed: ${response.status}`);
  return response.json();
}

async function handlePost(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const isUpdate = url.pathname.replace(/\/$/, '').endsWith('/update');

  if (!isUpdate || !commitInsteadOfWrite) {
    return keystatic.POST(request);
  }

  const cfg = githubCommitConfig();
  if (!cfg) {
    console.error('[keystatic] GITHUB_TOKEN or NEXT_PUBLIC_GITHUB_REPO missing - cannot publish.');
    return Response.json(
      { error: 'Publishing is not configured on the server.' },
      { status: 503 },
    );
  }

  let payload: { additions?: unknown; deletions?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const additions = Array.isArray(payload.additions) ? payload.additions : [];
  const deletions = Array.isArray(payload.deletions) ? payload.deletions : [];

  /**
   * Re-validate every path here. Keystatic validates on its side, but this
   * handler now holds a repository write token - a path escaping content/ or
   * public/images/ would let the CMS rewrite application code, which is a far
   * worse outcome than a bad article.
   */
  const allowed = /^(content\/(glossary|blog)\/|public\/images\/(glossary|blog)\/)/;
  const safePath = (p: unknown): p is string =>
    typeof p === 'string' &&
    allowed.test(p) &&
    !p.includes('..') &&
    !p.includes('\\') &&
    !p.startsWith('/');

  const changes: FileChange[] = [];
  for (const item of additions) {
    const entry = item as { path?: unknown; contents?: unknown };
    if (!safePath(entry.path) || typeof entry.contents !== 'string') {
      return Response.json({ error: 'Rejected: disallowed file path.' }, { status: 400 });
    }
    changes.push({ type: 'add', path: entry.path, contents: entry.contents });
  }
  for (const item of deletions) {
    const entry = item as { path?: unknown };
    if (!safePath(entry.path)) {
      return Response.json({ error: 'Rejected: disallowed file path.' }, { status: 400 });
    }
    changes.push({ type: 'delete', path: entry.path });
  }

  /**
   * The response body must be the resulting file tree, not a status object - the
   * Keystatic client feeds it straight into `entries.map(...)`. See
   * lib/keystatic-tree.ts. Read the base tree *before* committing so a failure
   * here fails cleanly, with nothing yet pushed.
   */
  let baseTree: unknown;
  try {
    baseTree = await readBaseTree(request);
  } catch (err) {
    console.error('[keystatic] could not read the current content tree:', err);
    return Response.json({ error: 'Could not read the current content.' }, { status: 500 });
  }
  if (!isTreeEntryArray(baseTree)) {
    console.error('[keystatic] content tree had an unexpected shape - refusing to publish.');
    return Response.json({ error: 'Could not read the current content.' }, { status: 500 });
  }

  if (changes.length === 0) return Response.json(baseTree);

  try {
    const commit = await commitChanges(cfg, changes, describeChanges(changes));
    console.log(`[keystatic] published ${changes.length} file(s) as ${commit.sha.slice(0, 8)}`);
    return Response.json(applyChangesToTree(baseTree, changes));
  } catch (err) {
    console.error('[keystatic] publish failed:', err);
    // Never echo the GitHub error - it can contain the repo path and token hints.
    return Response.json(
      { error: 'Publishing failed. The change was not saved.' },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  if (!adminEnabled) {
    console.warn(`[keystatic] admin API disabled - ${adminDisabledReason()}`);
    return notFound();
  }
  return keystatic.GET(request);
}

export async function POST(request: Request) {
  if (!adminEnabled) {
    console.warn(`[keystatic] admin API disabled - ${adminDisabledReason()}`);
    return notFound();
  }
  return handlePost(request);
}
