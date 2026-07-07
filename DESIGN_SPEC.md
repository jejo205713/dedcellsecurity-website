# Dedcell Security — Website Design Spec (for Gemini Canvas rebuild)

> **Purpose:** Recreate this exact single-page website in Gemini Canvas.
> Keep **everything** the same except **Services** and **Pricing** content (flagged with 🔁 below).
> All Tailwind classes have been translated to raw hex/px so any tool can reproduce them.

---

## 0. How to use this with Gemini Canvas

Paste this whole file, then prompt:
> "Build a single-page responsive marketing website exactly to this spec. Dark theme, pure black background, monochrome (black/white/gray only — no other colors). Use plain HTML + CSS (or React + inline styles). Follow the section order, the exact copy, the exact hex values, spacing, and the fonts Inter (body/headings) + JetBrains Mono (labels/mono text) loaded from Google Fonts."

> All Services (§3.4) and Pricing (§3.7) content in this doc is already the final DEDCELL content — build it as written.

**Non-negotiable design DNA:** pure black, monochrome, thin 1px borders everywhere, generous whitespace, uppercase mono "eyebrow" labels above every section, `1px` gap grids that look like hairline dividers, subtle hover lift on cards, no accent colors at all.

---

## 1. Global design system

### Color palette (monochrome only)
| Token | Hex | Use |
|-------|-----|-----|
| Background (base) | `#000000` | page background |
| Surface / near-black | `#0a0a0a` | cards, contact form |
| Surface darker | `#050505` | TrustBar band |
| Input background | `#0d0d0d` | form fields |
| Section tint | `rgba(13,13,13,0.2)` / `rgba(13,13,13,0.1)` | alternating section bg (`bg-gray-900/20`, `/10`) |
| White (text/CTA) | `#ffffff` | headings, primary buttons |
| Gray 300 | `#c0c0c0` | feature text on light cards |
| Gray 400 | `#909090` | body text, nav links |
| Gray 500 | `#606060` | secondary/muted text |
| Gray 600 | `#404040` | faint text, icons |
| Gray 700 | `#303030` | very faint labels |
| Border | `rgba(255,255,255,0.1)` | **the** default 1px border, used everywhere |
| Border hover | `rgba(255,255,255,0.3)` | card/border hover |
| Grid lines | `rgba(255,255,255,0.03)` | background grid |

There are **no** colored accents. Severity badges, "popular" highlight, etc. are all done with white/gray opacity only.

### Typography
- **Sans (headings + body):** `Inter`, weights 400/500/600/700. Google Fonts.
- **Mono (labels, eyebrows, technical text):** `JetBrains Mono`, weights 300/400/500. Google Fonts.
- Headline scale: hero `clamp` from `3rem` (mobile) → `4.5rem` (md) → `6rem` (lg). Section H2s: `1.875rem` mobile → `3rem` (md). Font-weight 800 (extrabold) for most section titles, 700 for hero/pricing/CTA.
- Letter-spacing: headings `tracking-tight` (`-0.02em`); eyebrow/mono labels `tracking-widest` (`0.1em`) + `uppercase`.
- Body text: `0.875rem` (text-sm), line-height relaxed (~1.625), color `#606060`.

### Layout primitives
- **Max content width:** `max-w-7xl` = `80rem` (1280px), centered, horizontal padding `1.5rem` (24px). FAQ uses `max-w-4xl` = `56rem`.
- **Section vertical rhythm:** most sections `padding: 6rem 1.5rem` (`py-24`). Pricing/CTA `py-20` (5rem). TrustBar `py-14`.
- **Section divider:** every section starts with `border-top: 1px solid rgba(255,255,255,0.1)`.
- **Eyebrow label pattern** (top of every section): JetBrains Mono, `0.75rem`, `#606060`, uppercase, `letter-spacing: 0.1em`, e.g. `The Reality`, `What We Do`, `Our Process`.
- **Hairline-grid cards:** card grids use a wrapper with `background: rgba(255,255,255,0.1)` and `gap: 1px`, each cell `background: #000`. Result = cards separated by 1px white-ish lines (no visible borders, just the gap showing through).

### Reusable effects (CSS)
```css
/* Card hover — lift + faint border + soft glow */
.card-hover { transition: border-color .25s, transform .25s, box-shadow .25s; }
.card-hover:hover {
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255,255,255,0.04);
}

/* Button press */
.btn-press { transition: transform .1s ease, background .2s ease; }
.btn-press:active { transform: scale(0.97); }

/* Background grid (hero) */
.grid-bg {
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Film-grain noise overlay (fixed, on top, z-9999, opacity ~0.4 of a 0.03 noise) */
.noise::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.4;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}

/* Horizontal scan line sweeping down the page, infinite */
.scan-line {
  position:fixed; top:0; left:0; right:0; height:2px; z-index:1000; pointer-events:none;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  animation: scanLine 6s linear infinite;
}
@keyframes scanLine { 0%{transform:translateY(-2px)} 100%{transform:translateY(100vh)} }

/* Custom scrollbar */
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#000}
::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
::selection{background:#fff;color:#000}
html{scroll-behavior:smooth}
```

### Scroll reveal animation
Elements start `opacity:0; transform:translateY(28px)` and transition to visible over `0.7s ease` when scrolled into view (IntersectionObserver, threshold 0.1). Children stagger by 0.05–0.55s. Hero reveals on load after 100ms. *(Optional but part of the feel — Canvas can approximate with simple fade-up on scroll.)*

---

## 2. Page structure (exact top-to-bottom order)

```
1.  Navbar (fixed)
2.  Hero
3.  Pain ("The Reality")
4.  Services            ✅ updated (new 8 services)
5.  Methodology ("Our Process")
6.  TrustBar (3 pillars)
7.  Pricing             ✅ updated (new plans)
8.  Training
9.  WhyUs ("Why Dedcell")
10. Testimonials
11. SampleFindings (terminal-style report table)
12. FAQ (accordion)
13. CTA + ContactForm
14. Footer
```

Fixed overlays present on all pages: `.scan-line` (top), `.noise` grain (whole page).

---

## 3. Section-by-section spec

### 3.1 Navbar (fixed, top, z-50)
- Transparent at top; after scrolling >40px → `background: rgba(0,0,0,0.9)`, `backdrop-filter: blur(12px)`, bottom border `1px rgba(255,255,255,0.1)`. Height `4rem` (64px).
- **Left:** logo image (`/logo.png`, 32×32) + wordmark: **"Dedcell"** white semibold + **" Security"** in `#909090` normal. Font-size `0.875rem`, `tracking-wide`.
- **Center/right nav links** (desktop only, gap 2rem): `Services`, `Methodology`, `Pricing`, `Training`, `FAQ` → anchor to `#services`, `#methodology`, `#pricing`, `#training`, `#faq`. Color `#909090`, hover `#fff`.
- **CTA button** (right): "Get Assessment" + arrow icon. White bg `#fff`, black text, `padding: 0.5rem 1.25rem`, `border-radius: 0.5rem`, hover scale 1.02.
- **Mobile:** hamburger (3 lines that morph to X); menu drops down with `background: rgba(0,0,0,0.95)` blur, same links stacked + CTA.

### 3.2 Hero (min-height 100vh, centered, `.grid-bg`)
- Background: `.grid-bg` (60px grid) + a radial glow overlay: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)`.
- **Four corner brackets** (decorative L-shaped 1px borders, 48×48px) at top-left, top-right, bottom-left, bottom-right (inset ~24px / 80px top).
- **Status badge** (pill, centered): dot (white, slow pulse) + mono text `ACTIVE THREAT INTELLIGENCE — 2024`, `0.75rem`, `#909090`, uppercase, wide tracking. Border `1px rgba(255,255,255,0.1)`, bg `rgba(255,255,255,0.05)`, rounded-full.
- **Headline (H1):** `Secure Your Business.` — Inter bold, `3rem → 7rem` responsive, line-height 1.05, tracking-tight, white.
- **Subhead:** `Enterprise-grade cybersecurity built for MSMEs. We find your vulnerabilities before attackers do — and we fix them.` — `#909090`, max-width ~36rem, centered.
- **CTAs (row):**
  - Primary: `Request a Free Audit` + arrow → white bg, black text, `padding: 0.875rem 2rem`, rounded-lg.
  - Secondary: `View Services` → transparent, `1px rgba(255,255,255,0.2)` border, white text, hover border brightens + bg `rgba(255,255,255,0.05)`.
- **Stats row** (3 cols, top border, `padding-top: 2.5rem`, max-w-lg centered):
  - `200+` — `Assessments Done`
  - `0` — `Client Breaches`
  - `48hr` — `Report Delivery`
  - Numbers: Inter bold `1.5rem` white; labels `0.75rem` `#606060` uppercase.
- Bottom gradient fade to black (`h-32`).

### 3.3 Pain — "The Reality"
- Eyebrow: `The Reality`.
- **H2:** `MSMEs Are the ` (white) + `Easiest Target.` (`#909090`). Extrabold, up to `3rem`.
- Intro (mono, `#606060`): `Attackers know growing businesses skip security. They exploit it daily. The question isn't *if* you'll be targeted — it's whether you'll be ready.`
- **4-card hairline grid** (1 col → 2 → 4). Each card `background:#000`, `padding:2rem`, `.card-hover`: icon (gray stroke SVG) + big stat (Inter bold `2.25rem`, tabular) + description (`#606060`, sm).
  1. `43%` — `of all cyberattacks target small and medium businesses`
  2. `₹7 Cr+` — `average cost of a data breach for Indian MSMEs in 2024`
  3. `207 days` — `average time to identify a breach without security monitoring`
  4. `60%` — `of MSMEs shut down within 6 months of a major breach`
- **Callout box** below (1px border, padding): clock icon + text — **"Most MSMEs think they're too small to be targeted."** (white bold) *That's exactly what attackers count on. Automated scanners don't discriminate by company size — they exploit any vulnerability they find.* (mono `#909090`)

### 3.4 Services ✅ (service cards updated) — "What We Do"
> **Only the service cards were replaced** (old 6 → new 8, from the DEDCELL business plan). Section eyebrow, H2, side-note, and layout are unchanged per "change service info only." Layout is still the numbered hairline card grid (1 → 2 → 3 cols), icon top-left + number top-right, title, description, tag chips at bottom. **8 cards** now — the grid handles the uneven last row (3 + 3 + 2) fine.

- `id="services"`. Eyebrow: `What We Do`.
- **H2:** `Security Services` / `Built for MSMEs` (unchanged — ⚠️ see positioning note in §7; the new plan targets *startups*). Side note (unchanged, mono, right-aligned on desktop): `No jargon. No bloat. Precise, actionable security work delivered by certified professionals.`
- **Card grid** (1 → 2 → 3 cols, hairline gap). Card structure (unchanged):
  - Top row: icon (gray SVG, brightens on hover) left; number (`01`, mono `#303030`) right.
  - Title (Inter bold `1.125rem` white) + description (`#606060` sm).
  - Bottom: tag chips — mono `0.75rem`, `1px rgba(255,255,255,0.1)` border, `padding: 0 0.5rem`, `#404040`, brighten on hover.

  New 8 core services (id / title / desc / tags):
  1. **01 — Web Application Penetration Testing** — "Black-box assessment of your web apps — authentication, authorization, business logic, and the full OWASP Top 10." — `OWASP Top 10`, `SQLi`, `XSS`, `Business Logic`
  2. **02 — API Security Assessment** — "REST, GraphQL, and SOAP testing — auth, rate limiting, business logic, and API abuse." — `REST`, `GraphQL`, `JWT / OAuth`, `Rate Limiting`
  3. **03 — External Network Penetration Testing** — "Internet-facing infrastructure — firewalls, VPNs, public and mail servers, and service misconfigurations." — `Firewall`, `VPN`, `Enumeration`, `Public Servers`
  4. **04 — Internal Network Assessment** — "Internal infrastructure — Windows domains, Linux servers, privilege escalation, and lateral movement." — `Windows AD`, `Linux`, `PrivEsc`, `Lateral Movement`
  5. **05 — Cloud Security Assessment** — "AWS, Azure, and GCP review — IAM, storage security, security groups, and cloud misconfigurations." — `AWS`, `Azure`, `GCP`, `IAM`
  6. **06 — Mobile Application Security Testing** — "Android and iOS — secure storage, certificate pinning, authentication, backend APIs, and reverse engineering." — `Android`, `iOS`, `Cert Pinning`, `Reverse Eng.`
  7. **07 — Secure Code Review** *(optional)* — "Manual + static review across Java, Python, Node, React, Go, PHP, and C# — secrets, auth, and architecture." — `Manual Review`, `SAST`, `Secret Detection`, `Architecture`
  8. **08 — Remediation Support** *(separate engagement)* — "We don't stop at findings — we help fix vulnerable code, secure APIs, harden cloud, and verify remediation before deploy." — `Fix Guidance`, `API Hardening`, `Cloud Hardening`, `Verification`

- **Optional "Additional Services" strip** (small mono line below the grid, if you want it): *Also available — Compliance Readiness (ISO 27001, SOC 2, PCI DSS, HIPAA), DevSecOps (CI/CD security, SAST/DAST, dependency & secret scanning, container security, SBOM), Secure SDLC (threat modeling, architecture & design reviews), and Developer Security Training.*

### 3.5 Methodology — "Our Process" (`id="methodology"`, bg tint `rgba(13,13,13,0.2)`)
- Eyebrow `Our Process`. **H2:** `How We ` + `Break In` (`#909090`) + `(To Keep You Safe)`.
- **Vertical timeline** (desktop): center vertical 1px line; each step alternates left/right; center diamond dot (12×12 bordered square, inner dot). Each step: `STEP 0X` (mono `#303030`) + title (Inter bold `1.25rem`) + description (`#606060`), and a bordered detail box with `•`-separated mono terms joined by ` · `.
  1. **01 Reconnaissance** — "Passive and active information gathering. We map your entire attack surface before writing a single line of exploit code." — detail: `OSINT • DNS Enum • Subdomain Discovery • Tech Stack Fingerprinting`
  2. **02 Threat Modeling** — "We identify what matters most to your business and model adversarial scenarios based on your specific risk profile." — `Asset Identification • Risk Scoring • Attack Vector Analysis • Priority Matrix`
  3. **03 Exploitation** — "Controlled, safe execution of discovered vulnerabilities to prove real-world impact — no false positives." — `Manual Testing • CVE Exploitation • Chain Attacks • Privilege Escalation`
  4. **04 Post-Exploitation** — "We determine what an attacker could actually do once inside — lateral movement, data exfiltration, persistence." — `Lateral Movement • Data Access • Persistence Simulation • Impact Assessment`
  5. **05 Reporting** — "Executive summary for leadership + detailed technical report for your dev team. Delivered within 48 hours." — `Severity Ratings • PoC Evidence • Remediation Steps • Retest Included`
  6. **06 Remediation Support** — "We don't just find problems — we help you fix them. Free retest after remediation to verify all findings are closed." — `Fix Guidance • Code Review • Config Hardening • Free Retest`

### 3.6 TrustBar (bg `#050505`, `py-14`)
- 3-column hairline grid (rounded-xl), each cell `background:#050505`, icon + title + desc, subtle hover bg lighten.
  1. **Built for Startups & MSMEs** — "Security processes designed for lean teams — no enterprise bloat."
  2. **Affordable Security** — "Enterprise-grade protection at prices that make sense for growing businesses."
  3. **Founder-Led Security Team** — "You talk directly to senior engineers — not account managers."

### 3.7 Pricing ✅ (plans updated) — "Transparent Pricing" (`id="pricing"`)
> **Only the three plan cards + fine print were replaced**, mapped from DEDCELL's new scope-based pricing model. Eyebrow, H2, side-note, and layout unchanged. Keep the 3-card layout, the middle card highlighted (inverted white bg / black text, pill, slight scale-up + white glow), the checkmark feature list + dashed "missing" items at 25% opacity, and the per-card CTA. A per-service reference price table is added below the cards.

- Eyebrow `Transparent Pricing`. **H2:** `No Hidden Fees. ` + `No Surprises.` (`#606060`) — unchanged. Side note (unchanged): `Fixed-scope engagements with clear deliverables. You know exactly what you're getting — and what it costs.`
- **3 cards** (1 → 3 cols, gap 1rem). Card: `border-radius:0.75rem`, header (name eyebrow + price `2.25rem` bold tabular + optional note + `period · tagline`), feature `<ul>` with check-SVG bullets, missing items shown as dashed/minus at `opacity:0.25`, footer CTA button.
  - **Non-highlight card:** bg `#0a0a0a`, white text, border `rgba(255,255,255,0.1)`, hover lift; CTA = outlined button.
  - **Highlight card (middle):** bg `#fff`, black text, border white, `box-shadow: 0 0 60px rgba(255,255,255,0.07)`, `scale(1.02)`; pill (black bg, white text, rounded-full); CTA = solid black button.

  New plans:

  **Founding Partner — ₹12,500 – ₹17,500** (note: `First 3–5 qualified clients only`) · one-time · "For MVP / early-stage SaaS"
  - ✓ MVP / early-stage web app assessment
  - ✓ Full technical report + CVSS ratings
  - ✓ Proof of Concept + remediation guidance
  - ✓ 1 complimentary retest (30 days)
  - ✓ Developer walkthrough
  - ✕ Quarterly VAPT · ✕ Continuous scanning
  - CTA: `Apply — Limited Spots`
  - *(Requirements: logo displayed on our site + a founder/CTO testimonial + approval of a sanitized case study.)*

  **Standard VAPT — ₹25,000+** (note: `₹25,000 – ₹70,000 by scope`) · per project · "Seed to Series A startups" · **HIGHLIGHTED** (pill text: `MOST POPULAR`)
  - ✓ Web / API / Mobile / Cloud assessment
  - ✓ Executive + technical report
  - ✓ CVSS ratings + business impact analysis
  - ✓ Proof of Concept + reproduction steps
  - ✓ 1 complimentary retest (30 days)
  - ✓ Developer walkthrough + final verification report
  - ✕ Continuous scanning · ✕ Unlimited consultation
  - CTA: `Request a Quote`

  **Security Partnership — from ₹2,00,000** (period: `/ year`) · "For scaling & multi-product teams"
  - ✓ Everything in Standard VAPT
  - ✓ Quarterly VAPT
  - ✓ Monthly vulnerability scanning
  - ✓ Unlimited security consultation
  - ✓ Priority retesting
  - ✓ Security questionnaire assistance
  - ✓ Architecture review sessions
  - ✓ Annual security health report
  - CTA: `Contact Us`

- **Reference price table** (render as a compact bordered table below the cards, or fold into the fine print):

  | Engagement | Target Client | Price |
  |---|---|---|
  | MVP / Early-Stage SaaS | Seed-stage, limited scope | ₹25,000 – ₹35,000 |
  | Growth SaaS | Series A, moderate complexity | ₹45,000 – ₹70,000 |
  | Mobile App Assessment | Android/iOS + backend APIs | ₹30,000 – ₹45,000 |
  | Cloud Infrastructure Review | AWS, Azure, or GCP | ₹25,000 – ₹40,000 |
  | Enterprise Assessment | Large / multi-product | Custom Quote |

- Fine print under cards: `Final pricing is set after scoping — based on number of apps & APIs, infrastructure size, authentication complexity, testing duration, and required deliverables. NDA signed before engagement. GST applicable. Founding Partner pricing is limited to the first 3–5 qualified clients, after which standard pricing applies.`

### 3.8 Training (`id="training"`, bg tint `rgba(13,13,13,0.1)`)
- Eyebrow `Security Training`. **H2:** `Build a Security-First` / `Culture` (`#606060`). Side note (mono): `Technology alone doesn't stop breaches. Your people do. We train your team to be your strongest security layer.`
- **2-col hairline grid** of course cards. Each: top row `CODE` (mono `#303030`) + audience chip (bordered); title (Inter bold `1.25rem`); description (`#606060`); footer row (top border) with clock icon+duration and calendar icon+format (both mono `#404040`).
  1. **SEC-101 — Security Awareness Fundamentals** — audience `All Employees` — `4 hours` · `Online / In-person` — "Phishing, social engineering, password hygiene, and safe browsing for every team member."
  2. **SEC-201 — Secure Development Practices** — `Dev Teams` — `2 days` · `Workshop` — "OWASP Top 10, secure coding patterns, SAST/DAST integration, and code review for vulnerabilities."
  3. **SEC-301 — Incident Response Drills** — `IT & Management` — `1 day` · `Tabletop Exercise` — "Live simulation of breach scenarios. Build your response muscle memory before a real incident."
  4. **SEC-401 — Ethical Hacking Bootcamp** — `Security Professionals` — `5 days` · `Intensive` — "Hands-on penetration testing, CTF challenges, and real-world exploitation techniques."
- **Custom-training banner** (bordered, flex): **"Custom Training Programs"** + "We build bespoke training programs tailored to your industry, tech stack, and team skill level." + outlined mono button `Discuss Training`.

### 3.9 WhyUs — "Why Dedcell"
- Eyebrow `Why Dedcell`. **H2:** `We Do Security` / `Differently.` (`#606060`).
- **3-col hairline grid**, 6 cards, each: icon + title (Inter bold `1rem`) + desc (`#606060`).
  1. **MSME-First Approach** — "We built our processes specifically for businesses without full-time security teams. No enterprise bloat. Just the security you actually need."
  2. **Certified Professionals** — "CEH, OSCP, CISSP certified team. Every engagement is led by a senior pentester with 5+ years of real-world offensive security experience."
  3. **48-Hour Reporting** — "Most firms take 2 weeks. We deliver your complete report — executive summary + full technical findings — within 48 hours of engagement end."
  4. **Zero False Positives** — "Every finding is manually verified before it appears in your report. We don't spam you with scanner noise — just real, exploitable vulnerabilities."
  5. **Free Retest Included** — "After you remediate, we retest every finding at no extra cost. We don't close the loop until your vulnerabilities are actually fixed."
  6. **NDA-Protected Always** — "We sign a mutual NDA before every engagement. Your findings, your business data, and your vulnerabilities stay strictly confidential."

### 3.10 Testimonials (bg tint `rgba(13,13,13,0.1)`)
- Eyebrow `Client Feedback`. **H2:** `Trusted by Businesses` / `Across India` (`#606060`).
- **3-col hairline grid**. Each card: giant faint `"` quote glyph (`#1a1a1a`, `3.75rem`), quote (`#909090`), footer row (top border) with square initials avatar (`rgba(255,255,255,0.1)` bg) + author (bold white) + `title · company` (mono `#404040`) + source chip (bordered).
  1. **TStechy** — Founder & CTO · Tech Startup, Bangalore — source `LinkedIn` — initials `TS` — "Dedcell Security found 3 critical vulnerabilities in our customer portal that we had no idea about. Their report was clear, actionable, and delivered faster than any vendor we've worked with. Highly recommend for any MSME that takes security seriously."
  2. **Priya R.** — Head of Engineering · E-Commerce Platform — `Google Review` — `PR` — "We were nervous about pentesting — worried it'd be too technical and expensive. Dedcell made it painless. The team explained everything clearly, and the pricing was fair. The free retest after we fixed issues was a huge bonus."
  3. **Karthik M.** — COO · Logistics SaaS, Chennai — `Direct Referral` — `KM` — "After a near-miss phishing incident, we engaged Dedcell for security training. They customized the entire program for our 40-person team. Six months later, zero incidents. The ROI is obvious."

### 3.11 SampleFindings — "Sample Report Output"
- Eyebrow `Sample Report Output`. **H2:** `Real Findings.` / `Real Impact.` (`#606060`). Side note: `Anonymized samples from actual engagements. Every finding includes PoC evidence, CVSS score, and remediation steps.`
- **Terminal-window styling:** bordered container; header bar (`rgba(255,255,255,0.05)`) with 3 fake window dots (`rgba(255,255,255,0.2)`) + mono title `dedcell-report-v2.4 — FINDINGS SUMMARY`.
- **Column header row** (4 cols): `ID`, `SEVERITY`, `TITLE`, `FIX` (mono `#303030` uppercase).
- **Finding rows** (4-col grid each): ID + CWE/OWASP ref; severity badge (see below); title (bold) + description + `Impact:` line (all mono/gray); fix (check icon + text).
  - Severity badge styles (monochrome, opacity-based): `CRITICAL` = white text on `rgba(255,255,255,0.1)`, border `rgba(255,255,255,0.3)`; `HIGH` = `#c0c0c0` on `rgba(255,255,255,0.05)`; `MEDIUM` = `#909090`; `LOW` = `#404040`.

  1. **FIND-001 · CWE-89 · CRITICAL — SQL Injection in Login Endpoint** — desc: "Unsanitized user input in authentication endpoint allowed blind SQL injection. Attacker could extract all user credentials and session tokens." — Impact: "Complete database dump, authentication bypass, remote code execution possible" — Fix: `Parameterized queries + WAF rule`
  2. **FIND-002 · OWASP API1 · HIGH — Broken Object Level Authorization** — desc: "API endpoint accepted arbitrary user IDs without ownership verification. Any authenticated user could read/modify other accounts." — Impact: "Unauthorized access to other users' data, PII exposure" — Fix: `Enforce ownership checks server-side`
  3. **FIND-003 · CWE-284 · HIGH — Exposed AWS S3 Bucket** — desc: "Production S3 bucket with public ACL containing 12,000+ customer documents including KYC data." — Impact: "Public access to customer documents, contracts, and backup files" — Fix: `Set bucket ACL to private, enable encryption`
  4. **FIND-004 · CVE-2014-3566 · MEDIUM — Outdated SSL/TLS Configuration** — desc: "Server accepted TLS 1.0 and SSLv3 with RC4 cipher suite, vulnerable to known protocol-level attacks." — Impact: "POODLE attack vector, weak cipher suites enabled" — Fix: `Enforce TLS 1.2+ only, update cipher suite`
- Footer note: `All findings redacted and anonymized. Actual reports include full PoC, screenshots, CVSS 3.1 scores, and step-by-step remediation.`

### 3.12 FAQ (`id="faq"`, bg tint `rgba(13,13,13,0.1)`, `max-w-4xl`)
- Eyebrow `FAQ`. **H2:** `Common Questions` / `Answered.` (`#606060`).
- **Accordion** (each item: 1px bottom border, question row is a button with a `+` icon that rotates 45° to `×` when open; answer expands). Questions/answers:
  1. **Will pentesting break or disrupt our systems?** — "No. All testing is conducted within a scoped, controlled manner. We agree on a testing window (usually non-peak hours) and have a clear rules-of-engagement document signed before we begin. In 5+ years, we've never caused a production outage."
  2. **How long does a typical engagement take?** — "Web application assessments typically take 3–5 business days. Network assessments 5–7 days. Full enterprise red team engagements 2–4 weeks. We'll give you a precise timeline during scoping."
  3. **Do you sign an NDA before starting?** — "Always. A mutual NDA is signed before any scoping call where you share system details. Your vulnerability data, business information, and findings are strictly confidential."
  4. **What happens after we receive the report?** — "We schedule a debrief call to walk through every finding. After you remediate, we conduct a free retest within your retest window (30–90 days depending on plan) to verify fixes are effective."
  5. **Do you test cloud environments like AWS/Azure?** — "Yes. Cloud configuration review is included in Business and Enterprise plans. We check for misconfigured IAM policies, exposed storage buckets, insecure services, and privilege escalation paths."
  6. **Is penetration testing legal?** — "Yes — with proper written authorization. We require a signed Statement of Work and Rules of Engagement before testing. This legally authorizes our activities and protects both parties."
  7. **Can we get a compliance certificate after the assessment?** — "Yes. We provide a signed attestation letter suitable for audits, client requirements, and compliance submissions (ISO 27001, SOC 2, RBI, SEBI frameworks)."
  8. **Do you offer ongoing security retainers?** — "Yes. Our retainer plans include quarterly assessments, continuous monitoring, and priority incident response. Contact us for custom retainer pricing."

### 3.13 CTA + Contact (`id="contact"`, `py-20`)
- **2-column** grid (stacks on mobile).
- **Left column:** eyebrow `Get Started`; **H2** `Know Your Risks` / `Before Attackers Do.` (`#606060`); paragraph "Get a free 30-minute security consultation. We'll assess your current posture and recommend exactly where to start."; checklist (white check icons):
  - `No commitment required` · `NDA signed before we talk` · `Response within 4 business hours` · `Serving businesses across India`
  - Contact links (top border): email `jejo205713@gmail.com`, phone `+91 99999 99999`.
- **Right column — Contact form** card (`background:#0a0a0a`, border `rgba(255,255,255,0.1)`, `border-radius:1rem`, `padding:2rem`):
  - Heading **"Request a Security Audit"** + sub "Free 30-min consultation. No commitment required."
  - Fields (labels are uppercase mono-ish `0.75rem` `#909090`): **Name** (required) + **Email** (required) in a 2-col row; **Phone** (optional) + **Business Name** (optional) 2-col row; **Message** (required, textarea, 4 rows).
    - Input style: bg `#0d0d0d`, border `rgba(255,255,255,0.1)`, `border-radius:0.75rem`, `padding:0.75rem 1rem`, white text, placeholder `#606060`, focus → border `rgba(255,255,255,0.4)` + faint ring.
  - Validation: name required; email must match `/^[^@]+@[^@]+\.[^@]+$/`; message ≥10 chars. Errors show a small circle-i icon + gray message.
  - **Submit button:** full width, white bg, black text, bold, `Request a Security Audit` + arrow; shows spinner + "Sending..." while loading.
  - On success → replaces form with a checkmark circle + **"Message Received"** + "We'll review your details and get back to you within **4 business hours.** Check your inbox." + a "Submit another request" link.
  - Fine print: "No spam. NDA available before scoping call. jejo205713@gmail.com"
  - ⚠️ **Note:** in the original the form only `console.log`s and does not actually send anywhere — if you want it functional in the rebuild, wire the submit to a real endpoint/email service.

### 3.14 Footer (border-top, `py-16`)
- **4-col grid** (brand spans 2 cols).
  - **Brand col:** logo + wordmark `DEDCELL SECURITY` (uppercase, wide tracking, "Security" in `#606060`); blurb "Securing Businesses. Enterprise-grade cybersecurity built for MSMEs across India. Find vulnerabilities before attackers do."; social icons (LinkedIn, Twitter — bordered 32×32 squares); email + phone links.
  - **Services col** (mono links) — updated to match new services: `Web App Pentest`, `API Security`, `Network Pentest`, `Cloud Security`, `Mobile Security`, `Secure Code Review`.
  - **Company col** (mono links): `About`, `Pricing`, `Training`, `Case Studies`, `Blog`, `Contact`.
- **Certifications strip** (bordered): label `Certified:` + chips `CEH`, `OSCP`, `CISSP`, `ISO 27001`, `VAPT`.
- **Bottom bar** (top border): `© 2024 Dedcell Security. All rights reserved.` + links `Privacy Policy`, `Terms of Service`, `Responsible Disclosure`.

---

## 4. Assets & meta
- **Logo:** `/logo.png` (square, ~300×300 source; shown 32×32). Icon variant `/logo-icon.png`. Favicon `/favicon.ico`. *(You'll need to re-upload these into Canvas.)*
- **Page title:** `Dedcell Security — Securing Businesses`
- **Meta description:** "Dedcell Security provides enterprise-grade cybersecurity services for MSMEs — penetration testing, vulnerability assessments, security training, and managed security tailored for growing businesses."
- **theme-color:** `#000000`. `lang="en"`.

---

## 5. Quick checklist for a faithful rebuild
- [ ] Pure black `#000` bg, monochrome only — **zero** accent colors.
- [ ] Inter + JetBrains Mono from Google Fonts.
- [ ] Every section: top 1px border + uppercase mono eyebrow label.
- [ ] Hairline-gap card grids (1px light gaps, not visible borders).
- [ ] Card hover: lift 2px + border brighten + faint white glow.
- [ ] Fixed scan-line + noise grain overlays.
- [ ] Middle pricing card inverted (white) + "POPULAR".
- [ ] Fixed navbar that gains blur/bg after 40px scroll.
- [ ] Scroll-reveal fade-up on sections.
- [x] **Services** (§3.4) and **Pricing** (§3.7) content updated to the DEDCELL business plan.
- [ ] Decide whether to also sweep the remaining MSME→startup copy (see §7).

---

## 7. ⚠️ Consistency notes after the Services/Pricing update

You asked me to change **only** services and pricing, so I left everything else verbatim. That leaves these spots inconsistent with the new business plan — decide if you want them swept too:

- **Positioning: MSME → startup.** The new plan targets startups (SaaS, FinTech, AI, Seed→Series A). But the site still says "MSME" throughout: Hero subhead, Pain section (§3.3, all copy is MSME-framed), Services H2 "Built for MSMEs" (§3.4), TrustBar "Built for Startups & MSMEs" (§3.6), Training/WhyUs/Testimonials/Footer blurb. If the brand is now startup-first, these read off-message.
- **FAQ references dead plan names (§3.12).** Answer #5 says cloud review is "included in **Business and Enterprise plans**" — those tiers no longer exist (now Founding Partner / Standard VAPT / Security Partnership). Answers #4 and #8 mention retest windows "30–90 days" and retainers; the new model is a flat 30-day retest + annual partnership. Update these to match.
- **Retest window changed.** Old plans offered up to 90-day / unlimited retests; the new deliverables say **one complimentary retest within 30 days**. WhyUs "Free Retest Included" (§3.9) and the ContactForm/CTA copy are fine, but any "90 days" mention should go.
- **Testimonials & Sample Findings are placeholder/fabricated** (§3.10, §3.11) — "TStechy", "200+ assessments", the 4 sample CVEs. For a brand-new consultancy running a Founding Partner program *specifically to earn its first testimonials*, showing fake ones is a credibility risk. Consider a "coming soon" state or removing until you have real ones.
- **Contact still shows a placeholder phone** `+91 99999 99999` and `© 2024` — update before launch.

Say the word and I'll do a full startup-repositioning pass across the whole doc.
