const FAQS = [
  {
    q: "What exactly does LinkedIn optimization change?",
    a: "Your headline, About section, experience bullets and skills order. You get a rewritten version of each section, plus the reasoning behind the change, and you decide what to keep.",
  },
  {
    q: "Do you post or edit anything on my LinkedIn?",
    a: "No. Nothing is written to your LinkedIn account. You copy the sections you want into LinkedIn's own editor yourself.",
  },
  {
    q: "How long does it take?",
    a: "Importing your profile and reviewing the rewrites usually takes about ten minutes. Tailoring it to a specific job takes a couple more.",
  },
  {
    q: "Is ₹199 really a one-time payment?",
    a: "Yes. It's a single payment tied to your LinkedIn account — not a subscription, no recurring charge, no expiry.",
  },
  {
    q: "How many resumes do I get?",
    a: "One ATS-friendly resume, generated from your optimized profile. LinkedIn optimization itself — rewriting your headline, About and experience — is unlimited on your account.",
  },
  {
    q: "Why do I need to sign in?",
    a: "Signing in lets us securely access your LinkedIn profile to generate rewrites, and ties your one-time payment to that specific account.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border-2 border-ink bg-white px-5 py-4 shadow-[3px_3px_0_#111111]"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-bold text-ink">
                <span className="shrink-0 text-brand-hover transition-transform group-open:rotate-90">
                  →
                </span>
                {item.q}
              </summary>
              <p className="mt-3 pl-6 text-sm leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
