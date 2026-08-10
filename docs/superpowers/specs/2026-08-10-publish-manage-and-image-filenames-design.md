# Publish/manage for glossary, and unique image filenames

Date: 2026-08-10

Two changes to the authoring experience, unrelated in code but reported together:

1. Images inserted into a blog post or glossary term collapse into a single image
   when the entry is published.
2. `/admin` can publish, unpublish and delete blog posts, but not glossary terms.

## 1. Image filename collision

### The bug

`keystatic.config.ts` does not pass `transformFilename`, so Keystatic defaults it
to the identity function. Every image inserted into an entry body is written to:

    public/images/<collection>/<entry-slug>/<file.name>

using the browser's own name for the file, unchanged.

Browsers name clipboard images generically. A pasted screenshot arrives as
`clipboardData.files[0]` with `file.name === "image.png"` every single time. So
pasting three screenshots into one post produces three editor nodes that *look*
correct - each renders from its own in-memory `Uint8Array` - but all three carry
`filename: "image.png"`. On save, three additions are emitted for the same path,
one file survives, and all three markdown references resolve to it.

Drag-and-drop hits the same collision whenever two files share a name. The slash
menu and toolbar picker usually escape it because those files have distinct real
names, which is why the symptom looked intermittent.

Paths are namespaced per entry, so an image can never leak between entries. The
collision is strictly within one entry.

### The fix

A new `lib/image-filename.ts` exports one pure function, wired into both
collections as `transformFilename` on the `content` field's image options:

    Screenshot 2026-01-02 at 10.33.png -> screenshot-2026-01-02-at-10-33-a3f9c1d2.png
    image.png (every clipboard paste)  -> image-7b2e4f80.png, different every time

The stem is lowercased, stripped to `[a-z0-9-]`, truncated, and given eight
random hex characters. The extension is preserved.

Three consequences:

- Two inserts can never produce the same path, so the failure is structurally
  impossible rather than merely unlikely.
- Filenames become URL-safe. Today `url_qrcodecreator.com_09_30_31.png` reaches a
  public URL raw; a name with spaces or unicode would too.
- Nothing migrates. `transformFilename` runs only when a new image is inserted,
  so existing files and references are untouched.

### Out of scope

Keystatic reads `files[0]` in every insert path (drop, paste, slash menu,
toolbar). Dropping five images inserts one. Changing that means patching a
dependency, which this design does not do. Images are added one at a time, as
today - the difference is that they now stay distinct.

## 2. `/admin` extended to glossary

`/admin` already has Edit / Publish / Revert to draft / Delete per post, backed by
`POST /api/admin/posts`, which commits to git in production and writes to disk
under `next dev`. The gap is that all of it is blog-only.

Publishing stays where it is rather than moving into the Keystatic editor: two
UIs writing the same `draft` flag through different code paths is the failure
mode worth avoiding, and Keystatic's entry editor does not take custom controls
without forking it.

### Changes

- **`lib/blog-admin.ts` -> `lib/content-admin.ts`**, parameterised by
  `'blog' | 'glossary'`. The directory constants stay statically declared and are
  selected through a literal map. This is load-bearing: as the original comment
  records, `path.join(process.cwd(), someVariable)` defeats Next's file tracing,
  which then bundles the entire project into the deployed function.
- **`lib/content.ts`**: add `getGlossaryTermsForAdmin()` mirroring
  `getBlogPostsForAdmin()` - uncached, drafts included.
- **`app/api/admin/posts/route.ts`**: accept `collection` in the body, validated
  against a literal allow-list exactly as `action` already is. Commit messages
  become `Publish glossary/<slug>`.
- **`next.config.mjs`**: add `./content/glossary/**/*` to
  `outputFileTracingIncludes` for `/admin` and `/api/admin/posts`. Without it the
  glossary list is empty in production - the same failure the existing comment on
  that block describes.
- **`app/admin/page.tsx`**: two sections, Blog and Glossary. `PostsTable` gains a
  `collection` prop driving the Edit link and the delete confirmation copy.

### Deleting a glossary term

Riskier than deleting a post, and the UI says so. Other terms reference a term
through `relatedTerms` and inline `[[term]]` links. This degrades safely -
`lib/content.ts` filters unresolvable slugs out of `getRelatedTerms`, and
`glossarySlugs()` simply stops linking - so nothing errors. But those links
disappear sitewide and silently. The confirmation dialog states this. The action
is not blocked.

## Verification

The repo has no test framework. Verification is `npm run check`
(`tsc --noEmit`, `verify:cms`, `verify:content`, `next build`).

`scripts/verify-cms-contract.ts` gains checks that:

- both collections declare `transformFilename`
- repeated calls on the same input never collide
- generated names satisfy the `safePath` allow-list in
  `app/api/keystatic/[[...params]]/route.ts`, so a publish cannot be rejected by
  the very path validation that protects the write token
