import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/**
 * An explicit allow-list sanitiser for rendered article content.
 *
 * This is deliberately hand-written rather than pulled from a package. The set
 * of elements markdown can produce is small and closed, so the whole policy fits
 * on one screen and can be read by anyone reviewing this repo - which matters
 * more here than saving 60 lines.
 *
 * It is the *second* line of defence. The first is that `remark-rehype` runs
 * without `allowDangerousHtml`, so raw HTML in a body (`<script>`, `<iframe>`,
 * `<div onclick=…>`) is discarded before it ever becomes a node. This plugin
 * catches anything a future plugin might inject downstream of that.
 */

/** Everything markdown + GFM can legitimately emit. Nothing else renders. */
const ALLOWED_ELEMENTS = new Set([
  'p', 'br', 'hr',
  'strong', 'em', 'del', 'code', 'pre', 'kbd',
  'a', 'img',
  'ul', 'ol', 'li', 'input',
  'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'sup', 'sub', 'section',
]);

/** Per-element attribute allow-list. `*` applies to every allowed element. */
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['id', 'className'],
  a: ['href', 'title', 'target', 'rel', 'ariaDescribedBy', 'ariaLabel', 'dataFootnoteRef', 'dataFootnoteBackref'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  th: ['align', 'colSpan', 'rowSpan', 'scope'],
  td: ['align', 'colSpan', 'rowSpan'],
  input: ['type', 'checked', 'disabled'],
  section: ['dataFootnotes'],
  ol: ['start'],
  li: ['dataFootnoteBackref'],
};

/** Schemes permitted in a link. Relative and fragment URLs are always allowed. */
const HREF_PROTOCOLS = new Set(['http', 'https', 'mailto', 'tel']);
/** Images must come from our own origin or plain HTTP(S) - never data: or blob:. */
const SRC_PROTOCOLS = new Set(['http', 'https']);

/** `className` values we permit, so a paste can't smuggle in utility classes. */
const CLASS_PATTERN = /^(language-[\w+-]+|task-list-item|footnotes|sr-only|data-footnote-backref)$/;

/**
 * Undo percent-encoding before a URL is judged.
 *
 * Load-bearing: markdown percent-encodes control characters on the way out, so
 * a body containing `java<TAB>script:` arrives here as `java%09script:`. Judged
 * raw, that has no colon-terminated scheme, so it slips through as a relative
 * URL. Looped to defeat double-encoding (%2509 -> %09 -> TAB) and bounded so a
 * hostile input cannot spin.
 */
function percentDecode(value: string): string {
  let out = value;
  try {
    for (let i = 0; i < 3 && /%[0-9a-f]{2}/i.test(out); i++) {
      out = decodeURIComponent(out);
    }
  } catch {
    // Malformed escapes: judge the raw value rather than trust a partial decode.
    return value;
  }
  return out;
}

/**
 * Extract a URL's scheme, defeating the usual obfuscations. Control characters
 * and whitespace are stripped after decoding, because `java\tscript:alert(1)`
 * and `  javascript:alert(1)` are both treated as javascript: by browsers.
 */
function protocolOf(input: string): string | null {
  const value = percentDecode(input);
  const cleaned = value.replace(/[\u0000-\u0020\u007F-\u009F]/g, '');
  const scheme = /^([a-z][a-z0-9.+-]*):/i.exec(cleaned);
  return scheme ? scheme[1].toLowerCase() : null;
}

function urlAllowed(value: unknown, allowed: Set<string>): boolean {
  if (typeof value !== 'string') return false;
  const protocol = protocolOf(value);
  // No scheme means relative ("/images/x.png") or a fragment ("#section") - safe.
  return protocol === null ? true : allowed.has(protocol);
}

function filterClassNames(value: unknown): string[] | undefined {
  const list = Array.isArray(value) ? value : String(value ?? '').split(/\s+/);
  const kept = list.filter((c) => typeof c === 'string' && CLASS_PATTERN.test(c));
  return kept.length ? kept : undefined;
}

/** Replace a disallowed element with its children rather than deleting the text. */
function unwrap(parent: { children: unknown[] }, index: number, node: Element) {
  parent.children.splice(index, 1, ...node.children);
}

export function rehypeSanitizeContent() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (!parent || index === undefined) return;

      if (!ALLOWED_ELEMENTS.has(node.tagName)) {
        // Keep the prose, drop the wrapper, and re-visit at the same index so
        // the promoted children are themselves checked.
        unwrap(parent as { children: unknown[] }, index, node);
        return index;
      }

      const permitted = new Set([
        ...(ALLOWED_ATTRIBUTES['*'] ?? []),
        ...(ALLOWED_ATTRIBUTES[node.tagName] ?? []),
      ]);

      const props = node.properties ?? {};
      for (const key of Object.keys(props)) {
        if (!permitted.has(key)) {
          delete props[key];
          continue;
        }
        if (key === 'href' && !urlAllowed(props[key], HREF_PROTOCOLS)) {
          delete props[key];
        } else if (key === 'src' && !urlAllowed(props[key], SRC_PROTOCOLS)) {
          delete props[key];
        } else if (key === 'className') {
          const kept = filterClassNames(props[key]);
          if (kept) props[key] = kept;
          else delete props[key];
        }
      }

      // A link whose href was rejected is no longer a link.
      if (node.tagName === 'a' && !props.href) {
        unwrap(parent as { children: unknown[] }, index, node);
        return index;
      }
      // Task-list checkboxes are the only <input> markdown emits, and they are
      // always inert. Anything else claiming to be an input goes.
      if (node.tagName === 'input' && props.type !== 'checkbox') {
        parent.children.splice(index, 1);
        return index;
      }
      if (node.tagName === 'input') props.disabled = true;

      node.properties = props;
    });
  };
}
