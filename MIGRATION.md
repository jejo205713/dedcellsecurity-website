# Cutover: static site → Next.js

What replaces what, and how to deploy it without taking the live site down.

## What changed

| Before | After |
|---|---|
| `public/index.html` - 1,529 lines, 7 pages as JS template strings | 7 real routes under `app/(site)/` |
| Client-side router, `routerView.innerHTML = content` | Static prerendering, one HTML file per URL |
| All 7 pages share the home `<title>` and canonical `/` | 14 pages, 14 unique titles, 14 canonicals |
| `public/sitemap.xml` hand-maintained, 7 URLs | `app/sitemap.ts`, generated, 13 URLs and growing |
| Tailwind CDN + Lucide + GSAP + ScrollTrigger + SplitType + Lenis (6 blocking scripts) | Compiled Tailwind, `lucide-react`, no animation libraries |
| Google Fonts via `<link>` | `next/font`, self-hosted |
| `api/contact.js` (Vercel Function) | `app/api/contact/route.ts` - same logic, same env var |
| No blog, no glossary, no CMS | `/blog`, `/glossary`, `/keystatic` |

`vercel.json` drops `outputDirectory: "public"` (a Next build cannot satisfy it)
and the 6 SPA rewrites (they existed only to stop the client router 404ing
every route is real now). Security headers moved to `next.config.mjs`, which
covers more ground than the old set.

## Deploy

The repo currently holds the static site. **Do not push straight to `main`**
that is production.

```bash
# 1. Branch
cd ~/Documents/dedcell-security
git checkout -b nextjs-migration

# 2. Replace contents, keeping git history and the docs
git rm -r --cached public api vercel.json deploy.sh
rm -rf public api vercel.json deploy.sh
cp -r ~/Documents/dedcell/dedcell-next/. .

# 3. Push the branch - Vercel builds a preview automatically
git add -A && git commit -m "Migrate to Next.js: real routes, blog, glossary, CMS"
git push -u origin nextjs-migration
```

Vercel auto-detects Next.js. Check the preview URL against production, then
promote from the Vercel dashboard. **Rollback is one click** - the previous
deployment stays live until you promote.

### Environment variables

Set in the Vercel project **before** promoting:

| Variable | Value | Why |
|---|---|---|
| `APPS_SCRIPT_URL` | *(already set - carry it over)* | contact form target |
| `NEXT_PUBLIC_SITE_URL` | `https://dedcellsecurity.in` | canonical URLs |
| `ADMIN_USERNAME` | your choice | the single publisher account |
| `ADMIN_PASSWORD_HASH` | from `npm run auth:hash` | never the plaintext |
| `AUTH_SECRET` | from `npm run auth:hash` | signs session cookies |
| `NEXT_PUBLIC_GITHUB_REPO` | `jejo205713/dedcellsecurity-website` | commit target |
| `GITHUB_TOKEN` | fine-grained PAT, Contents: read+write | how the CMS publishes |

Without the account variables *or* without `GITHUB_TOKEN`, `/keystatic` returns
**404 by design** - see `lib/keystatic-storage.ts` and `middleware.ts`. An
unauthenticated CMS is worse than no CMS, and a CMS whose save button silently
does nothing is worse than a missing one.

## Verify before promoting

```bash
npm run check   # types → CMS contract → content gate → production build
```

Then on the preview URL:

- [ ] Each of `/`, `/services`, `/about`, `/contact`, `/privacy`, `/terms`, `/disclosure` shows its **own** title in the browser tab
- [ ] `view-source:` on `/about` shows `<link rel="canonical" href="https://dedcellsecurity.in/about">` - not `/`
- [ ] Contact form submits and the row lands in the Google Sheet
- [ ] `/sitemap.xml` lists all 13 URLs with the production domain
- [ ] `/keystatic` redirects to `/admin/login`; signing in with the account reaches the CMS
- [ ] Saving an entry produces a commit in the repo and a new deploy
- [ ] Navbar goes black past 40px of scroll and its text stays legible
- [ ] Client logos render on the home page

## URLs that must not change

All 7 existing URLs are preserved exactly. `/home` and `/index` keep their
301s. Nothing that Google has indexed moves - **do not "tidy" any of these
slugs**, and read `PUBLISHING.md` before changing a content slug.

## Not carried over, deliberately

- **GSAP / ScrollTrigger / SplitType / Lenis.** Scroll reveals and smooth
  scrolling are gone. Re-add as a client component if you want them; the CSS
  honours `prefers-reduced-motion` either way, which the live site did not.
- **The page-transition wipe** between routes.
- **`deploy.sh`** - Vercel's git integration replaces it.
