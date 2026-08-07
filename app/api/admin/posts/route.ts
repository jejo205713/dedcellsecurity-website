import fs from 'node:fs/promises';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_SECRET, authConfigured } from '@/lib/auth-config';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { adminEnabled } from '@/lib/keystatic-storage';
import { blogFile, isValidSlug, setDraftFlag } from '@/lib/blog-admin';
import { commitChanges, githubCommitConfig, type FileChange } from '@/lib/github-commit';

/**
 * Publish, unpublish and delete for existing blog posts.
 *
 * These three actions exist in the Keystatic editor too - `draft` is a checkbox
 * and there is a "Delete entry" item in the entry menu - but both are two or
 * three screens deep, and an editor who wants to pull a live post down should
 * not have to go hunting through a form to do it. This endpoint backs the flat
 * list at /admin.
 *
 * Writes take the same route as the CMS: git commit in production (the
 * serverless filesystem is read-only), plain file writes under `next dev`. See
 * lib/github-commit.ts for why the token stays server-side.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACTIONS = ['publish', 'unpublish', 'delete'] as const;
type Action = (typeof ACTIONS)[number];

/** True when writes must go to git because the filesystem is read-only. */
const commitInsteadOfWrite = process.env.NODE_ENV === 'production';

async function authorized(): Promise<boolean> {
  if (!authConfigured) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return (await verifySessionToken(token, AUTH_SECRET!)) !== null;
}

function commitMessage(action: Action, slug: string): string {
  const verb = action === 'delete' ? 'Delete' : action === 'publish' ? 'Publish' : 'Unpublish';
  return `${verb} blog/${slug}\n\nPublished from the Dedcell Security CMS.`;
}

export async function POST(request: Request) {
  // The proxy already rejects unauthenticated requests. Repeated here because
  // this handler reaches a repository write token, and a single mistake in a
  // matcher pattern should not be all that stands in front of it.
  if (!adminEnabled || !(await authorized())) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // The session cookie is SameSite=Lax, so a cross-site POST cannot carry it.
  // This is the second lock on the same door.
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get('host')) {
        return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const { slug, action } = body;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Unknown post.' }, { status: 400 });
  }
  if (typeof action !== 'string' || !ACTIONS.includes(action as Action)) {
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  }

  const file = blogFile(slug);
  if (!file) {
    return NextResponse.json({ error: 'That post no longer exists.' }, { status: 404 });
  }

  let change: FileChange;
  if (action === 'delete') {
    change = { type: 'delete', path: file.repoPath };
  } else {
    let updated: string;
    try {
      const raw = await fs.readFile(file.absolutePath, 'utf8');
      updated = setDraftFlag(raw, action === 'unpublish');
    } catch (err) {
      console.error(`[admin] could not rewrite frontmatter for ${file.repoPath}:`, err);
      return NextResponse.json(
        { error: 'That post has no readable frontmatter. Edit it in the CMS instead.' },
        { status: 422 },
      );
    }
    change = {
      type: 'add',
      path: file.repoPath,
      contents: Buffer.from(updated, 'utf8').toString('base64'),
    };
  }

  if (!commitInsteadOfWrite) {
    if (change.type === 'delete') await fs.rm(file.absolutePath, { force: true });
    else await fs.writeFile(file.absolutePath, Buffer.from(change.contents, 'base64'));
    return NextResponse.json({ success: true, committed: false });
  }

  const cfg = githubCommitConfig();
  if (!cfg) {
    console.error('[admin] GITHUB_TOKEN or NEXT_PUBLIC_GITHUB_REPO missing - cannot publish.');
    return NextResponse.json({ error: 'Publishing is not configured on the server.' }, { status: 503 });
  }

  try {
    const commit = await commitChanges(cfg, [change], commitMessage(action as Action, slug));
    console.log(`[admin] ${action} blog/${slug} as ${commit.sha.slice(0, 8)}`);
    return NextResponse.json({ success: true, committed: true, sha: commit.sha });
  } catch (err) {
    console.error(`[admin] ${action} failed for blog/${slug}:`, err);
    // Never echo the GitHub error - it can carry the repo path and token hints.
    return NextResponse.json(
      { error: 'Publishing failed. Nothing was changed.' },
      { status: 502 },
    );
  }
}
