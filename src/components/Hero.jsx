import Container from "./ui/Container";
import Button from "./ui/Button";
import Card from "./ui/Card";
import ScoreRing from "./ui/ScoreRing";
import Chip from "./ui/Chip";
import ChecklistRow from "./ui/ChecklistRow";
import SampleBadge from "./ui/SampleBadge";
import FreeScoreEvaluator from "./FreeScoreEvaluator";
import { ArrowRight, Check, PlayCircle, Sparkles, Target } from "lucide-react";
import { analytics } from "../lib/analytics";

export default function Hero({ marketConfig }) {
  const { hero, mock } = marketConfig;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-border/80">
      <Container size="large">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1 text-xs font-bold text-accent">
              <Sparkles size={13} className="shrink-0" />
              <span>{hero.eyebrow}</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-[1.15]">
              {hero.h1}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              {hero.subcopy}
            </p>

            <div id="hero-cta" className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Button
                variant="primary"
                size="lg"
                href="#free-score-tool"
                onClick={() => analytics.ctaClick("hero_free_score", "hero")}
                className="w-full sm:w-auto gap-2 text-sm sm:text-base"
              >
                <span>{hero.ctaPrimary}</span>
                <ArrowRight size={16} />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                href="#how-it-works"
                onClick={() => analytics.ctaClick("hero_see_how_it_works", "hero")}
                className="w-full sm:w-auto gap-2 text-sm sm:text-base"
              >
                <PlayCircle size={17} />
                <span>{hero.ctaSecondary}</span>
              </Button>
            </div>

            {/* Trust line */}
            <p className="mt-4 text-xs font-medium text-muted">
              {hero.trustLine}
            </p>

            {/* Interactive Headline Evaluator */}
            <div className="mt-8 max-w-xl mx-auto lg:mx-0">
              <FreeScoreEvaluator marketConfig={marketConfig} />
            </div>
          </div>

          {/* Right Column: Purpose-Built Real Product UI Mock (HTML/CSS) */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
            <div className="relative">
              {/* Product Mock Frame */}
              <Card padding="md" className="border-border shadow-md bg-surface">
                {/* Header Strip */}
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <span className="text-xs font-bold text-ink">CareerCraft Profile Intelligence</span>
                  </div>
                  <SampleBadge label="Sample output" />
                </div>

                {/* Score & Checklist Block */}
                <div className="mt-4 grid sm:grid-cols-12 gap-4 items-center bg-bg/70 p-4 rounded-xl border border-border/80">
                  <div className="sm:col-span-5 flex flex-col items-center justify-center text-center py-2">
                    <ScoreRing
                      score={mock.optimizedScore}
                      max={100}
                      size={100}
                      strokeWidth={8}
                      label="LinkedIn Optimization Score"
                    />
                    <p className="mt-2 text-xs font-bold text-ink">Optimized Profile Score</p>
                    <p className="text-[11px] text-success font-semibold tabular-nums">
                      +{mock.optimizedScore - mock.initialScore} pts vs unoptimized
                    </p>
                  </div>

                  <div className="sm:col-span-7 space-y-1">
                    <ChecklistRow label="Headline" sublabel="Recruiter search keyword density" checked />
                    <ChecklistRow label="About Narrative" sublabel="3-part hook & quantified value" checked />
                    <ChecklistRow label="Experience Bullets" sublabel="Action verbs & business metrics" checked />
                    <ChecklistRow label="Skills Architecture" sublabel="Top indexed competency chips" checked />
                    <ChecklistRow label="ATS Compatibility" sublabel="Standard parseable document hierarchy" checked />
                  </div>
                </div>

                {/* Job Match Strip */}
                <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Target size={15} className="text-accent" />
                      <span className="text-xs font-bold text-ink">Target Role Alignment</span>
                    </div>
                    <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs font-extrabold text-success tabular-nums">
                      Job Match {mock.jobMatch.matchPercentage}%
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-muted">
                    {mock.jobMatch.role}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mock.jobMatch.matchedKeywords.map((kw, i) => (
                      <Chip key={i} label={kw} status="matched" />
                    ))}
                    {mock.jobMatch.missingKeywords.map((kw, i) => (
                      <Chip key={i} label={kw} status="missing" />
                    ))}
                  </div>
                </div>

                {/* Pipeline Strip */}
                <div className="mt-4 rounded-lg bg-bg px-3.5 py-2.5 border border-border/80 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-ink">
                  <span className="flex items-center gap-1.5 text-success">
                    <Check size={14} strokeWidth={3} /> ATS Resume
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5 text-success">
                    <Check size={14} strokeWidth={3} /> LinkedIn Profile
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5 text-success">
                    <Check size={14} strokeWidth={3} /> Job Match Alignment
                  </span>
                </div>
              </Card>

              {/* Decorative background aura */}
              <div
                className="absolute -top-6 -right-6 -bottom-6 -left-6 -z-10 rounded-3xl bg-accent/5 blur-xl pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
