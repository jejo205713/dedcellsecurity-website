'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Save / Preview / Publish, pinned to the top of the entry editor.
 *
 * Keystatic's own editor buries publishing: `draft` is a checkbox partway down a
 * form, and there is no way at all to look at a draft before it goes live. This
 * bar puts all three actions in one place.
 *
 * Each button is a different kind of thing, and the differences matter:
 *
 *   - **Publish** owns its action outright. It POSTs to /api/admin/posts, the
 *     same endpoint /admin uses, which rewrites the `draft:` line and commits.
 *   - **Preview** opens /admin/preview/…, which renders the saved file through
 *     the site's own pipeline. It cannot show unsaved edits - nothing outside
 *     Keystatic can read its form state - so the button saves first is *not*
 *     something it can promise, and the preview page says what it is showing.
 *   - **Save** cannot be reimplemented here at all, for the same reason: the
 *     unsaved entry lives in Keystatic's React tree. So this forwards to
 *     Keystatic's own Save button by clicking it. That is a real dependency on
 *     someone else's DOM, so it is written to fail *loudly*: if the button
 *     cannot be found, it says so and points at the real one, rather than
 *     appearing to save and quietly doing nothing.
 */

/** `/keystatic/collection/<collection>/item/<slug>` and nothing else. */
function parseEntryPath(pathname: string): { collection: string; slug: string } | null {
  const match = /^\/keystatic\/collection\/([^/]+)\/item\/([^/]+)\/?$/.exec(pathname);
  if (!match) return null;
  return { collection: decodeURIComponent(match[1]), slug: decodeURIComponent(match[2]) };
}

/** Only these two have a `draft` flag and a public URL to preview. */
const MANAGED = new Set(['blog', 'glossary']);

/**
 * Keystatic renders its save control as a plain button labelled "Save" (the
 * `save` entry in its string table). Matching on the accessible label rather
 * than a class name is the more stable of the available bad options - class
 * names are hashed per build, the label is not.
 *
 * `self` is the toolbar's own element and every button inside it is excluded.
 * This bar renders *above* the Keystatic app, so in document order the first
 * button labelled "save" is this component's own: without the exclusion, Save
 * clicks itself and recurses until the tab dies.
 */
function findKeystaticSaveButton(self: HTMLElement | null): HTMLButtonElement | null {
  const buttons = Array.from(document.querySelectorAll('button'));
  return (
    (buttons.find((b) => {
      if (b.disabled) return false;
      if (self?.contains(b)) return false;
      const label = (b.getAttribute('aria-label') ?? b.textContent ?? '').trim().toLowerCase();
      return label === 'save' || label === 'save changes';
    }) as HTMLButtonElement | undefined) ?? null
  );
}

type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; what: string }
  | { kind: 'done'; message: string }
  | { kind: 'error'; message: string };

const BUTTON =
  'font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg border transition-colors ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

export function EditorToolbar() {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const selfRef = useRef<HTMLDivElement>(null);

  const entry = parseEntryPath(pathname ?? '');

  // A stale "Published" badge on a different entry would be a lie.
  useEffect(() => setStatus({ kind: 'idle' }), [pathname]);

  if (!entry || !MANAGED.has(entry.collection)) return null;
  const { collection, slug } = entry;

  function save() {
    const button = findKeystaticSaveButton(selfRef.current);
    if (!button) {
      setStatus({
        kind: 'error',
        message:
          'Could not reach the editor’s Save button. Use the Save control in the editor itself.',
      });
      return;
    }
    button.click();
    setStatus({ kind: 'done', message: 'Save sent to the editor.' });
  }

  function preview() {
    window.open(
      `/admin/preview/${collection}/${encodeURIComponent(slug)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  async function publish() {
    const ok = window.confirm(
      'Publish this entry?\n\n' +
        'It publishes the last SAVED version - save first if you have unsaved edits.\n' +
        'The change is committed and the site rebuilds in a minute or two.',
    );
    if (!ok) return;

    setStatus({ kind: 'busy', what: 'Publishing' });
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, collection, action: 'publish' }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (response.ok && result.success) {
        setStatus({
          kind: 'done',
          message: 'Publish queued. The site rebuilds in a minute or two.',
        });
        return;
      }
      setStatus({ kind: 'error', message: result.error ?? 'That did not work.' });
    } catch {
      setStatus({ kind: 'error', message: 'Network error. Please try again.' });
    }
  }

  const busy = status.kind === 'busy';

  return (
    <div
      ref={selfRef}
      className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur px-4 py-2"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 mr-auto truncate">
          {collection}/{slug}
        </span>

        <button
          type="button"
          onClick={save}
          disabled={busy}
          className={`${BUTTON} border-black/15 text-black hover:bg-black/[0.04]`}
        >
          Save
        </button>

        <button
          type="button"
          onClick={preview}
          disabled={busy}
          className={`${BUTTON} border-black/15 text-black hover:bg-black/[0.04]`}
        >
          Preview
        </button>

        <button
          type="button"
          onClick={publish}
          disabled={busy}
          className={`${BUTTON} border-black bg-black text-white hover:bg-gray-700`}
        >
          {busy ? 'Publishing…' : 'Publish'}
        </button>
      </div>

      {status.kind !== 'idle' && status.kind !== 'busy' && (
        <p
          role={status.kind === 'error' ? 'alert' : 'status'}
          className={
            'mt-2 font-mono text-[11px] ' +
            (status.kind === 'error' ? 'text-black' : 'text-gray-600')
          }
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
