# Dedcell Security - Company Brochure

> Source of truth: `public/index.html` (the entire site is a single-file client-side router).
> Everything below is transcribed from the live site copy - not invented.
> Last synced: 27 July 2026.

---

## 1. Company Snapshot

| Field | Value |
|---|---|
| Company name | **Dedcell Security** |
| Positioning line | Expert-led Offensive Security |
| Website | https://dedcellsecurity.in/ |
| Primary contact email | jejo@dedcellsecurity.in |
| Legal / disclosure email | dedcellsec@gmail.com |
| LinkedIn | https://www.linkedin.com/company/dedcell-security |
| Discovery call booking | Google Calendar appointment schedule (linked from home CTA) |
| Market | Startups across India (seed → Series A → scaling multi-product teams) |
| Governing law | India |
| Copyright line | © 2026 Dedcell Security. All rights reserved. |

**Meta description / elevator pitch (verbatim):**
> Expert-led offensive security for modern startups. Web, API, Cloud, and Mobile penetration testing without the enterprise bloat.

**Hero headline:** *Secure Your Business.*
**Hero subline:** *Enterprise-grade cybersecurity built for startups. We find your vulnerabilities before attackers do - and we fix them.*

**Footer positioning:** *Expert-led offensive security for modern startups across India. We find your vulnerabilities before attackers do.*

---

## 2. Brand Theme - Exact Colors

The site is a **strict monochrome system**: pure black, pure white, and a 5-step grey ramp. There are no brand accent colors - the only chromatic values in the whole site are three status dots and one error state.

### 2.1 Core palette (from the Tailwind config, `public/index.html`)

| Token | Hex | Where it's used |
|---|---|---|
| `black` | `#000000` | Primary text, buttons, inverted sections, navbar glass, `::selection` background |
| `white` | `#ffffff` | Page background, inverted-section text, button text on black |
| `surface` | `#f5f5f5` | Pricing section background, contact form card, success-state panel |
| `surfaceDark` | `#f0f0f0` | Reserved darker surface step |
| `inputBg` | `#fafafa` | Form input / textarea fill |
| `gray.300` | `#c0c0c0` | Lightest grey step |
| `gray.400` | `#909090` | Eyebrow / kicker label text |
| `gray.500` | `#606060` | **Default body text color** (`body { color: #606060 }`), secondary copy, muted headline halves |
| `gray.600` | `#404040` | Footer legal text, icons, fine print |
| `gray.700` | `#303030` | Card index numbers (01-08), quote glyphs |

### 2.2 Borders, overlays and alpha values

| Purpose | Exact value |
|---|---|
| `--border-light` (default hairline) | `rgba(0, 0, 0, 0.1)` |
| `--border-hover` (card hover border) | `rgba(0, 0, 0, 0.3)` |
| Dark-section hairline / border | `rgba(255, 255, 255, 0.14)` |
| Dark card hover border | `rgba(255, 255, 255, 0.28)` |
| Inverted eyebrow text | `rgba(255, 255, 255, 0.55)` |
| Dark-section body copy | `rgba(255,255,255,0.6)` (`text-white/60`) |
| Dark-section muted labels | `rgba(255,255,255,0.5)` (`text-white/50`) |
| Inverted card fill | `rgba(255,255,255,0.06)` (`bg-white/[0.06]`) |
| Navbar glass (scrolled) | `rgba(0, 0, 0, 0.85)` + `backdrop-filter: blur(12px)` |
| Mobile menu panel | `rgba(255,255,255,0.95)` + `backdrop-blur-xl` |
| Card hover shadow (light) | `0 12px 40px rgba(0,0,0,0.06)` |
| Card hover shadow (dark) | `0 18px 50px rgba(0,0,0,0.28)` |
| Highlighted pricing card glow | `0 0 60px rgba(0,0,0,0.07)` |
| Hero radial wash | `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,0,0,0.04) 0%, transparent 70%)` |
| Film-grain noise overlay | SVG `feTurbulence`, `baseFrequency 0.9`, layer opacity `0.4`, rect opacity `0.03` |
| Scrollbar track / thumb | `#fff` / `#ccc`, 4px wide, 2px radius |
| `<meta name="theme-color">` | `#ffffff` |

### 2.3 The only non-monochrome colors on the site

| Element | Color |
|---|---|
| Telemetry dot - red | `bg-red-500` / border `red-400/30` |
| Telemetry dot - amber | `bg-amber-400` / border `amber-300/30` |
| Telemetry dot - green | `bg-emerald-500` / border `emerald-400/30` |
| Form validation error text | `text-red-400` |

### 2.4 Typography

| Role | Font | Weights loaded |
|---|---|---|
| Sans / UI / body | **Inter** | 400, 500, 600, 700, 800 |
| Mono / eyebrows / tags / labels | **JetBrains Mono** | 300, 400, 500 |
| Display (`h1` - `h4`, quote glyphs) | **Space Grotesk** | 500, 600, 700 |

- Eyebrow style: JetBrains Mono, `0.75rem`, uppercase, letter-spacing `0.1em`, color `#909090`.
- Custom `letterSpacing.widest` = `0.1em`.
- Headline pattern: extrabold black first line + `#606060` grey second line (e.g. "Startups Are the **Easiest Target.**").
- Highlight style `mark.hl`: black fill, white text, weight 600, `0.12em 0.36em` padding, `0.25rem` radius, `box-decoration-break: clone`.

### 2.5 Motion & interaction language

- Card hover: `translateY(-4px)`, `0.4s cubic-bezier(0.16, 1, 0.3, 1)`, border darkens.
- Button press: `scale(0.97)` at `0.1s`.
- Libraries: **GSAP 3.12.2 + ScrollTrigger**, **SplitType**, **Lenis 1.0.27** smooth scroll.
- Icons: **Lucide**.
- Signature layout device: "hairline grid" - 1px `rgba(0,0,0,0.1)` gaps between white cells, inverted to `rgba(255,255,255,0.14)` on black.
- Section rhythm: alternating **white → black** full-bleed bands (Hero white → Reality white → TrustBar black → Services white → Process black → Testimonials white → CTA black).

---

## 3. What We Do - Core Services (8)

| # | Service | Description (as published) | Tags |
|---|---|---|---|
| 01 | **Web Application Penetration Testing** | Black-box assessment of your web apps - authentication, authorization, business logic, and the full OWASP Top 10. | OWASP Top 10 · SQLi · Logic Flaws |
| 02 | **API Security Assessment** | REST, GraphQL, and SOAP testing - auth, rate limiting, business logic, and API abuse. | REST · GraphQL · JWT / OAuth |
| 03 | **External Network Pentest** | Internet-facing infrastructure - firewalls, VPNs, public servers, and critical service misconfigurations. | Firewall · VPN · Enum |
| 04 | **Internal Network Assessment** | Internal infrastructure - Windows domains, Linux servers, privilege escalation, and lateral movement simulations. | Windows AD · PrivEsc · Lateral Movement |
| 05 | **Cloud Security Assessment** | AWS, Azure, and GCP architecture review - IAM policies, storage security, security groups, and misconfigurations. | AWS / Azure / GCP · IAM |
| 06 | **Mobile Application Security** | Android and iOS - secure storage, certificate pinning bypass, auth flaws, backend API linking, and reverse engineering. | Android / iOS · Cert Pinning |
| 07 | **Secure Code Review** | Manual + static review across Java, Python, Node, Go, PHP, and C# - secrets, auth handling, and architecture. | Manual Review · SAST |
| 08 | **Remediation Support** | We don't stop at findings - we help fix vulnerable code, secure APIs, harden cloud, and verify remediation before deploy. | Fix Guidance · Verification |

**Services page promise:** *No jargon. No bloat. Precise, actionable security work delivered by certified professionals.*

### Additional capabilities (listed as "also available")

- **Compliance Readiness** - ISO 27001, SOC 2, PCI DSS
- **DevSecOps** - CI/CD security, SAST/DAST
- **Secure SDLC** - threat modeling
- **Security Training** - customizable, team-wide programs

---

## 4. Our Process - 6 Steps

> Section title: *How We Break In (To Keep You Safe)*

| Step | Phase | What happens | Techniques shown |
|---|---|---|---|
| 01 | **Reconnaissance** | Passive and active information gathering. We map your entire attack surface before writing a single line of exploit code. | OSINT · DNS Enum · Subdomain Discovery · Tech Stack Fingerprinting |
| 02 | **Threat Modeling** | We identify what matters most to your business and model adversarial scenarios based on your specific risk profile and tech stack. | Asset ID · Risk Scoring · Attack Vectors · Priority Matrix |
| 03 | **Exploitation** | Controlled, safe execution of discovered vulnerabilities to prove real-world impact - absolutely zero false positives. | Manual Testing · Logic Flaws · Chain Attacks · Privilege Escalation |
| 04 | **Post-Exploitation** | We determine what an attacker could actually do once inside - lateral movement, data access, and persistence. | Lateral Movement · Data Access · Persistence · Impact Assessment |
| 05 | **Reporting** | Executive summary for leadership + detailed technical breakdown with exact reproduction steps for your engineering team. | Severity Ratings · PoC Evidence · Remediation Steps |
| 06 | **Remediation Support** | We don't just find problems - we help you fix them. Free retest after remediation to verify all findings are closed. | Fix Guidance · Config Hardening · Verification Retest |

---

## 5. Delivery Standards ("Defense Engine" panel)

| Metric | Commitment |
|---|---|
| Testing methodology | **Manual + SAST** |
| Turnaround time | **5 business days** |
| Retest SLA | **Complimentary** (within 30 days) |
| Findings quality | **100% verified findings** - zero false positives |
| Coverage line | OWASP Top 10 · API Security · AWS/GCP Security · ISO 27001 Alignment |
| Enquiry response time | **Within 4 business hours** |
| Consultation | Free 30-minute security consultation, no commitment |
| Confidentiality | Mutual NDA signed before scoping |

---

## 6. Why Dedcell - Six Differentiators

*Page thesis: "Traditional security firms are slow, expensive, and rely heavily on automated tools. We built Dedcell specifically for fast-moving startups. Manual testing, transparent communication, and clear reporting within days - not weeks."*

1. **Startup-First Approach** - processes built for agile teams. No enterprise bloat, no multi-week onboarding.
2. **Certified Professionals** - CEH, OSCP, CISSP certified team. Every engagement led by a senior pentester with 5+ years of offensive security experience. No junior analysts learning on your dime.
3. **Fast, Clear Reporting** - complete report (executive summary + technical findings with PoCs) within 5 business days of engagement end.
4. **Zero False Positives** - every finding manually verified. No 500-page scanner dump.
5. **Free Retest Included** - every finding retested at no extra cost within 30 days; the loop isn't closed until fixes are proven.
6. **NDA-Protected Always** - mutual NDA before every scoping call; architecture, source code and vulnerabilities stay confidential and are purged post-engagement.

### Trust bar (three pillars)

- **Built for Startups** - security processes designed for lean engineering teams, zero enterprise bloat.
- **Affordable & Fixed** - enterprise-grade protection at seed-to-Series-A prices.
- **Founder-Led Team** - you talk directly to senior security engineers, not account managers.

### Certification badges displayed

`CEH` · `OSCP` · `CISSP` · `ISO 27001`

---

## 7. The Problem We Solve ("The Reality")

> *Attackers know scaling engineering teams defer security to ship features. They exploit it daily. The question isn't if you'll be targeted - it's whether you'll be ready.*

| Stat | Claim |
|---|---|
| **43%** | of all cyberattacks specifically target smaller, fast-growing companies |
| **₹7 Cr+** | average cost of a data breach for Indian mid-market startups in 2024 |
| **207 days** | average time to identify a breach without proactive security monitoring |
| **60%** | of un-funded tech companies shut down within 6 months of a major breach |

**Objection handled on-page:** *"We're too small to be targeted."* → *That's exactly what attackers count on. Automated scanners don't discriminate by valuation - they exploit any open vulnerability they find.*

---

## 8. Pricing

**Positioning:** *No Hidden Fees. No Surprises.* - fixed-scope engagements with clear deliverables.

### 8.1 Packages

| | **Founding Partner** | **Standard VAPT** *(Most Popular)* | **Security Partnership** |
|---|---|---|---|
| Price | ₹12.5k - 17.5k one-time | ₹25,000+ per project | ₹2.0L+ / year |
| For | MVP / early-stage SaaS - first 3-5 qualified clients | Seed to Series A startups | Scaling & multi-product teams |
| Includes | MVP / early-stage web app assessment · Full technical report + CVSS ratings · PoC + remediation guidance · 1 complimentary retest (30 days) · Developer walkthrough | Web / API / Mobile / Cloud assessment · Executive + technical report · CVSS ratings + business impact · PoC + reproduction steps · 1 complimentary retest (30 days) · Dev walkthrough + final verification | Everything in Standard VAPT · Quarterly VAPT · Monthly vulnerability scanning · Unlimited security consultation · Priority retesting · Security questionnaire assistance |
| Excludes | Quarterly VAPT | Continuous scanning | - |
| CTA | Apply - Limited Spots | Request a Quote | Contact Us |

### 8.2 Reference price ranges

| Engagement | Target client / scope | Est. price range |
|---|---|---|
| MVP / Early-Stage SaaS | Seed-stage, limited scope | ₹25,000 - ₹35,000 |
| Growth SaaS | Series A, moderate complexity | ₹45,000 - ₹70,000 |
| Mobile App Assessment | Android/iOS + backend APIs | ₹30,000 - ₹45,000 |
| Cloud Infra Review | AWS, Azure, or GCP | ₹25,000 - ₹40,000 |
| Enterprise Assessment | Large / multi-product | Custom quote |

**Pricing terms (verbatim):** Final pricing is set after scoping - based on number of apps & APIs, infrastructure size, authentication complexity, testing duration, and required deliverables. NDA signed before engagement. GST applicable. Founding Partner pricing is limited to the first 3-5 qualified clients, after which standard pricing applies.

### 8.3 Founding Partner Program

Heavily discounted, flat-rate penetration testing for the first **3-5 early-stage startup clients**. In exchange for case-study participation and a testimonial, clients receive comprehensive, senior-led offensive security at a fraction of standard agency rates. Marked **Limited Availability**.

---

## 9. Client Proof

> Section title: *Trusted by Businesses Across India*

- **TStechy** - Founder & CTO, Tech Startup *(LinkedIn)*: found **3 critical vulnerabilities** in the customer portal; report clear, actionable, and faster than any prior vendor.
- **SMI Tech Group Pvt Ltd** - B2B SaaS Platform, India *(Verified Client)*: full penetration test **uncovered 23 vulnerabilities**, several critical; findings precise, well-documented, with immediately actionable remediation steps.
- **Karthik M.** - COO, Logistics SaaS *(Direct Referral)*: customized security training for a 40-person team after a near-miss phishing incident; **six months later, zero incidents**.

---

## 10. How Clients Engage Us

1. **Request a Free Audit** / **Request Security Audit** - contact form (name, email, company, phone, message).
2. **Book Discovery Call** - free 30-minute consultation via the Google Calendar booking link.
3. Mutual **NDA signed before scoping**.
4. Response within **4 business hours** to schedule the scoping call.

**Contact page promise:** *Know Your Risks Before Attackers Do.* - No commitment required · NDA signed before we scope details · Response within 4 business hours.

---

## 11. Policies & Legal Stance

- **Privacy Policy** - collects only form/booking data plus standard hosting telemetry; no selling, renting, trading, or advertising use of personal data. Providers: Vercel (hosting), Google Workspace (email/scheduling), Google Fonts. Data retained only as long as necessary, then deleted or anonymised. Access/correction/deletion on request. Last updated 7 July 2026.
- **Terms of Service** - site content is informational; pricing is indicative and subject to scoping. All engagements run under a separate written agreement, SOW, and mutual NDA. **Testing is performed only against systems with explicit written client authorization and confirmed ownership.** Governed by the laws of India. Last updated 7 July 2026.
- **Responsible Disclosure** - covers dedcellsecurity.in and Dedcell-owned infrastructure only; **client systems strictly out of scope**. Good-faith research gets **safe harbor**. Out of scope: DoS, social engineering, physical attacks, spam, unverified scanner output. No paid bounty, but public credit offered. Reports → dedcellsec@gmail.com. Last updated 7 July 2026.
- **Engagement confidentiality** - architecture, source code, credentials and findings treated as strictly confidential and securely purged after the agreed retention period.

---

## 12. Site Structure

| Route | Page |
|---|---|
| `/` | Home - hero, reality stats, trust bar, services teaser, process, testimonials, CTA |
| `/services` | 8 services + additional capabilities + pricing (`#pricing`) |
| `/about` | Differentiators + Founding Partner Program |
| `/contact` | Audit request form + direct email |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/disclosure` | Responsible Disclosure |

**Nav CTA:** Request Assessment · **Footer service links:** Web App Pentest, API Security, Cloud Assessment, Mobile Security, Code Review.

---

## 13. Inconsistencies Flagged (fix before using this externally)

These are contradictions that exist **in the live site copy**, carried here unchanged rather than silently resolved:

1. **Founding Partner price conflict** - the pricing card says **₹12.5k - 17.5k**, but the reference table lists "MVP / Early-Stage SaaS" at **₹25,000 - ₹35,000**. Two different numbers for what reads as the same engagement.
2. **Services teaser skips 04** - the home-page teaser is numbered 01, 02, 03, **05** (Internal Network Assessment is omitted from the teaser but exists on the services page).
3. **Two contact emails** - `jejo@dedcellsecurity.in` on contact/schema vs `dedcellsec@gmail.com` on all three legal pages.
4. **"ISO 27001" sits in the "Certified:" badge row** alongside CEH/OSCP/CISSP. CEH/OSCP/CISSP are individual certifications; ISO 27001 is an organizational standard, and elsewhere the site says only "ISO 27001 **Alignment**". As presented, the badge row reads as a claim that the company is ISO 27001 certified.
5. **Testimonials are unnamed or partially named** ("TStechy", "Karthik M.") - weak proof for a brochure aimed at buyers who verify.
6. **Statistics carry no citations** (43%, ₹7 Cr+, 207 days, 60%). The 60% shutdown figure in particular is the kind of number a technical buyer will ask you to source.
