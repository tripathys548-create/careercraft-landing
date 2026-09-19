import { useState } from "react";
import { Eye, X, Check, ArrowRight, Sparkles } from "lucide-react";

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
  const [activeModal, setActiveModal] = useState(null);

  const openTemplateInAnalyzer = (templateId) => {
    setActiveModal(null);
    const analyzerElem = document.getElementById("analyzer");
    if (analyzerElem) {
      analyzerElem.scrollIntoView({ behavior: "smooth" });
    }
  };

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
              onClick={() => setActiveModal(t)}
              className="cursor-pointer flex flex-col justify-between rounded-xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#111111] hover:-translate-y-1 hover:shadow-[6px_6px_0_#111111] transition-all group"
            >
              <div>
                <div className="relative h-32 rounded-lg border-2 border-ink bg-cream p-3 flex flex-col justify-between shadow-xs group-hover:bg-amber-50/50 transition-colors">
                  {t.preview}
                  <div className="absolute inset-0 bg-ink/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                    <span className="inline-flex items-center gap-1.5 bg-ink text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                      <Eye size={13} /> Click to Preview
                    </span>
                  </div>
                </div>
                <div className="mt-3.5 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${t.color}`} />
                    <p className="text-sm font-bold text-ink group-hover:text-brand-hover transition-colors">{t.name}</p>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-ink/10 text-ink">
                    {t.tag}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-accent-blue">{t.category}</p>
                <p className="mt-1 text-xs text-ink-muted leading-snug">{t.for}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-ink/10 flex items-center justify-between text-[11px] font-semibold text-ink-muted">
                <span className="text-ink font-medium flex items-center gap-1">
                  <Eye size={12} /> Inspect Layout
                </span>
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

      {/* Interactive Template Preview Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[8px_8px_0_#111111]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-lg border-2 border-ink bg-surface p-1.5 text-ink hover:bg-cream transition-colors"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${activeModal.color}`} />
              <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                {activeModal.name} Template
              </h3>
              <span className="ml-2 rounded-full border border-ink/20 bg-cream px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-ink">
                {activeModal.tag}
              </span>
            </div>

            <p className="mt-1 text-xs font-semibold text-accent-blue">
              Best for: {activeModal.category}
            </p>

            <div className="mt-5 rounded-xl border-2 border-ink bg-surface p-4 sm:p-6 shadow-inner font-sans text-ink">
              {/* Mock Resume Header */}
              <div className="border-b pb-3 border-ink/20">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-bold text-lg text-ink">ALEXANDER MORGAN</h4>
                  <span className="text-[11px] font-semibold text-ink-muted">London, UK · +44 20 7946 0912</span>
                </div>
                <p className="text-xs font-semibold text-accent-blue mt-0.5">
                  Senior Vice President · Strategic Derivatives &amp; Risk Operations
                </p>
                <p className="text-[10px] text-ink-muted mt-0.5">linkedin.com/in/alex-morgan · alex.morgan@example.com</p>
              </div>

              {/* Mock Summary */}
              <div className="mt-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                  Professional Summary
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink/80">
                  Senior institutional leader with 10+ years driving global trade reporting, regulatory control frameworks (EMIR Refit, CFTC, MAS), and post-trade optimization across multi-asset derivative portfolios.
                </p>
              </div>

              {/* Mock Experience */}
              <div className="mt-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                  Experience &amp; Leadership
                </p>
                <div className="mt-1.5 space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span>Director – Regulatory Reporting Controls</span>
                      <span className="text-[10px] font-semibold text-ink-muted">2021 – Present</span>
                    </div>
                    <p className="text-[10.5px] font-medium text-brand-hover">Global Investment Bank · London</p>
                    <ul className="mt-1 list-disc list-inside space-y-0.5 text-[10.5px] text-ink/80 leading-snug">
                      <li>Orchestrated EMIR Refit and CFTC Rewrite delivery with zero day-one critical breaks.</li>
                      <li>Architected deterministic reconciliation rules reducing exception triage latency by 42%.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mock Skills */}
              <div className="mt-3.5 pt-2 border-t border-ink/10">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                  Core Competencies &amp; Systems
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["EMIR Refit", "CFTC Parts 43/45", "Interest Rate Derivatives", "ISO 20022 XML", "DTCC GTR", "UAT & SIT"].map((skill) => (
                    <span key={skill} className="rounded-md border border-ink/20 bg-white px-2 py-0.5 text-[10px] font-medium text-ink shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Check size={16} /> Strict ATS linear parsing verified
              </div>
              <button
                type="button"
                onClick={() => openTemplateInAnalyzer(activeModal.name)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_#111111] hover:-translate-y-0.5 transition-transform"
              >
                <span>Select &amp; Create with this Layout</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
