/**
 * Commits content changes to GitHub using a **server-held** token.
 *
 * Why this exists: Keystatic's built-in GitHub storage authenticates each editor
 * through GitHub OAuth, which means every publisher needs their own GitHub
 * account. The requirement here is one preset account and no GitHub accounts at
 * all, so the storage side has to be solved separately from the login side.
 *
 * The arrangement:
 *   - Keystatic runs in `local` storage mode, so its UI reads the content files
 *     straight from the deployed bundle. Reads need no credentials.
 *   - Writes cannot touch a serverless filesystem (read-only), so the update
 *     endpoint is intercepted and turned into a git commit through this module.
 *   - The token lives only in `GITHUB_TOKEN` on the server. It is never sent to
 *     the browser, so an XSS in the admin cannot steal repository write access
 *     which is exactly the flaw in the alternative approach of injecting a PAT
 *     into the cookie Keystatic's OAuth flow expects.
 *
 * Pushing to the default branch triggers a Vercel redeploy, which is what makes
 * the change live.
 */

const API = 'https://api.github.com';

export type FileChange =
  | { type: 'add'; path: string; contents: string } // contents is base64
  | { type: 'delete'; path: string };

type GitHubConfig = {
  repo: string; // "owner/name"
  token: string;
  branch: string;
};

export function githubCommitConfig(): GitHubConfig | null {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
  return { repo, token, branch: process.env.GITHUB_BRANCH ?? 'main' };
}

async function gh<T>(
  cfg: GitHubConfig,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const response = await fetch(`${API}/repos/${cfg.repo}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'dedcell-security-cms',
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    // Surfaced in server logs only - the client gets a generic message.
    throw new Error(`GitHub ${init?.method ?? 'GET'} ${path} -> ${response.status}: ${detail.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Applies every change as a single commit, via the git data API.
 *
 * One commit rather than one-per-file: an entry plus its uploaded images must
 * land together, or a half-applied save leaves the site referencing an image
 * that does not exist yet. It also means one redeploy instead of several.
 */
export async function commitChanges(
  cfg: GitHubConfig,
  changes: FileChange[],
  message: string,
): Promise<{ sha: string; url: string }> {
  if (changes.length === 0) throw new Error('No changes to commit');

  const ref = await gh<{ object: { sha: string } }>(cfg, `/git/ref/heads/${cfg.branch}`);
  const headSha = ref.object.sha;
  const headCommit = await gh<{ tree: { sha: string } }>(cfg, `/git/commits/${headSha}`);

  // Upload file contents as blobs first; the tree then references them by sha.
  const tree = await Promise.all(
    changes.map(async (change) => {
      if (change.type === 'delete') {
        // A null sha in a tree entry is how the git API expresses a deletion.
        return { path: change.path, mode: '100644' as const, type: 'blob' as const, sha: null };
      }
      const blob = await gh<{ sha: string }>(cfg, '/git/blobs', {
        method: 'POST',
        body: { content: change.contents, encoding: 'base64' },
      });
      return {
        path: change.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha,
      };
    }),
  );

  const newTree = await gh<{ sha: string }>(cfg, '/git/trees', {
    method: 'POST',
    body: { base_tree: headCommit.tree.sha, tree },
  });

  const commit = await gh<{ sha: string; html_url: string }>(cfg, '/git/commits', {
    method: 'POST',
    body: { message, tree: newTree.sha, parents: [headSha] },
  });

  // Non-forced: if someone else pushed since we read the ref, this fails rather
  // than silently discarding their commit.
  await gh(cfg, `/git/refs/heads/${cfg.branch}`, {
    method: 'PATCH',
    body: { sha: commit.sha, force: false },
  });

  return { sha: commit.sha, url: commit.html_url };
}

/** Human-readable commit subject from the set of changed paths. */
export function describeChanges(changes: FileChange[]): string {
  const entries = new Set<string>();
  for (const change of changes) {
    const match = /^content\/(glossary|blog)\/([^/]+?)(?:\/index)?\.mdx?$/.exec(change.path);
    if (match) entries.add(`${match[1]}/${match[2]}`);
  }
  const names = [...entries];
  const subject =
    names.length === 0
      ? `Update ${changes.length} file(s)`
      : names.length === 1
        ? `Update ${names[0]}`
        : `Update ${names.length} entries`;
  return `${subject}\n\nPublished from the Dedcell Security CMS.`;
}
