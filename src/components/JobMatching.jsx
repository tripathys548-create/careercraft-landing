import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Chip from "./ui/Chip";
import SampleBadge from "./ui/SampleBadge";
import { Target, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { analytics } from "../lib/analytics";

export default function JobMatching({ marketConfig }) {
  const { jobMatching } = marketConfig;

  return (
    <Section id="job-matching" background="default" className="scroll-mt-16 border-b border-border/80">
      <Container size="default">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
              <Target size={14} />
              <span>Core Intelligence</span>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink leading-tight">
              {jobMatching.headline}
            </h2>

            <p className="mt-3 text-sm text-muted leading-relaxed">
              {jobMatching.subhead}
            </p>

            <ul className="mt-5 space-y-2 text-xs sm:text-sm text-ink font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span>Extracts high-impact domain competencies from job descriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span>Identifies missing keywords before you submit applications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span>Harmonizes your LinkedIn profile and resume to target roles</span>
              </li>
            </ul>

            <div className="mt-7">
              <Button
                variant="primary"
                size="md"
                href="#pricing"
                onClick={() => analytics.ctaClick("job_matching_cta", "job_matching")}
                className="gap-2 text-xs sm:text-sm"
              >
                <span>{jobMatching.cta}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Right Product Mock */}
          <div className="lg:col-span-7">
            <Card padding="md" className="border-border shadow-md bg-surface">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <span className="text-xs font-bold text-ink">Role Alignment &amp; Keyword Coverage</span>
                </div>
                <SampleBadge label="Sample output" />
              </div>

              {/* Match Header */}
              <div className="mt-4 rounded-xl bg-bg p-4 border border-border flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Target Opportunity</p>
                  <p className="text-xs sm:text-sm font-bold text-ink mt-0.5">{jobMatching.roleTitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-extrabold text-success tabular-nums">
                    {jobMatching.matchScore}%
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Job Match</p>
                </div>
              </div>

              {/* Keywords Matrix */}
              <div className="mt-5 space-y-4 text-left">
                <div>
                  <p className="text-xs font-bold text-success flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Strong Skills Detected in Profile
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {jobMatching.matched.map((kw, i) => (
                      <Chip key={i} label={kw} status="matched" />
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-bold text-warn flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Critical Keywords Missing from Profile
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {jobMatching.missing.map((kw, i) => (
                      <Chip key={i} label={kw} status="missing" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>Algorithm: Contextual Keyword &amp; Semantic Alignment</span>
                <span className="text-accent font-semibold">1-Click Optimization Available</span>
              </div>
            </Card>
          </div>

        </div>
      </Container>
    </Section>
  );
}
