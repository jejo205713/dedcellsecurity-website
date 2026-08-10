'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * The blog and glossary lists at /admin, with the two controls that were
 * previously only reachable from inside the Keystatic entry editor: revert a
 * live entry to draft, and delete one outright.
 *
 * The one thing this component must not do is lie about the result. A change is
 * committed to git, and the site only reflects it once Vercel finishes the
 * rebuild that commit triggers - so a row that has been acted on says "queued"
 * and keeps saying it, rather than flipping its badge and implying the live site
 * has already changed.
 */

export type AdminCollection = 'blog' | 'glossary';

export type AdminPost = {
  slug: string;
  title: string;
  draft: boolean;
  publishedDate: string;
};

type Action = 'publish' | 'unpublish' | 'delete';

type RowState =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'queued'; action: Action }
  | { kind: 'error'; message: string };

const PAST_TENSE: Record<Action, string> = {
  publish: 'Publish queued',
  unpublish: 'Reverted to draft',
  delete: 'Deletion queued',
};

const BUTTON =
  'font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg border transition-colors ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

/**
 * Deleting a glossary term reaches further than deleting a post, and the editor
 * should be told before they click, not after. Other terms point at it through
 * `relatedTerms` and inline [[term]] links. Nothing errors - lib/content.ts
 * filters slugs it cannot resolve, and glossarySlugs() simply stops linking -
 * but those links vanish sitewide and give no sign that they have.
 */
function deleteWarning(collection: AdminCollection, title: string): string {
  const shared =
    `Delete "${title}" permanently?\n\n` +
    'The file is removed from the repository. If it is live, its URL will start ' +
    'returning 404 to anyone who has linked to it. To take it off the site ' +
    'without breaking the URL, revert it to draft instead.';

  if (collection === 'blog') return shared;

  return (
    shared +
    '\n\nThis is a glossary term: other pages link to it with [[term]] and list ' +
    'it under Related terms. Those links will quietly disappear.'
  );
}

export function PostsTable({
  posts,
  collection,
}: {
  posts: AdminPost[];
  collection: AdminCollection;
}) {
  const [state, setState] = useState<Record<string, RowState>>({});

  async function run(post: AdminPost, action: Action) {
    if (action === 'delete') {
      if (!window.confirm(deleteWarning(collection, post.title))) return;
    }

    setState((s) => ({ ...s, [post.slug]: { kind: 'busy' } }));
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: post.slug, action, collection }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (response.ok && result.success) {
        setState((s) => ({ ...s, [post.slug]: { kind: 'queued', action } }));
        return;
      }
      setState((s) => ({
        ...s,
        [post.slug]: { kind: 'error', message: result.error ?? 'That did not work.' },
      }));
    } catch {
      setState((s) => ({
        ...s,
        [post.slug]: { kind: 'error', message: 'Network error. Please try again.' },
      }));
    }
  }

  if (posts.length === 0) {
    return (
      <p className="mt-8 text-sm text-gray-500">
        No {collection === 'blog' ? 'posts' : 'terms'} yet. Write the first one in the CMS.
      </p>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
      {posts.map((post) => {
        const row = state[post.slug] ?? { kind: 'idle' };
        const busy = row.kind === 'busy';
        const settled = row.kind === 'queued';

        return (
          <li key={post.slug} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className={
                      'font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ' +
                      (post.draft
                        ? 'bg-black/[0.05] text-gray-600'
                        : 'bg-black text-white')
                    }
                  >
                    {post.draft ? 'Draft' : 'Live'}
                  </span>
                  <h2 className="font-sans font-semibold text-sm text-black truncate">
                    {post.title}
                  </h2>
                </div>
                <p className="mt-2 font-mono text-[11px] text-gray-500">
                  /{collection}/{post.slug}
                  {post.publishedDate ? ` · ${post.publishedDate}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/keystatic/collection/${collection}/item/${encodeURIComponent(post.slug)}`}
                  className={`${BUTTON} border-black/15 text-black hover:bg-black/[0.04]`}
                >
                  Edit
                </a>

                {post.draft ? (
                  <button
                    type="button"
                    onClick={() => run(post, 'publish')}
                    disabled={busy || settled}
                    className={`${BUTTON} border-black bg-black text-white hover:bg-gray-700`}
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => run(post, 'unpublish')}
                    disabled={busy || settled}
                    className={`${BUTTON} border-black/15 text-black hover:bg-black/[0.04]`}
                  >
                    Revert to draft
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => run(post, 'delete')}
                  disabled={busy || settled}
                  className={`${BUTTON} border-black/15 text-gray-600 hover:bg-black/[0.04] hover:text-black`}
                >
                  Delete
                </button>
              </div>
            </div>

            {busy && (
              <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                Committing…
              </p>
            )}

            {row.kind === 'queued' && (
              <p role="status" className="mt-3 font-mono text-[11px] text-black">
                {PAST_TENSE[row.action]}. The site rebuilds in a minute or two, and this
                list updates when it does.
              </p>
            )}

            {row.kind === 'error' && (
              <p
                role="alert"
                className="mt-3 text-sm font-mono text-black border border-black/20 rounded-lg px-3 py-2 bg-black/[0.03]"
              >
                {row.message}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
