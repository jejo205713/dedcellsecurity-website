# Publishing guide

How content gets onto the site. Written for whoever is writing, not for a developer.

## The short version

You write in a web form at **`/keystatic`**. When you hit publish, the CMS saves your
article as a file in the project's code repository. The site rebuilds itself and your
page is live about a minute later. There is no database and no separate "blog system"
— your article and the website are the same thing.

## Writing a glossary term

1. Go to `/keystatic` and pick **Glossary → New entry**.
2. **Title** — write it as the question people type into Google: *"What is SIEM?"*, not
   *"SIEM"*.
3. **URL slug** — this becomes the web address, `/glossary/siem`. Lowercase and hyphens
   only. **Once the page is live and Google knows about it, never change this.** Changing
   a slug throws away everything the page has earned and needs a developer to set up a
   redirect.
4. **One-sentence definition** — the most important field on the page. It must answer the
   question completely on its own, in plain English, with no jargon. This is the sentence
   Google lifts out and shows at the top of the results page, so it has to make sense to
   someone who has read nothing else.
5. **Category** — pick from the dropdown. You cannot type your own; that is deliberate.
6. **Related terms** — pick 3–6 other glossary entries. Only terms that already exist show
   up in the picker, so you can't create a broken link.
7. **SEO description** — 120–155 characters. This is the grey summary line under the
   Google result. Write it to make a human click, not to stuff in keywords.
8. **Body** — the fuller explanation. See the linking rule below.
9. Leave **Draft** ticked until it has been technically reviewed. Draft pages are visible
   on preview links but are invisible to the live site and to Google.

Blog posts work the same way, with a summary and an author instead of a definition.

## Moving an article over from Blogger or Medium

Select the article in Blogger or Medium, copy, and paste into the **Body** field.
Headings, bold, lists, quotes, tables, links and images all come across. Images are
uploaded into our repository, so they keep working even if the original post is
deleted.

What deliberately does *not* come across is the **styling** — fonts, colours, sizes.
That is on purpose. Blogger and Medium paste their own fonts into every paragraph,
and if we kept them our articles would stop looking like our site. Paste the words;
the design is already handled.

Four things the site fixes for you automatically, so don't spend time on them:

- The article's own big title at the top of the body is removed if it repeats the
  Title field, and any other `#` heading is stepped down a level. A page gets one
  main heading, and the Title field is it.
- Stray blank lines and the odd `\` character that Medium leaves behind are stripped.
- Images get lazy loading and a blank alt attribute if you didn't write one.
- Anything the source page smuggled in that isn't text — scripts, embeds, tracking —
  is discarded before the page is built.

Five things you **do** have to do after pasting:

1. **Don't paste the article into the definition or summary field.** Those two boxes
   are what Google prints in the results page. Write one clean sentence. A build
   check rejects anything that looks like pasted body text.
2. **Write the SEO description yourself.** Same reason.
3. **Add alt text to every image** — describe what it shows.
4. **Add `[[term]]` links.** A pasted article arrives with zero links to the rest of
   our site, which is the single biggest thing holding a page back.
5. **Pick the right section.** A story or an opinion piece is a **blog post**. A
   glossary entry answers "what is X?" and nothing else.

Images larger than 1MB get flagged. Compress before uploading — every image is
committed to the repository permanently.

## Linking to other glossary terms

Type double square brackets around the slug:

```
A [[siem]] collects logs from everything and correlates them.
```

That becomes a link to `/glossary/siem`.

Three things happen automatically, so you don't have to think about them:

- **Only the first mention on a page becomes a link.** Write `[[siem]]` as many times as
  reads naturally; the rest render as normal text. One link per term per article is the
  rule — repeating the same link adds nothing and looks like manipulation.
- **Terms that don't exist yet degrade to plain text.** You can write `[[xdr]]` before
  anyone has written the XDR page. Nothing breaks, and the link switches itself on the day
  that page is published.
- **You cannot accidentally nest links.**

Aim for **3–8 links to other pages on our site** in the body of each article. This is the
single highest-leverage thing you can do for the site's search performance, and it is
entirely under your control.

## Quality bar

Non-negotiable, from `docs/seo/03-CONTENT-STRATEGY.md`:

- **Write from experience, not from other websites.** "When we run a web pentest, the
  most common critical finding is broken access control" is something no competitor can
  copy. A summary of the first page of Google is worthless.
- **If a term can't support 300 words of genuine explanation, don't publish it.** Link to
  a related term instead. Thin pages actively drag down the pages around them.
- Every glossary term should end with what it means for the reader and, where honest, how
  we can help.
- Set **Last updated** whenever you meaningfully revise a page.

## For developers

```bash
npm install
npm run dev              # site on :3000, CMS at /keystatic
npm run check            # types + CMS contract + content gate + production build
npm run verify:cms       # confirms Keystatic can read every content file
npm run verify:content   # safety + quality gate on content and uploads
```

### How author content is rendered

`lib/mdx/render.tsx` parses article bodies as **markdown, not MDX**. This is a
security boundary, not a style preference: MDX compiles author text as JSX, which
was verified to let a `<script>` tag in a body execute in the browser, and let a
stray `onClick=` in pasted HTML crash `next build` outright. `remark-rehype` runs
without `allowDangerousHtml`, so raw HTML never becomes an element, and
`lib/mdx/sanitize.ts` applies an explicit element/attribute/protocol allow-list on
top of that.

The consequence: **you cannot embed React components in an article.** To add a
callout or CTA block, add it as a reviewed component with an allow-listed tag —
never as markup typed into a content field.

`lib/mdx/remark-normalize-paste.ts` handles the Blogger/Medium paste artefacts
(duplicate H1, stray hard breaks, empty paragraphs) at render time.

### Why /keystatic 404s in production

Keystatic's local-storage API handler has **no authentication** — it hands every
request straight to the filesystem. `lib/keystatic-storage.ts` therefore refuses to
serve `/keystatic` or `/api/keystatic` outside `next dev` unless GitHub storage is
fully configured. A missing env var produces a 404, never an open CMS. The reason
is logged to the server console.

Content lives in `content/glossary/*.mdx` and `content/blog/*.mdx`. The site reads those
files through `lib/content.ts` (gray-matter), and Keystatic reads and writes the same
files through its own parser. `npm run verify:cms` exists to catch the two drifting apart
— if it fails, an editor would silently lose fields on save.

Categories are defined once in `lib/taxonomy.ts` and feed both the CMS dropdown and the
site. Never hard-code a category anywhere else.

### Switching the CMS from local files to GitHub

Right now `keystatic.config.ts` uses local storage: the CMS writes to your disk. That only
works on a developer's machine. For the editor to publish from the deployed site, it needs
GitHub storage:

1. Push this project to a GitHub repository.
2. Set `NEXT_PUBLIC_GITHUB_REPO=jejo205713/dedcellsecurity-website` in the Vercel
   project's environment variables.
3. Deploy, open `/keystatic` on the deployed URL, and follow the on-screen setup — it
   creates a GitHub App and gives you the four values to add to Vercel:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`,
   and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
4. Redeploy. Editors now sign in with GitHub, and only people you grant repository access
   can publish.

Until step 2 is done, the deployed `/keystatic` returns 404 by design — an
unauthenticated CMS is worse than no CMS.

Publishing access is then just repository access: add a writer as a collaborator to
grant it, remove them to revoke it. There are no passwords in our infrastructure and
no login code of ours to get wrong, which is the entire point.
