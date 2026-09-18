# CareerCraft

An AI LinkedIn optimization product: rewrite your headline, About
section, experience and skills for recruiter search, generate a
referral outreach DM, and export a matching ATS-friendly resume. ₹199,
paid once, tied to one LinkedIn account.

Branded "CareerCraft, by WebElvate."

## Repository layout

- `src/`, `index.html` — the marketing/landing page (React + Tailwind), including
  the pricing section, the interactive transformation demo, and the
  template gallery.
- `backend/` — Cloudflare Workers API + Neon Postgres. Handles
  licensing, Razorpay payment, LLM-based rewrites, and PDF resume
  generation.
- `extension/` — Manifest V3 Chrome extension. Reads a signed-in
  user's own LinkedIn profile via a content script and talks to the
  backend to generate rewrites, referral DMs, and the one-time resume.

Backend and extension were carried over from an earlier, separately
branded build of the same underlying product and rebranded/repriced
for CareerCraft (₹199 one-time instead of the original ₹200; product
name changed throughout). The core logic — license binding, Razorpay
webhook verification, rate limiting, admin auth — was reviewed and is
unchanged.

## Legal / ToS position

The extension reads a user's own LinkedIn profile via browser
automation. This may violate LinkedIn's User Agreement and can result
in restriction of the user's LinkedIn account — a real risk, not an
edge case. The landing page's Pricing section and the extension's
first-run screen both disclose this explicitly and require an
affirmative acknowledgment before purchase/activation. Do not remove
or soften this disclosure.

## Backend setup

```bash
cd backend
npm install
```

Apply the database schema to your Neon Postgres database:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

### Required secrets

Set via `wrangler secret put <NAME>` — never commit these or put them
in `wrangler.toml`:

| Secret | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `RAZORPAY_KEY_ID` | Razorpay key id (also used, non-secretly, on the landing page's checkout flow) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret, server-side only |
| `RAZORPAY_WEBHOOK_SECRET` | Verifies the `payment-webhook` signature |
| `LLM_API_KEY` | API key for the LLM provider used in `backend/src/lib/llm.ts` |
| `EMAIL_API_KEY` | Transactional email provider key |
| `ADMIN_PASSWORD` | Bearer token required on all `/admin/*` routes |
| `EXTENSION_ORIGIN` | The extension's origin, for CORS on user-facing routes |
| `CHECKOUT_ORIGIN` | The landing page's deployed origin, for CORS on `create-order` |

### Run tests

```bash
cd backend
npm test
```

### Deploy

```bash
cd backend
npx wrangler deploy
```

See `TODO.md` for what's still pending before this goes live.

## Landing page setup

```bash
npm install
npm run dev
```

## Extension setup

1. Set `BACKEND_URL` in `extension/src/background/background.js` to
   your deployed backend URL.
2. In Chrome, go to `chrome://extensions`, enable Developer mode,
   click "Load unpacked", and select the `extension/` directory.
