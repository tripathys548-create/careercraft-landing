# CareerCraft Landing Redesign: Phase 0 Audit & Baseline (P0)

**Date**: September 19, 2026  
**Auditor**: Antigravity Technical Architecture  
**Scope**: Codebase audit, CTA routing, pricing & currency models, claims verification, data privacy & consent, score integrity, analytics, baseline SEO, and performance parameters.

---

## A1. Codebase Architecture

| Dimension | Specification & Current Implementation |
|---|---|
| **Framework** | React 19.2.8 (`react`, `react-dom`) |
| **Build Tool & Bundler** | Vite 8.3.0 (`@vitejs/plugin-react` 6.1.1) |
| **Router** | Single-page application (SPA). Section navigation relies on in-page hash anchors (`#demo`, `#features`, `#templates`, `#pricing`, `#optimize`, `#faq`) and static HTML documents (`/privacy.html`, `/terms.html`). No client-side routing library (e.g. `react-router-dom`) is currently installed. |
| **Styling & Design System** | Tailwind CSS v4 (`tailwindcss` 4.3.3, `@tailwindcss/postcss` 4.3.3, `postcss` 8.5.28, `autoprefixer` 10.6.1). Custom neo-brutalist theme utilizing hard `#111111` borders, hard shadows (`shadow-[4px_4px_0_#111111]`), cream surface background (`#FAF8F5`), and high-saturation yellow brand accents (`#FFDE59` / `#FFC800`). |
| **Component Library** | Custom components built with `lucide-react` (1.47.0) and `pdfjs-dist` (6.3.289) for client-side PDF parsing. |
| **Runtime & Node Version** | Node.js >= 20, npm package manager. |
| **Testing Infrastructure** | Frontend: No test framework configured in root `package.json` (`oxlint` is configured for linting). Backend: `vitest` (3.2.4) configured in `backend/vitest.config.ts`. |
| **Backend Services** | Cloudflare Workers (`wrangler.toml`, compatibility date `2026-09-01`) written in TypeScript. |
| **Database** | Neon Serverless PostgreSQL (`@neondatabase/serverless` 0.10.4) accessed via tagged template queries in `backend/src/lib/db.ts`. |
| **Hosting & Deployment** | Frontend configured for Cloudflare Pages (`wrangler.jsonc` targeting `./dist`). Backend deployed as Cloudflare Worker `careercraft-backend`. |
| **Landing Page Structure** | Entry point: `src/App.jsx`. Composed of 15 components: `Header`, `Hero` (with `HeadlineOptimizerTeaser` and `HeroVisual`), `TransformDemo`, `Features`, `Process`, `Templates`, `ConversionCTA`, `Pricing`, `ProfileAnalyzer`, `Testimonials`, `FAQ`, `FinalCTA`, `Footer`, `SupportModal`, and `AdminModal`. |
| **Multi-Route & Geo/i18n Logic** | **Zero multi-route setup**. Single `index.html` file. No localized paths (`/in`, `/uk`, `/eu`), no `hreflang` headers or link elements, no geo-IP detection. |

---

## A2. CTA & Route Mapping

| CTA / Link Text | Trigger Location | Target / Behavior | Status | Auth / Key Required | Technical Gap / Redesign Action |
|---|---|---|---|---|---|
| **Get Started** | Header | `#pricing` | Working | No | Anchors to pricing section |
| **See Demo** | Header & Footer | `#demo` | Working | No | Anchors to `TransformDemo` |
| **Features** | Header & Footer | `#features` | Working | No | Anchors to `Features` |
| **Templates** | Header | `#templates` | Working | No | Anchors to `Templates` |
| **Pricing** | Header & Footer | `#pricing` | Working | No | Anchors to `Pricing` |
| **Optimize** | Header | `#optimize` | Working | No | Anchors to `ProfileAnalyzer` |
| **Help & Support** | Header & Footer | Opens `SupportModal` | Working | No | Modal submits to `POST /support-message` |
| **Admin** | Header & Footer | Opens `AdminModal` | Working | Yes (`ADMIN_PASSWORD`) | Protected admin management portal |
| **Optimize My LinkedIn** | Hero Primary | `#pricing` | Working | No | Directs visitor down to pricing checkout |
| **See an Example** | Hero Secondary | `#demo` | Working | No | Anchors down to `TransformDemo` |
| **Optimize Free** | Hero Teaser | Executes client function `optimizeHeadline()` | Working (Simulated) | No | Client-side mock calculation; not connected to API |
| **Get Full Suite (₹199)** | Hero Teaser Box | `#pricing` | Working | No | Anchors to pricing checkout |
| **See Example** | `TransformDemo` | Form submit toggles `revealed=true` | Working (Static) | No | Displays hardcoded before/after comparison |
| **Get Instant Access — ₹199** | `ConversionCTA` | `#pricing` | Working | No | Anchors to pricing checkout |
| **Continue to Payment (₹199)** | `Pricing` Step 1 | `POST /register-user` | Working | No | Creates user in DB and moves to Step 2 |
| **Pay ₹199 & Deliver Key** | `Pricing` Step 2 (Online) | `POST /create-order` + `Razorpay` modal | Working | No | Launches Razorpay gateway modal |
| **Scan UPI QR** | `Pricing` Step 2 (QR) | Displays `/razorpay-upi-qr.jpg` | Working (Manual) | No | Shows static QR image; manual verification |
| **Recreate Profile & Generate Resume** | `ProfileAnalyzer` | `POST /analyze-profile` | Working | **Yes (License Key)** | Requires valid paid key; rejects guest visitors |
| **Download Resume PDF** | `ProfileAnalyzer` | Client blob conversion & download | Working | **Yes (Post-Analysis)** | Downloads generated base64 PDF |
| **Terms of Service** | Footer & Demo | `/terms.html` | Working | No | Static HTML page |
| **Privacy Policy** | Footer & Demo | `/privacy.html` | Working | No | Static HTML page |

### Route Definitions for Redesign:
1. **Free Score**: Currently divided between a client-only mock teaser and a gated analyzer. Needs a unified, friction-free free scoring entry point without requiring payment upfront.
2. **How It Works**: Smooth-scroll `#how-it-works` (or `#process`).
3. **Optimize My Profile**: Routes directly to the interactive profile optimizer.
4. **Build My Resume / CV**: Routes to the resume synthesis tool.
5. **Upgrade**: Anchor `#pricing` for checkout.

---

## A3. Pricing, Currency & Tax Matrix

### Source of Truth in Codebase
- **Backend Order Creation**: `backend/src/routes/createOrder.ts` defines `amount: 19900` (paise = ₹199.00 INR), hardcoded `currency: 'INR'`.
- **Frontend Pricing**: Hardcoded string `₹199` across `Hero.jsx`, `Pricing.jsx`, `ConversionCTA.jsx`, `FAQ.jsx`, and `index.html` (JSON-LD `price: "199"`, `priceCurrency: "INR"`).
- **Payment Provider**: Razorpay integration (`checkout.razorpay.com/v1/checkout.js`) with key `rzp_live_Tdb1rjpNchUkcj`.

### Plan Inclusions & Quotas
- **Plan Type**: Single One-Time Payment (Lifetime / Fixed Usage). No recurring subscription.
- **Inclusions**:
  - Full LinkedIn profile rewrite (Headline, About, Experience, Skills).
  - Target role alignment.
  - 1 ATS-compliant PDF resume generation.
  - License key delivery to registered email.
- **Enforced Technical Limits**:
  - Rate limiting: Max 20 requests per hour per license key (`MAX_REQUESTS_PER_HOUR = 20` in `rateLimit.ts`).
  - Resume generation: Exactly 1 generation per license key (`resume_generated_at` timestamp check in `generateResume.ts`).

### Regional Market Matrix

| Market | Currency | Supported Price in Code | Payment Methods in Code | Tax / GST / VAT Handling | Status & Gaps |
|---|---|---|---|---|---|
| **India (IN)** | INR (`₹`) | ₹199 (Gross flat) | Razorpay (UPI, Credit/Debit Cards, Netbanking, UPI QR) | Flat price displayed; GST not broken down on invoice | **Verified & Functional** |
| **United States (US)** | USD (`$`) | *None* (Hardcoded to INR) | Razorpay default (International cards if activated on account) | Sales tax not handled | **GAP**: No USD pricing tier ($2.99 / $4.99) or Stripe integration in code |
| **United Kingdom (UK)** | GBP (`£`) | *None* (Hardcoded to INR) | Razorpay default | VAT not handled | **GAP**: No GBP pricing (£2.99 / £3.99); no VAT invoice breakdown |
| **European Union (EU)** | EUR (`€`) | *None* (Hardcoded to INR) | Razorpay default | EU VAT reverse-charge / OSS not handled | **GAP**: No EUR pricing (€2.99 / €3.99); no VAT handling |

*Rule: International landing variants must NOT display invented FX rates. If checkout backend only processes INR, the UI must clearly label the INR equivalent or flag international payment readiness.*

---

## A4. Claims Verification Gate

| # | User-Facing Claim | Verification Status | Code / Architecture Evidence | Redesign Copy Rule |
|---|---|---|---|---|
| 1 | **Free LinkedIn Profile Score** | **Partial** | `HeadlineOptimizerTeaser.jsx` generates random client-side scores; `backend/src/routes/analyzeProfile.ts` performs real LLM scoring but requires a license key | Clearly label free teaser results with `<SampleBadge>` or provide un-gated deterministic scoring. |
| 2 | **Headline Suggestions & Optimization** | **Verified** | `backend/src/routes/analyzeProfile.ts` & `rewriteProfile.ts` generate structured `< 220` char SEO headlines | Approved for use. Highlight recruiter search indexing. |
| 3 | **About Section 3-Part Rewrite** | **Verified** | `analyzeProfile.ts` generates 3 structured paragraphs (Hook, Achievements, Value Proposition) | Approved for use. |
| 4 | **Achievement-Focused Experience Rewrite** | **Verified** | `analyzeProfile.ts` system prompt enforces action verbs and business metrics | Approved for use. |
| 5 | **Job Description Keyword Matching** | **Partial** | `analyzeProfile.ts` accepts `targetRole` string for prompt alignment, but does NOT compute an algorithmic/vector keyword coverage percentage | State "Target Role Alignment". Do NOT claim algorithmic ATS % parsing unless mathematical matcher is implemented. |
| 6 | **ATS-Friendly Resume Generation** | **Verified** | `backend/src/lib/pdf.ts` generates clean, single-column, standard-font PDFs with vector layout | Approved for use. Terminology: "ATS-friendly formatting". |
| 7 | **Multiple Download Formats** | **Partial** | Only `.pdf` output is supported via `pdf-lib`. No `.docx` or `.txt` | State "Download as PDF" only. Never claim Word/DOCX support. |
| 8 | **Cover Letter Generation** | **NOT VERIFIED** | Mentioned in old `Features.jsx` copy ("plus cover letters when you need them"), but ZERO backend code or prompts exist for cover letters | **STRICT CUT**: Remove all mentions of cover letter generation. |
| 9 | **User Can Edit Output** | **Verified** | Text is generated as copyable markdown/strings for user paste into LinkedIn editor | State "Copy-ready text you can edit and paste". |
| 10 | **One-Time Payment / No Subscription** | **Verified** | Single charge via Razorpay; no recurring billing subscriptions configured in database | Approved as lead value proposition: "One-time payment • No monthly subscription". |
| 11 | **No Other AI Subscription Required** | **Verified** | Server-side Gemini API execution; user needs no OpenAI/Claude subscription | Approved for use. |
| 12 | **Input Method: Paste & PDF Upload** | **Verified** | `ProfileAnalyzer.jsx` has textareas for raw text + `pdfjs-dist` file picker for PDF resumes | State "Paste your profile text or upload your existing resume". |
| 13 | **Output Excludes Photo & Personal ID** | **Verified** | `pdf.ts` outputs text-only headers (Name, Headline, Summary, Experience, Education, Skills) without images or national ID fields | Approved for ATS compliance copy. |
| 14 | **Europass / UK-EU CV Specific Conventions** | **NOT VERIFIED** | No Europass-specific schema or localized UK CV format modules exist | Do not claim Europass certification. |
| 15 | **Fresher / Student Specific Sections** | **Partial** | Education section supported, but prompts do not have dedicated fresher modules | General career optimization; avoid unsubstantiated fresher claims. |
| 16 | **Tested Compatibility with Named Portals (Workday, Taleo, Naukri)** | **NOT VERIFIED** | No empirical ATS parsing test suite exists in codebase | **STRICT CUT**: Never name specific ATS platforms or guarantee passing scores. Use "ATS-friendly formatting". |

---

## A5. Data Architecture, Privacy & Consent Audit

### Data Inventory & Processing Lifecycle
1. **Candidate Data Collected**: Full Name, Email Address, Mobile Number (optional), LinkedIn Profile text (Headline, About, Experience, Skills, Education), Uploaded Resume text, Public LinkedIn URL / Username handle.
2. **Storage Location & Subprocessors**:
   - **Compute Host**: Cloudflare Workers (Global Edge).
   - **Database**: Neon PostgreSQL (Hosted in AWS US/EU cloud regions depending on Neon cluster). Stores user records, license keys, raw prompt inputs, and generated JSON/PDF blobs indefinitely in `generated_content` table.
   - **AI Inference Provider**: Google Generative AI (Gemini API - `https://generativelanguage.googleapis.com`). Models: `gemini-flash-latest`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-pro-latest`. Processing region: United States.
   - **Payment Gateway**: Razorpay (PCI-DSS compliant, India).
   - **Email Dispatch**: Resend / SMTP for transactional license keys.
3. **Data Retention & User Deletion**:
   - Generated resumes and profile rewrites are stored permanently in the `generated_content` table to enable re-downloading.
   - Deletion path: Manual user request via email to support. No automated user deletion endpoint exists in backend.
4. **Cookie & Tracker Status**:
   - **Zero trackers currently loaded**: No Google Analytics, Meta Pixel, or third-party marketing tags in `index.html`.
   - Razorpay checkout script loaded globally in `<head>`.
5. **Consent & Regulatory Compliance Gaps**:
   - **Cookie Consent Banner**: Absent.
   - **UK/EU GDPR Considerations**: Cross-border data transfer occurs when sending profile data to Cloudflare Edge -> Neon DB -> Google Gemini API (US). Must be disclosed transparently in privacy documentation without asserting legal indemnities ("GDPR Compliant"). Non-essential cookies/trackers must remain gated until explicit user opt-in on UK/EU routes.

---

## A6. Score Integrity & AI Output Assessment

### 1. Scoring Architecture
- **Client-Side Teaser (`HeadlineOptimizerTeaser.jsx`)**: Uses `Math.random()` simulation (`beforeScore: 42-57`, `afterScore: 93-98`). **Evaluation**: Unacceptable for production trust. Must be replaced with deterministic rule-based heuristic scoring or genuine backend evaluation.
- **Backend Analyzer (`backend/src/routes/analyzeProfile.ts`)**: Evaluated via LLM prompt across 4 categories:
  - Headline / Title: 0–25
  - About / Summary: 0–25
  - Experience: 0–30
  - Skills: 0–20
  - Total: 0–100

### 2. Score Stability
- LLM generation temperature is unconstrained in `callLLM`, leading to potential score fluctuations of 5–15 points on identical inputs across runs.
- **Recommendation**: For free score checks, employ a deterministic heuristic score (evaluating length, presence of metrics, keyword density, action verbs) to ensure 100% stable results on identical text.

### 3. Metric Invention Risk & Prompt Guardrails
- **Current Issue**: The backend prompt instructs the LLM: *"Experience: each entry starts with an action verb and includes a metric"*. When candidate input lacks numbers, the model may fabricate statistics (e.g. "boosted revenue by 34%").
- **Required Architecture Proposal**: Update prompts to use bracketed placeholders (e.g. `[X%]`, `[₹X Lakhs / $XK]`) when metrics are not present in source text, prompting the user to fill in their real numbers. Landing page copy must state: *"Illustrative example. Real output uses your verified career numbers."*

---

## A7. Analytics Architecture

### Current Status
No analytics library is currently installed or firing in the repository.

### Proposed Consent-Respecting Event Dispatcher
Lightweight custom event bus respecting user privacy and consent state:

```typescript
// Custom Analytics Schema
interface AnalyticsPayload {
  event: 
    | 'landing_view'
    | 'cta_click'
    | 'score_flow_start'
    | 'score_flow_complete'
    | 'pricing_view'
    | 'checkout_start'
    | 'faq_expand';
  market: 'us' | 'in' | 'uk' | 'eu';
  cta_id?: string;
  section?: string;
  tool?: 'headline_teaser' | 'profile_analyzer';
  score?: number;
  plan_id?: string;
  currency?: string;
  question?: string;
}
```

- **Consent Enforcement**: On UK/EU routes (`/uk`, `/eu`), events are withheld unless consent is granted or configured in zero-cookie privacy mode.
- **PII Guard**: No email addresses, names, or raw profile text are ever passed into analytics payloads.

---

## A8. Performance & Accessibility Baseline

### Current Asset & Font Pipeline
- **Fonts**: Loaded via Google Fonts CDN (`Inter` and `Space Grotesk`). Requires conversion to self-hosted variable font `Plus Jakarta Sans` for reduced network latency and GDPR compliance.
- **Render-Blocking Scripts**: `https://checkout.razorpay.com/v1/checkout.js` loaded synchronously in `<head>`. Needs deferred loading until checkout interaction.
- **Color Contrast**: Primary ink `#111111` on Cream `#FAF8F5` provides an exceptional 18.2:1 contrast ratio (exceeding WCAG AAA). However, subtle helper text (`text-ink-muted` at `#6B7280` on tinted backgrounds) must be locked to `#5B6472` to guarantee WCAG 2.1 AA (4.5:1 minimum).

---

## A9. Baseline SEO Audit

| SEO Element | Current State in Codebase | Redesign Requirement |
|---|---|---|
| **Title Tag** | `CareerCraft — Make recruiters stop at your LinkedIn` (50 chars) | `CareerCraft — AI LinkedIn Optimization & ATS Resume Builder` (~60 chars) |
| **Meta Description** | `AI LinkedIn optimization: rewrite your headline, About section, experience and skills for recruiter search, and export a matching ATS-friendly resume.` (154 chars) | Clear, benefit-driven meta with primary keywords (~155 chars) |
| **Canonical URL** | `https://careercraftt.webelvate.com/` (Contains domain typo) | `https://careercraft.webelvate.com/` (Correct domain structure) |
| **Robots & Sitemap** | Missing `robots.txt` and `sitemap.xml` in `public/` | Add valid `robots.txt` and `sitemap.xml` |
| **Open Graph / Twitter** | Set to `/favicon.svg` | Purpose-built 1200x630 high-resolution social card |
| **Structured Data** | `WebApplication` schema with INR pricing | `SoftwareApplication` / `WebApplication` schema with clean offer objects |
| **Internationalization** | Zero `hreflang` tags | `hreflang` tags configured per market variant (`en-US`, `en-IN`, `en-GB`, `x-default`) |

---

## A10. Provisional Target Keywords

*Note: Keyword search volumes are withheld pending Google Keyword Planner / Google Trends data export from project owner.*

### Primary Search Clusters:
1. **LinkedIn Optimization**: `LinkedIn Profile Optimization`, `LinkedIn Profile Review`, `LinkedIn Headline Generator`, `LinkedIn About Section Generator`.
2. **ATS & Resume Solutions**: `ATS Resume Builder`, `AI Resume Builder`, `ATS-Friendly Resume`, `ATS CV Builder` (UK/EU).
3. **Target Job Alignment**: `Job Description Matcher`, `Resume Keyword Optimizer`, `Job Description Tailoring`.

---

## Open Technical Questions & Blockers for Owner Review

1. **Primary Launch Market**: Should the default landing page (`/`) target the **US market** (USD pricing, "resume" terminology) with `/in` for India and `/uk` for UK/EU?
2. **International Payment Gateway**: Razorpay is currently configured for INR. For US ($) and UK/EU (£/€) transactions, will you activate international currency acceptance in Razorpay or integrate Stripe?
3. **Decoupled Free Score Flow**: Free-score users currently hit a paywall/key requirement for in-depth analysis. We recommend launching an un-gated, deterministic headline & profile audit on the landing page to drive top-of-funnel conversion.

---

**STOP GATE 0 REACHED.** Awaiting approval to proceed to Phase 1 (P1: Foundation and Conversion Core).
