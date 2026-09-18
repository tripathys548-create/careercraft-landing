import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const EXAMPLE = {
  before: {
    headline: "Software Engineer at TCS",
    about:
      "Passionate developer with experience in various technologies. Looking for new opportunities to grow.",
  },
  after: {
    headline: "Backend Engineer — Node.js, PostgreSQL, AWS | Ex-TCS, building for scale",
    about:
      "I build backend systems that handle real production load — not just tutorials. Over 2 years I've cut API latency by 40% and shipped services running at 10k+ requests/min.",
  },
};

export default function TransformDemo() {
  const [url, setUrl] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const canSubmit = url.trim().length > 3 && agreed;

  return (
    <section id="demo" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          See your transformation
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-ink-muted">
          Paste your LinkedIn profile URL to see an example of the kind of
          rewrite CareerCraft produces.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) setRevealed(true);
          }}
          className="mx-auto mt-8 max-w-xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setRevealed(false);
              }}
              placeholder="linkedin.com/in/your-name"
              className="flex-1 rounded-lg border-2 border-ink bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={16} />
              See Example
            </button>
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-hover"
            />
            <span>
              I understand this demo shows an illustrative example, not a
              rewrite of my actual profile. Real optimization reads my
              LinkedIn profile via a browser extension, which may violate
              LinkedIn's User Agreement and can result in{" "}
              <strong>restriction of my LinkedIn account</strong> — a real
              risk, not a formality. See the{" "}
              <a href="/terms.html" className="underline hover:text-ink">
                Terms
              </a>{" "}
              &amp;{" "}
              <a href="/privacy.html" className="underline hover:text-ink">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </form>

        {revealed && (
          <div className="reveal-in mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-ink bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                Before
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">
                {EXAMPLE.before.headline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {EXAMPLE.before.about}
              </p>
            </div>
            <div className="rounded-xl border-2 border-ink bg-brand-soft p-5 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-hover">
                After
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">
                {EXAMPLE.after.headline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {EXAMPLE.after.about}
              </p>
            </div>
          </div>
        )}

        {revealed && (
          <p className="mt-6 text-center text-sm text-ink-muted">
            This is an example, not your profile. Sign in to optimize your
            own LinkedIn.
            <a href="#pricing" className="ml-2 inline-flex items-center gap-1 font-bold text-brand-hover hover:underline">
              Get started <ArrowRight size={14} />
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
