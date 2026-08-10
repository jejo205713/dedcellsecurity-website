/**
 * Names images uploaded through the CMS editor.
 *
 * Keystatic writes every image inserted into an entry body to
 * `public/images/<collection>/<entry-slug>/<filename>`, where `filename` comes
 * straight from the browser. Left alone it uses the file's own name, and that
 * silently destroys content:
 *
 *   A pasted screenshot is always `image.png`. Browsers synthesise that name for
 *   `clipboardData.files` - there is no real file behind it. So pasting three
 *   screenshots into one post yields three editor nodes that each *look* right,
 *   because each renders from its own in-memory bytes, but all three carry the
 *   filename `image.png`. On save, three additions are emitted for one path, one
 *   file survives, and all three references in the body resolve to it. Every
 *   image in the post becomes the first image.
 *
 * Drag-and-drop hits the same collision whenever two files share a name.
 *
 * A random suffix is what makes this structural rather than merely unlikely: no
 * amount of pasting can produce the same path twice, so the editor never has to
 * be careful about what their screenshots are called.
 *
 * The sanitising half is a smaller but real problem. Filenames land in a public
 * URL - content/blog already contains `url_qrcodecreator.com_09_30_31.png` - and
 * spaces, uppercase or unicode would go in raw and need escaping everywhere
 * downstream.
 *
 * Runs in the browser, at insert time only. Existing files keep their names.
 */

/** Long enough that a collision needs ~10^9 images in one entry, short enough to read. */
const SUFFIX_BYTES = 4;

/**
 * Keeps a URL readable without letting a 200-character download name through.
 * The suffix guarantees uniqueness, so the stem is decoration and can be cut.
 */
const MAX_STEM = 60;

/**
 * Splits on the *last* dot, so `archive.tar.gz` keeps `.gz` and, more to the
 * point, `url_qrcodecreator.com_09_30_31.png` does not get truncated at `.com`.
 * A leading dot is not a separator - `.gitignore` is all stem, no extension.
 */
function splitExtension(filename: string): [stem: string, extension: string] {
  const dot = filename.lastIndexOf('.');
  if (dot <= 0) return [filename, ''];
  return [filename.slice(0, dot), filename.slice(dot + 1)];
}

/** Lowercase ASCII, hyphen-separated, no leading or trailing hyphens. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * `crypto.getRandomValues` rather than `Math.random`: this file is imported by
 * keystatic.config.ts, which is evaluated on the server as well as in the
 * browser, and Web Crypto is the one API present in both plus the Edge runtime.
 */
function randomSuffix(): string {
  const bytes = new Uint8Array(SUFFIX_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * The `transformFilename` Keystatic calls for each inserted image.
 *
 * Always returns a name matching `[a-z0-9-]+(\.[a-z0-9]+)?`, which is inside the
 * path allow-list that app/api/keystatic/[[...params]]/route.ts enforces before
 * it will commit anything - a name that failed there would make publishing fail
 * outright, so the two must not drift apart.
 */
export function transformImageFilename(originalFilename: string): string {
  const [rawStem, rawExtension] = splitExtension(originalFilename);

  const stem = slugify(rawStem).slice(0, MAX_STEM).replace(/-+$/, '');
  const extension = slugify(rawExtension);

  // A name of nothing but punctuation, or a bare ".png", still needs a stem.
  const base = stem || 'image';

  return extension ? `${base}-${randomSuffix()}.${extension}` : `${base}-${randomSuffix()}`;
}
