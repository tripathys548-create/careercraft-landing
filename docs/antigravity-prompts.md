# Ready-to-Paste Antigravity Prompts — CareerCraft

Self-contained prompts for this repo only. None of them reference
files in any other project — if a result ever tries to import from or
copy a pattern out of a different repo, that's wrong; this project
stands alone.

---

## 1. Backend scaffold (decide the LinkedIn-capture mechanism first)

**Before running this**, decide how CareerCraft gets a user's LinkedIn
data — see TODO.md step 1. Fill in the blank below before pasting.

```
Build a new backend for CareerCraft (a LinkedIn-optimization product)
in a new backend/ directory. Use Cloudflare Workers + a Postgres
database (e.g. Neon) — pick whichever serverless host keeps this
cheap to run at low volume, since margins depend on near-zero fixed
cost per user.

Requirements:

1. Auth: email + OTP sign-in. Generate a one-time code, email it via
   a transactional email API, verify it, then issue a signed session
   token (e.g. a JWT or HMAC-signed opaque token) the frontend stores
   and sends on subsequent requests. No server-side session table
   needed.

2. Payment: a Razorpay one-time order flow for ₹199.
   - POST /create-order: creates a Razorpay order for 19900 paise.
   - POST /payment-webhook: verifies the webhook signature by
     computing HMAC-SHA256 of the raw request body using the
     Razorpay webhook secret, comparing it against the
     X-Razorpay-Signature header, and rejecting the request if they
     don't match. Must be idempotent on Razorpay's payment ID — check
     whether a record already exists for that payment ID before
     creating anything new, so a retried webhook delivery is a no-op.
   - On successful payment, mark the associated user account as paid.

3. LinkedIn data capture: implement <FILL IN: OAuth / browser
   extension / manual paste-in form, per TODO.md step 1>.

4. All secrets (Razorpay keys, DB credentials, email provider key)
   must be platform secrets, never committed to the repo or present
   in any client-side code.

5. Write tests for the auth flow and the payment webhook — especially
   a test that an invalid/tampered signature is rejected, and a test
   that a repeated webhook call for the same payment ID doesn't create
   a duplicate paid-account record.

Do not build LLM rewrite endpoints or PDF generation yet — those are
separate follow-up tasks.
```

---

## 2. LLM rewrite endpoints

```
Add endpoints to backend/ for LLM-based LinkedIn profile rewriting.
Require a valid, paid session (from the auth system already built)
before calling the LLM, and rate-limit each account (e.g. 50 calls/day)
as a cost/abuse guard independent of the one-time payment.

Endpoints needed:
- Rewrite headline: SEO/recruiter-search-optimized, under ~220 characters.
- Rewrite About section: three-part narrative (hook, journey, call to action).
- Rewrite experience bullets: each starts with an action verb and
  includes a metric.
- Reorder/suggest skills: ranked by relevance to a target role, if one
  is supplied alongside the request.

Implementation notes:
- Use a low-cost, fast LLM (e.g. a "flash"/"mini" tier model) behind a
  single provider-call function, so swapping providers later means
  changing one function, not every endpoint.
- Force JSON output via a strict system prompt describing the exact
  shape expected. If the response fails to parse as JSON, retry once
  with a stricter "return ONLY valid JSON, no surrounding text" prompt.
  If it still fails, return a clean error response — never let a
  malformed LLM response surface as a raw 500 to the frontend.
- Log a request count per account for rate-limiting, but do not persist
  the raw input profile text beyond what's needed to serve the
  response — store generated outputs, not scraped/pasted inputs, to
  minimize what's retained.
```

---

## 3. PDF template rendering

```
Build PDF generation for 5 resume template styles: Fresher, Advanced,
Expert, Technical, Executive. Look at src/components/Templates.jsx in
this repo — it has small illustrative preview cards for each style
already; match each PDF's actual layout to its preview's visual logic:

- Fresher: single column, an accent-colored header bar, small skill tags.
- Advanced: two-column balanced layout for experience entries.
- Expert: a bold, prominent header block, achievement-focused body copy.
- Technical: a skills-chip row placed near the top of the page.
- Executive: minimal — thin rule lines separating sections, generous
  whitespace, no decorative elements.

Use a PDF library that doesn't require a headless browser (e.g.
pdf-lib) so this stays deployable on the same serverless backend as
everything else — no Chromium dependency. Each template takes
structured content (name, headline, summary, experience[], education[],
skills[]) and returns PDF bytes.
```

---

## 4. Wire the landing page to the real backend

```
Two components in src/components/ currently use mocked/placeholder
behavior instead of the real backend built in tasks 1-3:

1. TransformDemo.jsx: right now, clicking "See Example" after checking
   the consent box always shows the same hardcoded EXAMPLE object,
   regardless of what URL was typed. Leave that exact behavior in
   place for signed-out visitors — don't change the demo's honesty
   framing ("this is an example, not your profile"). Add a *separate*
   authenticated flow: once a user is signed in, paid, and has
   provided their profile data (via whichever capture mechanism was
   built), a real "Rewrite My Profile" action should call the actual
   rewrite endpoint from task 2 and show real output, clearly not
   labeled as an example.

2. Pricing.jsx: the "Sign In & Pay ₹199" button currently links to
   "#". Wire it to open the real sign-in flow, and on success, the
   real Razorpay Checkout modal for the ₹199 order from task 1.

Don't change the visual design or copy of either component — only
replace the mocked/dead behavior with real calls.
```

---

## 5. Terms, Privacy, and testimonials

```
Two content gaps:

1. src/components/Testimonials.jsx has 3 placeholder quotes that were
   never real customers. I will either provide real testimonial text
   for you to use, or tell you to remove the section — do not write
   new testimonial content yourself.

2. Pricing.jsx, TransformDemo.jsx, and Footer.jsx all link to
   "Terms & Privacy Policy" via href="#". Build real terms.html and
   privacy.html pages (or routes, if routing has been added) matching
   this project's existing design system (see src/index.css for the
   color/font tokens already defined). Mark every substantive legal
   clause as "[PLACEHOLDER: needs legal review]" rather than inventing
   policy language. You may state plain facts about what the product
   actually stores once the backend exists (e.g. "we store your email
   and your optimized profile text") — just don't draft actual legal
   terms (liability, arbitration, data retention periods, etc.)
   yourself.
```
