# Remaining Work — CareerCraft

Standalone product, standalone repo. Nothing here depends on or
shares infrastructure with any other project — if a task ever says
"like the other project does it," that's a mistake, flag it back.

Status: **mockup only**. No backend, no auth, no payment, no real
LinkedIn data ever touched. Every "Sign In" / "Get Started" / "Sign In
& Pay ₹199" link is a dead `href="#"`.

## 1. Decide the LinkedIn data-capture mechanism (a decision, not a task)

Before any backend work starts, decide how CareerCraft actually gets a
user's LinkedIn profile content:

- **LinkedIn OAuth** — check LinkedIn's API terms first; the scopes
  needed to read profile sections like About/Experience are heavily
  restricted and this may not be permitted for this use case at all.
- **A browser extension** that reads the logged-in user's own profile
  DOM — technically reliable, but carries real LinkedIn ToS risk (their
  User Agreement prohibits this kind of automation, with account
  restriction as the consequence, not just a takedown).
- **Manual paste-in** — user copies their headline/About/experience
  text into a form themselves. Safest option, weakest UX, zero ToS
  exposure since nothing is read from LinkedIn automatically.

This choice shapes the auth design (an extension needs a companion
sign-in flow different from a pure web form) — decide it before
starting task 2.

## 2. Backend (from scratch)

- [ ] **Auth**: email + OTP sign-in. Store a signed session token;
      no need for a server-side session table.
- [ ] **Payment**: Razorpay one-time ₹199 order + webhook. The webhook
      handler MUST verify Razorpay's HMAC-SHA256 signature on every
      request before trusting the payload (compute HMAC-SHA256 of the
      raw request body using the webhook secret, compare against the
      `X-Razorpay-Signature` header) and MUST be idempotent on
      Razorpay's payment ID (check for an existing record before
      creating a new one) so a retried webhook delivery doesn't
      double-process a payment.
- [ ] **LinkedIn data capture**: implement whichever mechanism was
      chosen in step 1.
- [ ] **Secrets**: Razorpay keys, LLM API key, email provider key, DB
      credentials — all as platform secrets (e.g. Cloudflare Workers
      secrets, or your chosen host's equivalent), never in client code
      or committed to the repo.
- [ ] Tests for auth and payment logic, including the webhook
      signature-verification and idempotency behavior specifically —
      those are the two places a bug is expensive.

## 3. LLM rewrite endpoints

- [ ] Endpoints to rewrite: headline (recruiter-search-optimized),
      About section (three-part narrative: hook, journey, CTA),
      experience bullets (action verb + metric), skills (reordered by
      relevance to a target role, if one is given).
- [ ] Force the LLM to return structured JSON via a strict system
      prompt; if the response fails to parse as JSON, retry once with
      a stricter "return ONLY valid JSON" prompt before giving up and
      returning a clean error — don't let a malformed response reach
      the user as a raw 500.
- [ ] Rate-limit per account (e.g. a daily cap) as a cost/abuse guard,
      independent of the one-time payment — this stops a single
      compromised account from generating unbounded LLM spend.

## 4. PDF template rendering

The landing page shows 5 illustrative template styles in
`src/components/Templates.jsx`: **Fresher, Advanced, Expert,
Technical, Executive**. Build real rendering for each, matching that
component's visual logic:
- Fresher: single column, accent header bar, skill tags
- Advanced: two-column balance
- Expert: bold header block, achievement-focused
- Technical: skills-chip row near the top
- Executive: minimal, thin rule lines, lots of whitespace

Use a pure client/server-side PDF library that doesn't require a
headless browser (e.g. `pdf-lib` if the backend runs on a serverless
edge platform) to keep hosting costs low.

## 5. Wire the landing page to the real backend

- [ ] `src/components/TransformDemo.jsx` currently always shows the
      same hardcoded example on submit. For a signed-in, paid user
      with real profile data, call the real rewrite endpoint instead —
      but keep the "this is an example, not your profile" framing for
      signed-out visitors exactly as it is now; don't let a signed-out
      demo ever imply it processed someone's real data.
- [ ] `src/components/Pricing.jsx`'s "Sign In & Pay ₹199" button needs
      to open the real sign-in flow, then Razorpay Checkout.

## 6. Content gaps

- [ ] `src/components/Testimonials.jsx` has 3 placeholder quotes that
      were never real customers — replace with real ones (you provide
      the text) or remove the section. Do not write new fabricated
      testimonials.
- [ ] `Pricing.jsx`, `TransformDemo.jsx`, and `Footer.jsx` all link to
      "Terms & Privacy Policy" via `href="#"`. Build real pages, but
      mark every substantive legal clause as
      `[PLACEHOLDER: needs legal review]` rather than inventing policy
      language — only state plain facts about what's actually stored
      once the backend exists (e.g. "we store your email and your
      optimized profile text").

## Suggested order

1. Resolve step 1 (LinkedIn capture mechanism) — a conversation, not a task.
2. Step 2 (backend) → step 3 (LLM) → step 4 (PDF) → step 5 (wire it up).
3. Step 6 (content) can happen anytime, in parallel.
