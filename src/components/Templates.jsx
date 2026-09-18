import { Lock } from "lucide-react";

const TEMPLATES = [
  {
    name: "Fresher",
    for: "Campus placements, first job",
    preview: (
      <>
        <div className="h-2 w-2/3 rounded bg-ink/70" />
        <div className="mt-1.5 h-1.5 w-1/3 rounded bg-ink-muted/40" />
        <div className="mt-3 h-1.5 w-full rounded bg-surface" />
        <div className="mt-1 h-1.5 w-full rounded bg-surface" />
        <div className="mt-3 flex gap-1">
          <div className="h-3 w-8 rounded-full border border-ink bg-brand-soft" />
          <div className="h-3 w-8 rounded-full border border-ink bg-brand-soft" />
        </div>
      </>
    ),
  },
  {
    name: "Advanced",
    for: "1–3 yrs, switching companies",
    preview: (
      <>
        <div className="h-2 w-2/3 rounded bg-ink/70" />
        <div className="mt-2 grid grid-cols-3 gap-1">
          <div className="col-span-2 h-1.5 rounded bg-surface" />
          <div className="h-1.5 rounded bg-brand-soft" />
          <div className="col-span-2 h-1.5 rounded bg-surface" />
          <div className="h-1.5 rounded bg-brand-soft" />
        </div>
      </>
    ),
  },
  {
    name: "Expert",
    for: "Senior ICs, 4+ yrs experience",
    preview: (
      <>
        <div className="h-3 w-full rounded bg-ink/80" />
        <div className="mt-2 h-1.5 w-full rounded bg-brand-soft" />
        <div className="mt-1 h-1.5 w-5/6 rounded bg-brand-soft" />
        <div className="mt-1 h-1.5 w-full rounded bg-surface" />
      </>
    ),
  },
  {
    name: "Technical",
    for: "Engineers, skills-first roles",
    preview: (
      <>
        <div className="h-2 w-1/2 rounded bg-ink/70" />
        <div className="mt-2 flex flex-wrap gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-6 rounded border border-ink bg-brand-soft" />
          ))}
        </div>
        <div className="mt-2 h-1.5 w-full rounded bg-surface" />
      </>
    ),
  },
  {
    name: "Executive",
    for: "Leadership and management",
    preview: (
      <>
        <div className="h-1.5 w-1/3 rounded bg-ink/60" />
        <div className="mt-3 h-px w-full bg-ink/30" />
        <div className="mt-3 h-1.5 w-full rounded bg-surface" />
        <div className="mt-3 h-px w-full bg-ink/30" />
      </>
    ),
  },
];

export default function Templates() {
  return (
    <section id="templates" className="border-t-2 border-ink">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          Pick a template that fits where you are
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-ink-muted">
          Once you're signed in, we take the details from your optimized
          profile and format them into whichever style fits your career
          stage — pick a template, generate your PDF.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#111111]"
            >
              <div className="h-28 rounded-lg border-2 border-ink bg-cream p-3">
                {t.preview}
              </div>
              <p className="mt-4 text-sm font-bold text-ink">{t.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{t.for}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 rounded-xl border-2 border-ink bg-surface px-6 py-5 text-center">
          <p className="text-sm font-semibold text-ink">
            Sign in &amp; pay once → pick a template → generate your PDF
          </p>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-cream px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-muted opacity-70"
          >
            <Lock size={14} />
            Generate PDF — after sign-in
          </button>
        </div>
      </div>
    </section>
  );
}
