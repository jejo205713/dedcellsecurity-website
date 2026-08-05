import { authConfigured, authDisabledReason } from './auth-config';

/**
 * Decides how the CMS stores content, and whether the CMS may be served at all.
 *
 * Two independent gates, both fail-closed:
 *
 *   1. **Authentication** (lib/auth-config.ts) — is there an account to sign in
 *      as? Enforced by middleware.ts on every /keystatic and /api/keystatic
 *      request. This is the gate that matters: Keystatic's own API has *no*
 *      authentication in local-storage mode (see
 *      node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js:305
 *      — it hands requests straight to the filesystem), so without our
 *      middleware, knowing the URL equals having write access.
 *
 *   2. **Storage** — is there somewhere writes can actually go? A serverless
 *      filesystem is read-only, so local storage in production is a CMS whose
 *      save button silently does nothing.
 *
 * If either gate is shut outside `next dev`, /keystatic 404s.
 */

const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;

/** Only `next dev` may use unauthenticated local storage, on a developer's own machine. */
const isDev = process.env.NODE_ENV === 'development';

export const isGithubRepo = (v: string | undefined): v is `${string}/${string}` =>
  typeof v === 'string' && /^[\w.-]+\/[\w.-]+$/.test(v);

/**
 * Always `local`.
 *
 * Keystatic's `github` mode would authenticate each editor through GitHub
 * OAuth, requiring every publisher to have a GitHub account — the opposite of
 * the single-preset-account requirement. In `local` mode the UI reads content
 * from the deployed bundle, and app/api/keystatic/[[...params]]/route.ts
 * intercepts writes and commits them with a server-held token instead.
 */
export const storage = { kind: 'local' } as const;

/**
 * Publishing needs a repo and a token with write access to it. The token stays
 * server-side; see lib/github-commit.ts.
 */
export const publishConfigured = isGithubRepo(repo) && Boolean(process.env.GITHUB_TOKEN);

/** Whether a save can actually persist in this environment. */
export const storageWritable = isDev || publishConfigured;

/**
 * Whether /keystatic and /api/keystatic should respond.
 *
 * An account is required in **every** environment, including `next dev`. There
 * is no local exemption: signing in at /admin/login is the only way in, so the
 * auth path is the one that actually gets exercised day to day rather than only
 * in production, where a regression would be found the hard way.
 *
 * auth + writable storage -> yes, behind the sign-in page
 * anything else           -> no. 404.
 *
 * Storage still differs by environment — dev writes to local disk, production
 * commits to git — but that is orthogonal to who is allowed in.
 */
export const adminEnabled = authConfigured && storageWritable;

/** One-line explanation for the server log, so a missing env var is not a mystery. */
export function adminDisabledReason(): string | null {
  if (adminEnabled) return null;
  const reasons: string[] = [];
  const auth = authDisabledReason();
  if (auth) reasons.push(`no publisher account (${auth})`);
  if (!storageWritable) {
    if (!isGithubRepo(repo)) {
      reasons.push('NEXT_PUBLIC_GITHUB_REPO is unset or malformed (expected "owner/repo")');
    } else {
      reasons.push('GITHUB_TOKEN is not set, so the CMS cannot publish');
    }
  }
  return reasons.join('; ') + '.';
}
