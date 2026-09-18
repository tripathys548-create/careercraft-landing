# Ready-to-Paste Antigravity Prompts — CareerCraft

Self-contained prompts for this repo. `backend/` and `extension/` are
real, tested code (carried over from an earlier build of the same
product, rebranded to CareerCraft) — these prompts are deployment and
wiring tasks, not "build from scratch."

---

## 1. Deploy the backend (do TODO.md item 1 yourself first)

Before using this prompt, have all 9 secret values from `README.md`
ready to paste.

```
Deploy the backend in backend/ (Cloudflare Workers). Steps:

1. Read backend/README.md (or the root README.md) for the full list
   of required secrets.
2. Run `npx wrangler secret put <NAME>` for each of the 9 secrets —
   I will paste each value when prompted, one at a time. Do not print
   secret values back to me or log them anywhere.
3. Run `npx wrangler deploy` from the backend/ directory.
4. Confirm the deployment by sending a POST request to
   <deployed-url>/create-order and showing me the raw response — it
   should be a JSON object with `id`, `amount` (19900), and `currency`
   fields from Razorpay, not an error.
5. Report the deployed Workers URL back to me.

Do not modify any application code in this task — this is deploy and
verify only.
```

---

## 2. Deploy the landing page and wire the pricing button

```
1. Build and deploy the landing page (npm run build, then host the
   output on Cloudflare Pages/Netlify/your choice). Report the live
   URL.

2. In src/components/Pricing.jsx, the "Sign In & Pay ₹199" link is
   currently href="#". Replace it with real behavior:
   - On click, POST to <deployed backend URL>/create-order.
   - Open Razorpay Checkout with the returned order (mirror the
     amount/currency/order_id fields Razorpay's SDK expects — see
     Razorpay's Checkout.js documentation for the exact shape).
   - On successful payment, show a message telling the user their
     license key will arrive by email (the backend's webhook handles
     key generation and emailing already — don't rebuild that part).
   - There is no separate "sign in" step in the backend yet — this
     flow collects an email at checkout time, same as it does for the
     license-key delivery. Don't build a login system as part of this
     task; that's a separate decision (see TODO.md item 5).

Don't change the copy, layout, or any other component — only replace
the dead link's behavior.
```

---

## 3. Wire up the extension

```
Two placeholders need real values in extension/:

- extension/src/background/background.js: replace the BACKEND_URL
  placeholder with <PASTE DEPLOYED WORKERS URL>.
- extension/src/popup/popup.html: replace the "Purchase here" link's
  placeholder href with <PASTE LANDING PAGE URL>#pricing.

Grep for the exact placeholder strings first, show me every match
before editing, then make only these replacements. After that, load
the extension unpacked in Chrome (chrome://extensions, Developer mode,
Load unpacked, select extension/) and manually verify: the disclaimer
blocks progress until checked, an invalid key is rejected, a valid key
binds to a LinkedIn account on first rewrite, and the rewrite/DM/resume
buttons each return real output from the deployed backend.
```

---

## 4. Build the 5 PDF templates (or scale back the marketing claim)

```
src/components/Templates.jsx on the landing page shows 5 illustrative
resume template styles: Fresher, Advanced, Expert, Technical,
Executive. backend/src/lib/pdf.ts currently only renders one generic
layout via pdf-lib. Either:

(a) Extend backend/src/lib/pdf.ts to accept a template name and render
    5 distinct layouts matching each style's preview card in
    Templates.jsx (e.g. Technical has a skills-chip row near the top,
    Executive is minimal with thin rule lines, Fresher is single-column
    with an accent header bar) — update backend/src/routes/generateResume.ts
    to accept and pass through a template choice, and update its tests, OR

(b) If building 5 real templates isn't worth it right now, tell me
    instead of guessing — I'll decide whether to descope the landing
    page's Templates section down to what's actually built.

Don't silently ship a mismatch between what the landing page promises
and what the backend renders.
```

---

## 5. Admin UI

```
backend has three working, password-gated admin API routes with no
frontend: GET /admin/messages, GET /admin/generations, GET /admin/keys
(see backend/src/routes/admin.ts and backend/src/lib/adminAuth.ts for
the exact auth mechanism — a Bearer token compared to ADMIN_PASSWORD).

Build a minimal internal admin page at admin/index.html (plain
HTML/JS, no framework, no build step):

- A password field (stores the entered password in memory only, never
  localStorage) used as the Bearer token on every request.
- Three sections: Support Messages, Generated Content, License Keys —
  each renders the JSON array from its endpoint as a simple table.
- For Support Messages, add a way to view a message and save a reply
  into `admin_reply` (add a POST /admin/messages/:id/reply route in
  admin.ts if it doesn't exist yet, following the existing route
  patterns).

Deploy this as its own page, not linked from any public page. Tell me
where you deployed it.
```

---

## 6. Support reply email delivery

```
backend/src/routes/admin.ts lets an admin save an admin_reply onto a
support_messages row, but nothing emails it to the user. Add a
function in backend/src/lib/email.ts (e.g. sendSupportReplyEmail,
matching the existing sendLicenseKeyEmail's shape) that emails the
reply to the row's `email` column after it's saved. Write a test
following the pattern in backend/test/email.test.ts.
```

---

## 7. Terms & Privacy Policy pages

```
The landing page's Pricing and TransformDemo sections both link to
"Terms & Privacy Policy" via href="#" — CareerCraft has no ToS/Privacy
page of its own yet. Build real pages matching this project's existing
design system (see src/index.css for the color/font tokens).

IMPORTANT: Do not write the actual legal content yourself. Fill each
page with clearly marked placeholder sections (e.g. "[PLACEHOLDER:
data retention policy — needs legal review]") for every substantive
clause. You may state plain facts about what's actually stored — read
backend/db/schema.sql for the real tables (license_keys, usage_log,
generated_content, support_messages) and describe those factually.
Link both pages from the landing page's footer and from the extension
popup's first-run disclaimer.
```

---

## 8. Testimonials

```
src/components/Testimonials.jsx has 3 placeholder quotes that were
never real customers. I will either provide real testimonial text for
you to use, or tell you to remove the section — do not write new
testimonial content yourself.
```
