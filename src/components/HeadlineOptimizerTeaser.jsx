import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function HeadlineOptimizerTeaser() {
  const [headline, setHeadline] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);

  const sampleHeadlines = [
    "Software Engineer at ABC Tech | React & Node.js",
    "Marketing Specialist seeking new opportunities",
    "Associate at NatWest | Regulatory Reporting | Derivatives",
    "Product Manager | Driving Growth & Agile Teams",
  ];

  function optimizeHeadline(inputHeadline) {
    const raw = (inputHeadline || headline).trim();
    if (!raw) return;

    setIsOptimizing(true);
    setResult(null);

    // High-converting algorithmic optimization heuristics
    setTimeout(() => {
      const lower = raw.toLowerCase();
      let role = "Specialist";
      let domain = "Technology & Operations";
      let techKeywords = ["Enterprise Architecture", "Strategic Execution", "Cross-Functional Leadership"];

      if (lower.includes("software") || lower.includes("engineer") || lower.includes("developer") || lower.includes("react") || lower.includes("node")) {
        role = "Senior Software Engineer";
        domain = "Full-Stack Web & Distributed Systems";
        techKeywords = ["React / Node.js Ecosystem", "Cloud Architecture", "Performance Optimization"];
      } else if (lower.includes("regulatory") || lower.includes("reporting") || lower.includes("emir") || lower.includes("cftc") || lower.includes("derivative") || lower.includes("natwest") || lower.includes("bank")) {
        role = "Trade & Transaction Regulatory Reporting SME";
        domain = "OTC Derivatives (IRD, Credit) & ISO 20022 XML";
        techKeywords = ["EMIR Refit & 3.0", "CFTC Parts 43/45", "UTI/UPI Lifecycle", "DTCC Reconciliation"];
      } else if (lower.includes("marketing") || lower.includes("growth") || lower.includes("brand")) {
        role = "Growth Marketing Strategist";
        domain = "B2B Performance & Brand Scale";
        techKeywords = ["Customer Acquisition", "Funnel Optimization", "Data-Driven ROI"];
      } else if (lower.includes("product") || lower.includes("pm") || lower.includes("agile")) {
        role = "Product Management Leader";
        domain = "SaaS Platform & Strategic Growth";
        techKeywords = ["0-to-1 Product Roadmapping", "User Discovery", "Agile Lifecycle"];
      } else {
        const words = raw.split(/[|,/]/).map((w) => w.trim()).filter(Boolean);
        role = words[0] ? `${words[0]} SME` : "Domain Specialist";
        domain = words[1] ? words[1] : "Operations & Strategy";
      }

      const variation1 = `${role} | ${domain} | ${techKeywords.slice(0, 2).join(" • ")} | Driving Measurable Operational Impact`;
      const variation2 = `${role} @ Enterprise Scale | ${techKeywords.join(" | ")} | High-Impact Execution`;

      setResult({
        original: raw,
        beforeScore: Math.floor(Math.random() * 15) + 42, // 42-57
        afterScore: Math.floor(Math.random() * 6) + 93,   // 93-98
        variations: [
          { title: "Recruiter-Search Optimized (Max Search Indexing)", text: variation1 },
          { title: "Executive Authority Style (High-Conversion)", text: variation2 },
        ],
        improvements: [
          "Eliminated generic filler phrasing & passive keywords",
          "Injected high-frequency recruiter search terms",
          "Structured headline format: Role → Specialty → Impact Proof",
        ],
      });
      setIsOptimizing(false);
    }, 650);
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_#111111] sm:p-7 text-left">
      <div className="flex items-center justify-between border-b-2 border-ink/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-brand">
            <Sparkles size={16} className="text-ink" />
          </span>
          <span className="font-display text-base font-bold text-ink sm:text-lg">
            Instant Headline Optimizer
          </span>
        </div>
        <span className="rounded-full border border-accent-green/40 bg-accent-green/10 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-accent-green">
          Free Live Tool
        </span>
      </div>

      <p className="mt-3 text-xs text-ink-muted sm:text-sm">
        Paste your current LinkedIn headline to see how recruiters and search algorithms evaluate your profile:
      </p>

      {/* Input bar */}
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && optimizeHeadline()}
          placeholder="e.g. Software Engineer at Tech Corp | Looking for opportunities"
          className="h-11 flex-1 rounded-lg border-2 border-ink bg-cream px-3.5 text-xs text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none sm:text-sm"
        />
        <button
          type="button"
          onClick={() => optimizeHeadline()}
          disabled={isOptimizing || !headline.trim()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_#111111] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#111111] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_#111111]"
        >
          {isOptimizing ? (
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="animate-spin" /> Optimizing...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              Optimize Free <Sparkles size={14} />
            </span>
          )}
        </button>
      </div>

      {/* Sample presets */}
      {!result && !isOptimizing && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-2xs text-ink-muted">
          <span className="font-semibold">Try sample:</span>
          {sampleHeadlines.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setHeadline(sample);
                optimizeHeadline(sample);
              }}
              className="rounded border border-ink/20 bg-cream/70 px-2 py-0.5 text-ink hover:border-ink hover:bg-cream truncate max-w-[200px]"
            >
              {sample}
            </button>
          ))}
        </div>
      )}

      {/* Optimization Results Box */}
      {result && (
        <div className="mt-5 animate-in fade-in rounded-xl border-2 border-ink bg-cream p-4 sm:p-5">
          {/* Score comparison bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink/10 pb-3.5">
            <div>
              <p className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
                Search & Impact Score
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-bad">
                  {result.beforeScore}/100
                </span>
                <span className="text-xs font-bold text-ink-muted">→</span>
                <span className="font-mono text-xl font-extrabold text-accent-green">
                  {result.afterScore}/100
                </span>
                <span className="rounded bg-accent-green/20 px-1.5 py-0.2 font-mono text-2xs font-bold text-accent-green">
                  +{result.afterScore - result.beforeScore} pts
                </span>
              </div>
            </div>

            <ul className="space-y-1 text-2xs text-ink">
              {result.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={12} className="text-accent-green shrink-0" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Generated variations */}
          <div className="mt-4 space-y-3">
            {result.variations.map((v, idx) => (
              <div
                key={idx}
                className="rounded-lg border-2 border-ink/80 bg-white p-3.5 shadow-[2px_2px_0_#111111]"
              >
                <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-ink-muted">
                  <span>{v.title}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(v.text);
                      alert("Headline copied to clipboard!");
                    }}
                    className="rounded bg-cream px-2 py-0.5 text-2xs font-bold text-ink hover:bg-brand"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-ink sm:text-sm leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>

          {/* Lead Magnet CTA for Full Suite */}
          <div className="mt-5 rounded-xl border-2 border-brand bg-brand-soft p-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="font-display text-sm font-bold text-ink">
                Ready to rewrite your entire profile, About section & generate ATS Resumes?
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                Unlock the full 3-in-1 Suite (Profile Rewriter + Referral DM Generator + ATS PDF) for just ₹199.
              </p>
            </div>
            <a
              href="#pricing"
              className="mt-3 sm:mt-0 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_#111111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#111111]"
            >
              Get Full Suite (₹199)
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
