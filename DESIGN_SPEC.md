# Dedcell Security - Design System

**Regenerated 2026-08-05 from the live site**, replacing the version in
`dedcell-security/DESIGN_SPEC.md`, which described a pure-black dark theme the
site no longer uses. If those two ever disagree again, this file wins - it is
the one the code is built from.

---

## What changed from the old spec, and why it mattered

| Old spec said | Reality |
|---|---|
| Background `#000000`, dark theme | **`#ffffff`, light theme.** `theme-color` is `#ffffff` |
| Two faces: Inter + JetBrains Mono | **Three.** Space Grotesk sets every `h1` - `h4` |
| Borders `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` - inverted with the theme |
| No mention of inverted sections | Dark blocks exist and need `-invert` variants |

Building to the old spec would have produced a black page against a white site.

---

## 1. Colour

Monochrome. **There are no accent colours** - no brand blue, no severity red.
Emphasis comes from black/white contrast, 1px hairlines, and inverted blocks.
If you reach for a colour, you want a border, a weight change, or an inversion.

| Token | Value | Use |
|---|---|---|
| `white` | `#ffffff` | page background |
| `black` | `#000000` | headings, primary buttons, inverted surfaces |
| `surface` | `#f5f5f5` | contact form card |
| `surfaceDark` | `#f0f0f0` | alternating section bands |
| `inputBg` | `#fafafa` | form fields |
| `gray-300` | `#c0c0c0` | text on dark surfaces |
| `gray-400` | `#909090` | eyebrow labels |
| `gray-500` | `#606060` | **body text - the default `color` on `<body>`** |
| `gray-600` | `#404040` | metadata, footer fine print |
| `gray-700` | `#303030` | placeholders, faint numerals |
| `--border-light` | `rgba(0,0,0,0.1)` | **the** default 1px border |
| `--border-hover` | `rgba(0,0,0,0.3)` | card/border hover |

**On dark sections** the values invert: borders become `rgba(255,255,255,0.14)`,
hover `rgba(255,255,255,0.28)`, eyebrows `rgba(255,255,255,0.55)`. `#909090` sits
at ~3.4:1 on black and fails WCAG AA, which is exactly why `.eyebrow-invert`
exists - do not reuse the light-mode value on a dark block.

## 2. Type

| Role | Face | Applied to |
|---|---|---|
| Display | **Space Grotesk** 500/600/700 | `h1` - `h4`, `.display-text` |
| Sans | **Inter** 400-800 | body, buttons, nav |
| Mono | **JetBrains Mono** 300/400/500 | eyebrows, tags, metadata, fine print |

Self-hosted via `next/font` - no Google Fonts connection, no layout shift, and
the CSP stays `font-src 'self'`.

- Hero `h1`: `text-5xl` → `md:text-7xl` → `lg:text-8xl`, `leading-[1.05]`, `tracking-tight`
- Section `h2`: `text-4xl` → `md:text-5xl`, `font-extrabold`, `tracking-tight`
- Body: `text-sm`/`text-base`, `leading-relaxed`, `#606060`
- Mono labels: `text-xs`, `uppercase`, `tracking-widest` (`0.1em`)

**The two-tone heading is the signature move**: first clause black, second in
`text-gray-500`. `Startups Are the <span class="text-gray-500">Easiest Target.</span>`

## 3. Layout

- Max width `max-w-7xl` (80rem) for marketing, `max-w-4xl` for hubs, `max-w-3xl` for articles
- Horizontal padding `px-6`; section rhythm `py-24`
- Every section opens with `border-t border-black/10` and an `.eyebrow`
- Navbar fixed, `h-16`; `main` carries `pt-16` to clear it

## 4. Components (`app/globals.css`)

| Class | What it does |
|---|---|
| `.hairline-grid` | Grid whose 1px gaps show the wrapper through, so cards read as divided by hairlines rather than bordered. Children must set their own background. |
| `.hairline-grid-invert` | Same on black. |
| `.card-hover` | Lift 4px + border darken + soft shadow, `cubic-bezier(0.16,1,0.3,1)`. |
| `.card-hover-invert` | Same lift, but *brightens* the border - the light-mode value is invisible on black. |
| `.btn-press` | `scale(0.97)` on `:active`. |
| `.eyebrow` / `.eyebrow-invert` | Uppercase mono section label. |
| `mark.hl` | Black highlight on quoted text. `box-decoration-break: clone` is load-bearing - without it a highlight wrapping to a second line loses its padding and radius at the break. |
| `.noise` | Fixed film-grain overlay, `z-9999`, `opacity 0.4`. |
| `prose-dedcell` | Typography plugin variant for article bodies: display-face headings, underlined (never coloured) links, monochrome code blocks. |

The navbar is transparent over the white page, then becomes **black glass** past
40px of scroll - so every child must flip to light at the same moment or black
text vanishes against it. `components/Navbar.tsx` does this with one `scrolled`
boolean rather than the live site's `!important` overrides.

## 5. Motion

Scroll reveals on the live site use GSAP + ScrollTrigger + Lenis + SplitType
four libraries, ~112KB, render-blocking. Not carried over. `globals.css` honours
`prefers-reduced-motion`, which the live site does not.

## 6. Rules

- [ ] No accent colours. Ever.
- [ ] Every section: `border-t` + `.eyebrow`.
- [ ] Dark blocks use the `-invert` variants - never the light-mode values.
- [ ] Headings are Space Grotesk; labels are JetBrains Mono; nothing else is either.
- [ ] Card grids are hairline-gap, not bordered.
- [ ] Links in prose are underlined, not coloured.

## 7. Known inconsistencies carried over from the live copy

Ported verbatim rather than silently rewritten - these are content decisions:

- **Testimonials and sample findings are placeholder** ("TStechy", the four
  sample CVEs). For a firm running a Founding Partner programme *specifically to
  earn its first testimonials*, fabricated ones are a credibility risk.
- **`docs/seo/03-CONTENT-STRATEGY.md:36` has `seim vs edr`** - SIEM misspelled,
  in a slug, in a document declaring slugs immutable once indexed.
- **The taxonomy count disagrees with itself**: prose says 13 categories,
  `02-IA-AND-ROUTING.md` §4 lists 17. `lib/taxonomy.ts` implements 17.
