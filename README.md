# CareerCraft Landing Page (Mockup)

A standalone React + Tailwind marketing mockup for **CareerCraft**, a
LinkedIn-optimization-first product concept. Built with the
landing-page-builder skill from an explicit design brief, then iterated
through several rounds of repositioning.

**This is a design/messaging mockup, not a working product.** It is
unrelated to the WebElvate LinkedIn extension elsewhere in this repo —
different brand, different pricing model, no shared backend.

## Product framing shown on this page

- LinkedIn profile optimization is the core product (headline, About,
  experience, skills rewrites) — the resume is a secondary, one-per-account
  output, not the main pitch.
- Pricing: a single one-time ₹199 fee per LinkedIn account (no
  subscription).
- An interactive "See your transformation" demo lets a visitor paste a
  LinkedIn URL and see an illustrative before/after example. **This does
  not scrape or process the pasted URL** — it always shows the same
  canned example, and says so explicitly. Real per-profile scraping was
  deliberately not built here: it would need a real backend and carries
  materially more legal/ToS exposure than reading a *logged-in user's
  own* profile via a browser extension (the original WebElvate approach).
- A "Pick a template" gallery shows 5 illustrative resume template
  styles (Fresher, Advanced, Expert, Technical, Executive) as a
  marketing showcase. The "Generate PDF" action is intentionally
  disabled/locked with "after sign-in" copy — there is no working free
  resume generator on this page, to avoid undercutting the ₹199 paywall
  shown in Pricing.

## Known placeholders / before this goes live

- The three testimonials are illustrative placeholder copy, not real
  customers — replace or remove them.
- No real backend, sign-in, or payment integration exists — "Sign In",
  "Get Started" and "Sign In & Pay ₹199" are non-functional links.
- Terms & Privacy Policy links are placeholders (`href="#"`).

## Run locally

```bash
npm install
npm run dev
```
