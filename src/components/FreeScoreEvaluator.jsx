import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import ScoreRing from "./ui/ScoreRing";
import Chip from "./ui/Chip";
import SampleBadge from "./ui/SampleBadge";
import { Sparkles, CheckCircle2, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { analytics } from "../lib/analytics";

const PRESET_SAMPLES = [
  "Software Engineer at Tech Corp | Open to work",
  "Associate | Investment Banking & Valuation | CFA Level II Candidate",
  "Marketing Specialist | Social Media, Content & Lead Gen",
];

export default function FreeScoreEvaluator({ marketConfig }) {
  const [headline, setHeadline] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  // Deterministic scoring function (No random numbers)
  const evaluateHeadline = (input) => {
    const text = (input || headline).trim();
    if (!text) return;

    analytics.scoreFlowStart("headline_audit");
    setIsEvaluating(true);

    setTimeout(() => {
      const len = text.length;
      const hasSeparators = /[|•\-–—/]/.test(text);
      const hasMetrics = /\d+|%|\$|₹|£|scale|growth|revenue|roi|lead|direct/i.test(text);
      const hasSeniorityOrDomain = /(senior|lead|head|specialist|manager|analyst|engineer|architect|associate|director|vp|consultant)/i.test(text);
      const hasSkills = /(aws|cloud|python|sql|react|b2b|saas|fintech|valuation|m&a|dcf|modeling|excel|strategy|agile|seo|product)/i.test(text);
      const isTooShort = len < 35;
      const isGeneric = /(seeking|looking for opportunities|open to work|unemployed|passionate about)/i.test(text);

      let score = 45;
      const deductions = [];
      const strengths = [];
      const suggestions = [];

      if (hasSeniorityOrDomain) {
        score += 15;
        strengths.push("Clear role positioning identified");
      } else {
        deductions.push("Lacks explicit seniority or role specialization");
        suggestions.push("Specify your primary functional title and level");
      }

      if (hasSkills) {
        score += 20;
        strengths.push("High-index technical/domain keywords detected");
      } else {
        deductions.push("Missing searchable domain skill keywords");
        suggestions.push("Incorporate 2-3 hard skills recruiters filter by");
      }

      if (hasSeparators) {
        score += 10;
        strengths.push("Scannable, multi-pillar structure");
      } else {
        suggestions.push("Use clear separators (| or •) to structure role, domain, and proof");
      }

      if (hasMetrics) {
        score += 10;
        strengths.push("Quantified impact / outcome signals present");
      } else {
        suggestions.push("Include a tangible business impact or scale metric");
      }

      if (isGeneric) {
        score = Math.max(score - 20, 30);
        deductions.push("Contains passive phrases ('Open to work' / 'Seeking') that weaken authority");
        suggestions.push("Replace passive job-seeker text with active specialization and value proof");
      }

      if (isTooShort) {
        score = Math.max(score - 15, 25);
        deductions.push("Headline is too brief (< 35 chars) for top search discoverability");
      }

      const finalScore = Math.min(Math.max(score, 25), 96);

      // Generate structured suggestion
      const words = text.split(/\s+/);
      const primaryRole = hasSeniorityOrDomain ? words.slice(0, 3).join(" ") : "Senior Specialist";
      const optimizedDraft = `${primaryRole} | Domain Expertise | Measurable Business Impact`;

      const auditResult = {
        score: finalScore,
        headline: text,
        strengths,
        deductions,
        suggestions,
        optimizedDraft,
      };

      setResult(auditResult);
      setIsEvaluating(false);
      analytics.scoreFlowComplete(finalScore, "headline_audit");
    }, 400);
  };

  return (
    <div id="free-score-tool" className="w-full text-left scroll-mt-24">
      <Card padding="md" className="border-border shadow-sm bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
              <Sparkles size={14} />
            </span>
            <h3 className="text-sm font-bold text-ink">
              Instant LinkedIn Headline &amp; Search Audit
            </h3>
          </div>
          <SampleBadge label="Free Live Tool" />
        </div>

        <p className="mt-3 text-xs sm:text-sm text-muted">
          Paste your current LinkedIn headline to evaluate your recruiter search discoverability:
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            evaluateHeadline();
          }}
          className="mt-3.5 flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Investment Banking Analyst at Morgan Stanley | Valuation & Financial Modeling"
            aria-label="Your current LinkedIn headline"
            className="flex-1 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isEvaluating || !headline.trim()}
            className="gap-2 shrink-0 text-xs sm:text-sm"
          >
            {isEvaluating ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Evaluating...
              </>
            ) : (
              <>
                <span>Check Score</span>
                <ArrowRight size={14} />
              </>
            )}
          </Button>
        </form>

        {/* Presets */}
        {!result && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
            <span className="font-semibold">Try sample:</span>
            {PRESET_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setHeadline(sample);
                  evaluateHeadline(sample);
                }}
                className="rounded border border-border/80 bg-bg px-2 py-0.5 text-ink hover:border-accent hover:text-accent transition-colors truncate max-w-[220px]"
              >
                {sample}
              </button>
            ))}
          </div>
        )}

        {/* Results view */}
        {result && (
          <div className="mt-5 pt-4 border-t border-border animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="shrink-0 flex flex-col items-center">
                <ScoreRing
                  score={result.score}
                  max={100}
                  size={92}
                  strokeWidth={7}
                  label="Headline Score"
                />
                <span className="mt-1.5 text-[11px] font-bold text-muted">
                  {result.score >= 80 ? "Strong Discoverability" : result.score >= 60 ? "Moderate Reach" : "Low Search Index"}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 text-xs">
                {result.strengths.length > 0 && (
                  <div>
                    <p className="font-bold text-success text-[11px] uppercase tracking-wider">
                      Strengths Detected
                    </p>
                    <ul className="mt-1 space-y-1">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-ink">
                          <CheckCircle2 size={13} className="text-success shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.suggestions.length > 0 && (
                  <div>
                    <p className="font-bold text-muted text-[11px] uppercase tracking-wider">
                      Recommended Enhancements
                    </p>
                    <ul className="mt-1 space-y-1">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-muted">
                          <span className="text-accent font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Transition to full rewrite CTA */}
            <div className="mt-4 rounded-lg bg-accent-soft p-3 sm:p-4 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-ink">
                  Want your entire LinkedIn profile and matching ATS resume optimized?
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  Full 3-in-1 suite: Headline, 3-part About section, quantified experience, and ATS-friendly PDF.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                href="#pricing"
                onClick={() => analytics.ctaClick("free_score_to_pricing", "free_score_tool")}
                className="shrink-0 gap-1 text-xs"
              >
                <span>Upgrade Profile</span>
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
