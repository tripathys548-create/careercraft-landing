# Remaining Work — CareerCraft

Standalone product, standalone repo. As of this merge, the backend and
extension are real, tested code carried over from an earlier build of
the same underlying product (rebranded, repriced to ₹199 one-time) —
this is no longer "landing page mockup + no backend," it's "one real
product not yet deployed, plus a landing page with a few dead links."

Nothing below touches license-binding, webhook signature verification,
or admin auth in `backend/` — those were reviewed and are correct
as-is. Don't let Antigravity "improve" them without a specific reason.

## 1. Provision real accounts and secrets
- [ ] Create a Neon Postgres database, run `backend/db/schema.sql` against it.
- [ ] Create a Cloudflare account, `wrangler login`.
- [ ] Create a Razorpay account (test mode first), get `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
- [ ] Pick an LLM provider (Gemini Flash / GPT-4o-mini class) and get an API key.
- [ ] Pick a transactional email provider (Resend/Brevo) and get an API key.
- [ ] Choose an `ADMIN_PASSWORD`.
- **Comment for Antigravity:** none of this is a coding task — these are accounts only you can create.

## 2. Deploy the backend
- [ ] `wrangler secret put` for all 9 secrets listed in `README.md`.
- [ ] `npx wrangler deploy` from `backend/`.
- [ ] Register a Razorpay webhook pointing at `<deployed-url>/payment-webhook`; set its signing secret as `RAZORPAY_WEBHOOK_SECRET`.

## 3. Deploy the landing page and wire it up
- [ ] Deploy the landing page (`npm run build`, host the output — Cloudflare Pages, Netlify, etc.).
- [ ] Set that origin as `CHECKOUT_ORIGIN` secret on the backend.
- [ ] Wire `src/components/Pricing.jsx`'s "Sign In & Pay ₹199" button to actually call `POST /create-order` and open Razorpay Checkout — right now it's a dead `href="#"`. There's no real "sign in" step in the backend yet (see item 6); until that exists, this can go straight to payment like the original product did, keyed to email collected at checkout.
- [ ] Wire `src/components/TransformDemo.jsx`'s real (post-purchase) path once a license key exists — keep the current canned-example behavior for anyone who hasn't paid; that framing is intentional, not a placeholder to remove.

## 4. Wire up the extension
- [ ] Set `BACKEND_URL` in `extension/src/background/background.js` to the deployed Workers URL.
- [ ] Set the real checkout URL in `extension/src/popup/popup.html`'s "Purchase here" link.
- [ ] Load unpacked in Chrome and test end-to-end against the deployed backend before publishing to the Chrome Web Store.

## 5. Missing pieces, not yet built
- [ ] **Terms & Privacy Policy pages.** The landing page's Pricing and TransformDemo sections both link to "Terms & Privacy Policy" via `href="#"`. Needed before real payments — most jurisdictions require this for a paid product, and this product's own disclaimer copy promises one exists.
- [ ] **Admin UI.** `backend`'s `/admin/messages`, `/admin/generations`, `/admin/keys` are working, password-gated API endpoints with no frontend.
- [ ] **Support reply delivery.** Admin can write a reply into `support_messages`, but nothing emails it to the user.
- [ ] **5 PDF templates.** The landing page's `src/components/Templates.jsx` shows 5 illustrative styles (Fresher, Advanced, Expert, Technical, Executive) as a marketing showcase — `backend/src/lib/pdf.ts` only renders 1 generic layout. Either build the other 4, or scale the marketing claim back to match what's real.
- [ ] **Real sign-in.** The landing page's copy ("Sign In & Pay ₹199") implies an account/sign-in system that doesn't exist in the backend — it currently works like the original product: pay, get a license key by email, activate it in the extension. Decide whether to build real sign-in or adjust the landing page copy to match reality.

## 6. Content gaps
- [ ] `src/components/Testimonials.jsx` has 3 placeholder quotes that were never real customers — replace with real ones (you provide the text) or remove the section.

## 7. Before accepting real money
- [ ] One full manual pass with Razorpay **test mode**: pay → webhook fires → key emailed → extension activates → key binds on first rewrite → resume generates once and re-serves on second click → DM generates.
- [ ] Switch Razorpay from test to live keys only after the above passes.

## Explicitly out of scope (don't build unless you change your mind)
- Bulk/college licensing (batch key generation).
- Self-serve license rebinding — deferred to manual support.

## Suggested order

1 → 2 → 3 → 4 → 7 (get the real product live — the hard engineering
work is done, this is deployment + wiring). Item 5's "real sign-in"
question should be resolved before spending time polishing the
Pricing/TransformDemo wiring in item 3, since it changes that flow.
Item 6 can happen anytime, independent of the rest.
