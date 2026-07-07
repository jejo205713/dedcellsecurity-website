# Dedcell Security — Website

Public marketing site for **Dedcell Security**, an expert-led offensive-security firm:
web, API, cloud, and mobile penetration testing for modern startups — without the enterprise bloat.

🌐 **Live:** https://dedcellsecurity.in

---

## Overview

A single-page static site with a lightweight hash-based router. No build step, no framework —
just one `index.html` served as static output, with all runtime dependencies loaded from CDNs.

**Routes** (client-side, hash router): `/` · `/about` · `/services` · `/contact` · `/privacy` · `/terms` · `/disclosure`

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Markup         | Single static `public/index.html`                   |
| Styling        | Tailwind CSS (CDN)                                   |
| Animation      | GSAP + ScrollTrigger, Lenis smooth scroll, SplitType |
| Icons          | Lucide                                               |
| Fonts          | Inter, Space Grotesk, JetBrains Mono (Google Fonts) |
| Contact form   | Web3Forms                                            |
| Hosting        | Vercel (static, `outputDirectory: public`)          |

## Project structure

```
.
├── public/                 # deployed output (Vercel outputDirectory)
│   ├── index.html          # the entire site (markup + styles + SPA router)
│   ├── favicon.png
│   ├── LOGO-whiteeyes-300X300.png
│   ├── robots.txt
│   └── sitemap.xml
├── vercel.json             # static config + security headers (HSTS, X-Frame-Options, nosniff, etc.)
├── contact-form-apps-script.gs   # optional Google Apps Script backend for the contact form
├── INTERN-form-setup.md    # form / intern-onboarding notes
├── DESIGN_SPEC.md          # design system + content spec
└── deploy.sh               # one-step commit + push + deploy
```

## Local preview

No build required — serve the `public/` folder with any static server:

```bash
python3 -m http.server 8000 --directory public
# open http://localhost:8000
```

## Deploy

### One-step (commit + push + deploy)

```bash
./deploy.sh "describe your change"
```

This commits changes, pushes to `main` on GitHub, and deploys to Vercel production
(which auto-aliases `dedcellsecurity.in`).

### Manual

```bash
git add -A && git commit -m "..." && git push origin main   # source control
vercel --prod --yes                                         # deploy to production
```

> **Automatic deploys on push** require connecting this GitHub repo to the Vercel project once
> (Vercel dashboard → **dedcell-security → Settings → Git → Connect Git Repository**). Until that
> OAuth connection is authorized, use `./deploy.sh` or `vercel --prod`.

## Configuration notes

- **Security headers** are set in `vercel.json` (HSTS with preload, `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, a restrictive `Permissions-Policy`, and `Referrer-Policy`).
- **Contact form:** the Web3Forms access key in `index.html` is currently the placeholder
  `YOUR_WEB3FORMS_ACCESS_KEY`. Replace it with a real key from https://web3forms.com and redeploy —
  until then the form errors and only the `mailto:` fallback works.

## Contact

📧 jejo205713@gmail.com · 🌐 https://dedcellsecurity.in
