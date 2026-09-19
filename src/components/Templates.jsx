import { Lock } from "lucide-react";

const TEMPLATES = [
  {
    name: "Modern Minimal",
    tag: "Popular",
    category: "Tech, Product & Startups",
    color: "bg-blue-600",
    for: "Clean sans-serif with royal sapphire accent & skills-first hierarchy",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between">
        <div>
          <div className="h-2 w-3/4 rounded bg-blue-700" />
          <div className="mt-1 h-1 w-1/2 rounded bg-ink/40" />
          <div className="mt-1.5 h-0.5 w-full bg-blue-200" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-5/6 rounded bg-ink/30" />
        </div>
        <div className="flex gap-1">
          <div className="h-2.5 w-8 rounded-full bg-blue-100 border border-blue-300" />
          <div className="h-2.5 w-8 rounded-full bg-blue-100 border border-blue-300" />
        </div>
      </div>
    ),
  },
  {
    name: "Executive Leadership",
    tag: "Leadership",
    category: "C-Suite, VP & Directors",
    color: "bg-emerald-600",
    for: "Hunter emerald accents, experience-first order, leadership flow",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between">
        <div>
          <div className="h-2 w-2/3 rounded bg-emerald-700" />
          <div className="mt-1 h-1 w-1/3 rounded bg-ink/40" />
          <div className="mt-1.5 h-0.5 w-full bg-emerald-200" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-4/5 rounded bg-ink/30" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-emerald-950/20" />
          <div className="h-1 w-2/3 rounded bg-emerald-950/20" />
        </div>
      </div>
    ),
  },
  {
    name: "Classic Corporate",
    tag: "Traditional",
    category: "Banking, Consulting & Law",
    color: "bg-rose-800",
    for: "Burgundy serif typography, centered prestigious header, traditional structure",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between items-center text-center">
        <div className="w-full flex flex-col items-center">
          <div className="h-2 w-1/2 rounded bg-rose-900" />
          <div className="mt-1 h-1 w-1/3 rounded bg-ink/40" />
          <div className="mt-1.5 h-0.5 w-full bg-rose-300" />
        </div>
        <div className="w-full space-y-1">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-5/6 rounded bg-ink/30" />
        </div>
        <div className="w-full space-y-1">
          <div className="h-1 w-full rounded bg-ink/20" />
        </div>
      </div>
    ),
  },
  {
    name: "Wall Street Finance",
    tag: "Banking",
    category: "Investment Banking & Risk",
    color: "bg-slate-900",
    for: "Oxford navy serif, conservative spacing, audit-grade financial layout",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between items-center text-center">
        <div className="w-full flex flex-col items-center">
          <div className="h-2 w-3/5 rounded bg-slate-900" />
          <div className="mt-1 h-1 w-2/5 rounded bg-ink/40" />
          <div className="mt-1.5 h-px w-full bg-slate-400" />
          <div className="mt-0.5 h-px w-full bg-slate-400" />
        </div>
        <div className="w-full space-y-1">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-4/5 rounded bg-ink/30" />
        </div>
      </div>
    ),
  },
  {
    name: "Tech & Engineering",
    tag: "Dev & Data",
    category: "Software, Cloud & DevOps",
    color: "bg-indigo-600",
    for: "Electric indigo accents, prominent skills grid, engineering-focused",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between">
        <div>
          <div className="h-2 w-2/3 rounded bg-indigo-700" />
          <div className="mt-1 h-1 w-1/3 rounded bg-ink/40" />
          <div className="mt-1.5 h-0.5 w-full bg-indigo-200" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="h-2 rounded bg-indigo-100 border border-indigo-300" />
          <div className="h-2 rounded bg-indigo-100 border border-indigo-300" />
          <div className="h-2 rounded bg-indigo-100 border border-indigo-300" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-3/4 rounded bg-ink/30" />
        </div>
      </div>
    ),
  },
  {
    name: "High-Density Compact",
    tag: "1-Page Fit",
    category: "Senior 10+ Yrs Veterans",
    color: "bg-sky-600",
    for: "Space-optimized tight vertical rhythm for extensive multi-role histories",
    preview: (
      <div className="flex flex-col gap-1 h-full justify-between">
        <div>
          <div className="h-1.5 w-3/5 rounded bg-sky-800" />
          <div className="mt-0.5 h-0.5 w-full bg-sky-200" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-5/6 rounded bg-ink/30" />
          <div className="h-1 w-full rounded bg-ink/30" />
        </div>
      </div>
    ),
  },
  {
    name: "Nordic Clean",
    tag: "Modern",
    category: "Operations, Strategy & HR",
    color: "bg-teal-600",
    for: "Scandinavian slate teal, generous breathing room, editorial typography",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between">
        <div>
          <div className="h-2 w-1/2 rounded bg-teal-700" />
          <div className="mt-1 h-1 w-1/4 rounded bg-ink/40" />
          <div className="mt-1.5 h-0.5 w-1/3 bg-teal-300" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1 w-full rounded bg-ink/30" />
          <div className="h-1 w-4/5 rounded bg-ink/30" />
        </div>
      </div>
    ),
  },
  {
    name: "Minimal Charcoal",
    tag: "Monochrome",
    category: "Clean Minimalist Design",
    color: "bg-zinc-700",
    for: "Refined charcoal monochrome with high-contrast subtle dividers",
    preview: (
      <div className="flex flex-col gap-1.5 h-full justify-between">
        <div>
          <div className="h-2 w-3/5 rounded bg-zinc-800" />
          <div className="mt-1 h-1 w-2/5 rounded bg-zinc-400" />
          <div className="mt-1.5 h-px w-full bg-zinc-200" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-zinc-300" />
          <div className="h-1 w-5/6 rounded bg-zinc-300" />
        </div>
      </div>
    ),
  },
];

export default function Templates() {
  return (
    <section id="templates" className="border-t-2 border-ink bg-bg py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink mb-3">
            <span>✨ 8 Professional Layouts</span>
            <span>·</span>
            <span className="text-emerald-700">100% ATS Verified</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Choose a Template Tailored for Your Industry
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
            All templates are engineered with vector typography, embedded fonts, and strict ATS-friendly text streams to pass recruiter screening algorithms.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#111111] hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="h-32 rounded-lg border-2 border-ink bg-cream p-3 flex flex-col justify-between shadow-xs">
                  {t.preview}
                </div>
                <div className="mt-3.5 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${t.color}`} />
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-ink/10 text-ink">
                    {t.tag}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-accent-blue">{t.category}</p>
                <p className="mt-1 text-xs text-ink-muted leading-snug">{t.for}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-ink/10 flex items-center justify-between text-[11px] font-semibold text-ink-muted">
                <span>Single / 2-Page Fit</span>
                <span className="text-emerald-700 font-bold">✓ ATS Ready</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 rounded-xl border-2 border-ink bg-surface px-6 py-5 text-center shadow-[4px_4px_0_#111111]">
          <p className="text-sm font-bold text-ink">
            Ready to generate your resume?
          </p>
          <a
            href="#analyzer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_#111111] hover:-translate-y-0.5 transition-transform"
          >
            <span>Launch Profile Analyzer</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
