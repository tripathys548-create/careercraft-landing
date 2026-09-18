import { Check, ArrowRight } from "lucide-react";

const PLAN_FEATURES = [
  "Full LinkedIn profile optimization",
  "Headline, About, experience and skills rewrites",
  "Profile score and section-by-section fixes",
  "Job description matching and keyword recommendations",
  "1 ATS-friendly resume, generated from your optimized profile",
  "Tied to your account — use it whenever you update your profile",
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-md px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          One plan. One-time fee.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-ink-muted">
          No subscription. Sign in, pay once, optimize your LinkedIn.
        </p>

        <div className="mt-10 flex flex-col rounded-2xl border-2 border-ink bg-white p-8 shadow-[8px_8px_0_#111111]">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
            CareerCraft — Full Access
          </p>
          <div className="mt-3 flex items-end gap-1">
            <span className="font-display text-5xl font-bold tracking-tight text-ink">
              ₹199
            </span>
            <span className="pb-1 text-sm text-ink-muted">one-time</span>
          </div>
          <p className="mt-2 text-sm font-medium text-ink-muted">
            Per LinkedIn account. No recurring charge.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {PLAN_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink">
                <Check size={16} className="mt-0.5 shrink-0 text-brand-hover" />
                {f}
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5"
          >
            Sign In &amp; Pay ₹199
            <ArrowRight size={16} />
          </a>

          <p className="mt-4 text-center text-xs text-ink-muted">
            CareerCraft reads your LinkedIn profile via a browser
            extension, which may violate LinkedIn's User Agreement and
            can result in restriction of your LinkedIn account — a real
            risk, not a formality. Purchase only if you accept this risk.
            See our{" "}
            <a href="#" className="underline hover:text-ink">
              Terms &amp; Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
