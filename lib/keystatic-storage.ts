/**
 * Decides how the CMS stores content, and — more importantly — whether the CMS
 * is allowed to be served at all.
 *
 * Why this file exists: Keystatic's local-storage mode has **no authentication**.
 * Its API route hands every request straight to the filesystem handler with no
 * auth, no origin check and no environment check (see
 * node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js:305).
 * That is correct for `next dev` on your laptop and catastrophic anywhere else:
 * a deployed local-mode CMS is an open door to every draft.
 *
 * So the rule is absolute: **outside `next dev`, the admin only exists when
 * GitHub storage is fully configured.** Misconfiguration produces a 404, never
 * an unauthenticated CMS.
 */

const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;

/** Only `next dev` may use unauthenticated local storage. */
const isDev = process.env.NODE_ENV === 'development';

/** GitHub App credentials Keystatic needs to run the OAuth login. */
const githubSecrets = [
  process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  process.env.KEYSTATIC_SECRET,
];

export const isGithubRepo = (v: string | undefined): v is `${string}/${string}` =>
  typeof v === 'string' && /^[\w.-]+\/[\w.-]+$/.test(v);

/** True once every GitHub value is present and well-formed. */
export const githubConfigured = isGithubRepo(repo) && githubSecrets.every(Boolean);

export const storage = isGithubRepo(repo)
  ? ({ kind: 'github', repo } as const)
  : ({ kind: 'local' } as const);

/**
 * Whether `/keystatic` and `/api/keystatic` should respond.
 *
 * dev              → yes, local files, no login (localhost only)
 * GitHub configured→ yes, GitHub OAuth login
 * anything else    → no. 404.
 */
export const adminEnabled = isDev || githubConfigured;

/**
 * One-line explanation for the server log when the admin is switched off, so a
 * missing env var is a five-second diagnosis instead of a mystery 404.
 */
export function adminDisabledReason(): string | null {
  if (adminEnabled) return null;
  if (!isGithubRepo(repo)) {
    return 'NEXT_PUBLIC_GITHUB_REPO is unset or malformed (expected "owner/repo").';
  }
  const names = ['KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET'];
  const missing = names.filter((_, i) => !githubSecrets[i]);
  return `Missing GitHub App credentials: ${missing.join(', ')}.`;
}
