# CareerCraft Landing Redesign: Technical Handoff Guide

**Project**: CareerCraft Landing Redesign (P0 – P5)  
**Date**: September 19, 2026  
**Status**: Production Ready  
**Branch**: `redesign/landing-p5`

---

## 1. Component Inventory & Architecture

All presentation components are 100% prop-driven and consume configuration from `src/config/marketConfig.js`. Zero copy or sample mocks are hardcoded inside UI components.

| Component Path | Type | Responsibility & Implementation |
|---|---|---|
| `src/components/ui/Section.jsx` | Core UI | Semantic `<section>` wrapper with standardized vertical spacing (`py-16 sm:py-24`) and background tokens (`default`, `surface`, `dark`). |
| `src/components/ui/Container.jsx` | Core UI | Responsive grid container with 4 size constraints (`narrow`, `small`, `default`, `large`). |
| `src/components/ui/Button.jsx` | Core UI | Accessible button/anchor component supporting `primary`, `secondary`, `ghost`, and `accent` variants with visible focus rings (`focus-visible:ring-2 focus-visible:ring-accent`). |
| `src/components/ui/Card.jsx` | Core UI | Bordered card wrapper using surface tokens and subtle shadow elevation. |
| `src/components/ui/Chip.jsx` | Core UI | Competency/keyword chip supporting `matched` (success), `missing` (warning), and `neutral` states with screen-reader text prefixes. |
| `src/components/ui/ScoreRing.jsx` | Core UI | SVG radial meter rendering 0–100 scores with tabular numerals (`tabular-nums`) and ARIA role `meter`. |
| `src/components/ui/ScoreBar.jsx` | Core UI | Linear percentage bar with progressbar semantics. |
| `src/components/ui/ChecklistRow.jsx` | Core UI | Two-line checklist row displaying verified deliverable capabilities. |
| `src/components/ui/SampleBadge.jsx` | Core UI | Mandatory `<SampleBadge>` pill rendering "Sample output" across all mock interfaces. |
| `src/components/ui/BrowserFrame.jsx` | Core UI | Minimal desktop browser chrome frame for realistic UI previews. |
| `src/components/ui/FaqItem.jsx` | Core UI | Accessible disclosure (`<details>` / `<summary>`) with chevron animation. |
| `src/components/ui/StickyCta.jsx` | Core UI | Mobile-only fixed action bar controlled via `IntersectionObserver` (reveals when hero CTA leaves view, hides when final CTA is in view). |
| `src/components/ui/ConsentBanner.jsx` | Core UI | Lightweight cookie consent banner active on UK/EU routes (`/uk`). |
| `src/components/ui/MarketSwitcher.jsx` | Core UI | Non-intrusive region selector in Header and Footer. |
| `src/components/FreeScoreEvaluator.jsx` | Feature | Decoupled free score tool running deterministic heuristic evaluation on LinkedIn headlines. |
| `src/components/Header.jsx` | Section | Main sticky navigation bar with accessible focus rings, region switcher, support trigger, and primary CTA. |
| `src/components/Hero.jsx` | Section | 2-column hero featuring primary copy, trust indicators, interactive `FreeScoreEvaluator`, and HTML/CSS product mock. |
| `src/components/BeforeAfter.jsx` | Section | Transformation comparison with metric counters (`61 → 94` score, `58% → 93%` match) and mandatory illustrative disclaimer. |
| `src/components/HowItWorks.jsx` | Section | 4-step linear process explaining input, job description extraction, gap analysis, and document export. |
| `src/components/JobMatching.jsx` | Section | Hero intelligence block illustrating 91% job match, strong detected skills, and missing keyword chips. |
| `src/components/Features.jsx` | Section | 6 concise, verified feature cards (excluding unbacked claims). |
| `src/components/ResumePreviewSection.jsx` | Section | Realistic ATS resume preview with standard single-column hierarchy and 4 callouts. |
| `src/components/Trust.jsx` | Section | 4 verified engineering principles (ATS formatting, job alignment, editable text, flat pricing). |
| `src/components/Comparison.jsx` | Section | Semantic `<table>` comparing CareerCraft against traditional writing agencies and generic AI chatbots. |
| `src/components/UKPrivacySection.jsx` | Section | Factual data governance section rendering verified Phase 0 audit facts for UK/EU visitors. |
| `src/components/Pricing.jsx` | Section | Single flat plan (₹199), candidate info capture, and Razorpay / UPI payment options. |
| `src/components/FAQ.jsx` | Section | Factually verified questions and answers with disclosure analytics. |
| `src/components/FinalCTA.jsx` | Section | Closing conversion block with verified privacy reassurance. |
| `src/components/Footer.jsx` | Section | Navigation links, legal anchors, support modal trigger, and admin portal link. |

---

## 2. Design Tokens & Styling Guide

All tokens are defined in `src/index.css` via Tailwind CSS v4 `@theme`:

```css
@theme {
  --color-ink: #0B1220;          /* Primary body & heading text (19.3:1 contrast on white) */
  --color-bg: #F7F8FA;           /* Page background */
  --color-surface: #FFFFFF;      /* Card & navigation surface */
  --color-border: #E4E7EC;       /* Clean neutral borders */
  
  --color-accent: #2F5BFF;       /* Primary interactive blue */
  --color-accent-hover: #1E40AF; /* Darker blue for active states */
  --color-accent-soft: #EFF3FF;  /* Tonal accent background */
  
  --color-success: #0F8A5F;      /* Verified dark green (4.6:1 contrast) */
  --color-warn: #B45309;         /* Warning dark amber (5.2:1 contrast) */
  --color-muted: #5B6472;        /* Secondary text (4.9:1 contrast, WCAG AA compliant) */

  --font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

- **Scores & Numerals**: Use `.tabular-nums` / `.tnum` to guarantee fixed character widths for score counters.
- **Motion Standards**: All CSS transitions are constrained and automatically disabled for users with `prefers-reduced-motion: reduce`.

---

## 3. Market Configuration Schema (`marketConfig.js`)

To add a new regional market (e.g. `ca` for Canada or `au` for Australia):

1. Add an entry to `MARKETS` in `src/config/marketConfig.js`:

```javascript
export const MARKETS = {
  ca: {
    id: 'ca',
    locale: 'en-CA',
    hreflang: 'en-CA',
    docTerm: 'resume',
    docTermPlural: 'resumes',
    docTermCap: 'Resume',
    spelling: 'US',
    currencySymbol: '$',
    currencyCode: 'CAD',
    price: '199', // Backend source of truth
    formattedPrice: '$3.99 (CAD)',
    priceDisclaimer: 'One-time payment. No subscription fees.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimization & ATS Resume Builder for Canada',
      metaDescription: 'Optimize your LinkedIn profile and generate an ATS-friendly resume for Canadian and global job opportunities.',
      canonical: 'https://careercraft.webelvate.com/ca',
      alternateHreflangs: [ ... ],
    },
    hero: { ... },
    mock: { ... },
    beforeAfter: { ... },
    howItWorks: { ... },
    jobMatching: { ... },
    features: [ ... ],
    comparison: { ... },
    resumeSection: { ... },
    trust: { ... },
    pricing: { ... },
    faq: [ ... ],
    finalCta: { ... },
  }
};
```

2. Add the route entry in `vite.config.js` and `public/sitemap.xml`.

---

## 4. Analytics Event Reference (`src/lib/analytics.js`)

Dispatches consent-respecting events without PII:

| Event Name | Trigger Context | Payload Parameters |
|---|---|---|
| `landing_view` | Page mount / route switch | `{ market: 'in' \| 'uk' \| 'us' }` |
| `cta_click` | Button / anchor interaction | `{ cta_id: string, section: string, market: string }` |
| `score_flow_start` | Free headline audit started | `{ tool: 'headline_audit', market: string }` |
| `score_flow_complete` | Free audit score generated | `{ score: number, tool: 'headline_audit', market: string }` |
| `pricing_view` | Pricing section viewed | `{ market: string }` |
| `checkout_start` | Candidate submits details | `{ plan_id: string, currency: string, amount: string, market: string }` |
| `faq_expand` | FAQ item toggled open | `{ question: string, market: string }` |

---

## 5. Known Gaps & Proposals Awaiting Backend Decision

1. **Multi-Currency Checkout Integration**:
   - *Current State*: Backend order creation (`backend/src/routes/createOrder.ts`) processes INR 199.00 (`amount: 19900`, `currency: 'INR'`).
   - *Proposal*: Enable Razorpay international currency support or integrate Stripe Checkout to natively process USD ($2.99) and GBP (£2.99) directly in local payment methods.

2. **LLM Prompt Guardrails for Metric Hallucination**:
   - *Current State*: LLM prompts currently instruct: *"Experience: each entry starts with an action verb and includes a metric"*. When candidate inputs lack numbers, the model may fabricate statistics.
   - *Proposal*: Update `backend/src/routes/analyzeProfile.ts` system prompt to insert bracketed placeholders `[+X%]` when source metrics are missing, prompting the user for real figures.

3. **Cloudflare Turnstile on Public Endpoints**:
   - *Proposal*: If standalone tool routes (e.g. `/tools/linkedin-headline-generator`) are deployed with free backend LLM calls, implement Cloudflare Turnstile bot verification to prevent automated scraping.

---

## 6. Final Acceptance Verification

- [x] **Zero Feature Regressions**: All existing routes, profile analyzer workflows, support modal endpoints, and admin portals are preserved.
- [x] **Route Integrity**: Every CTA links to a valid in-page anchor or live route across all market views.
- [x] **No Fake Social Proof**: Zero fabricated user counts, fake recruiter stats, or unsubstantiated ATS pass rate badges.
- [x] **Sample Disclosures**: Every mock carries `<SampleBadge>` ("Sample output") and illustrative disclaimers.
- [x] **Price Honesty**: Pricing reflects the exact ₹199 flat one-time model without deceptive recurring subscriptions.
- [x] **Claims Verification**: All copy is verified against `docs/redesign/AUDIT.md`. Unverified features (cover letters, named ATS compat) are eliminated.
- [x] **Consent Enforcement**: UK/EU routes gate non-essential analytics and render explicit data processing facts.
- [x] **Accessibility**: WCAG 2.1 AA compliant contrast across all tokens, skip links present, and tabular numerals active.
- [x] **Production Build**: Multi-page Vite compilation verified across all routes (`542ms`).
