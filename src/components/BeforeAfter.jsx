import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import { ArrowRight, ArrowDown, AlertCircle, Sparkles } from "lucide-react";

export default function BeforeAfter({ marketConfig }) {
  const { beforeAfter } = marketConfig;
  const { before, after, metrics } = beforeAfter;

  return (
    <Section id="demo" background="default" className="scroll-mt-16 border-b border-border/80">
      <Container size="default">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-muted">
            <Sparkles size={13} className="text-accent" />
            <span>{beforeAfter.badge}</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            {beforeAfter.headline}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {beforeAfter.subhead}
          </p>
        </div>

        {/* Metrics Summary Bar */}
        <div className="mt-8 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-6 bg-surface p-4 rounded-xl border border-border text-center shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Profile Score:</span>
            <span className="text-sm font-extrabold text-warn tabular-nums">{metrics.scoreBefore}</span>
            <span className="text-xs text-muted">→</span>
            <span className="text-sm font-extrabold text-success tabular-nums">{metrics.scoreAfter}/100</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Keyword Match:</span>
            <span className="text-sm font-extrabold text-warn tabular-nums">{metrics.matchBefore}%</span>
            <span className="text-xs text-muted">→</span>
            <span className="text-sm font-extrabold text-success tabular-nums">{metrics.matchAfter}%</span>
          </div>
        </div>

        {/* Before / After Comparison Cards */}
        <div className="mt-8 grid lg:grid-cols-12 gap-6 items-center">
          
          {/* Before Card */}
          <div className="lg:col-span-5">
            <Card padding="md" className="border-border bg-surface/70 relative">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="rounded-md bg-warn/10 px-2.5 py-0.5 text-xs font-extrabold text-warn uppercase tracking-wider">
                  Before Optimization
                </span>
                <span className="text-xs font-bold text-warn tabular-nums">{metrics.scoreBefore}/100</span>
              </div>

              <div className="mt-4 space-y-3 text-left">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Headline</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-ink line-through decoration-warn/50">
                    {before.headline}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">About Summary</p>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {before.summary}
                  </p>
                </div>

                <div className="rounded-lg bg-bg p-3 border border-border/80">
                  <p className="text-[11px] font-bold text-muted uppercase">Experience Bullet</p>
                  <p className="mt-1 text-xs text-muted italic">"{before.bullet}"</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Center Connector Indicator */}
          <div className="lg:col-span-2 flex justify-center text-accent">
            <div className="hidden lg:flex flex-col items-center gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Synthesized</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                <ArrowRight size={18} />
              </div>
            </div>
            <div className="lg:hidden flex items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                <ArrowDown size={16} />
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className="lg:col-span-5">
            <Card padding="md" className="border-accent/30 bg-surface shadow-md relative ring-1 ring-accent/15">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="rounded-md bg-success/10 px-2.5 py-0.5 text-xs font-extrabold text-success uppercase tracking-wider">
                  After CareerCraft
                </span>
                <span className="text-xs font-extrabold text-success tabular-nums">{metrics.scoreAfter}/100</span>
              </div>

              <div className="mt-4 space-y-3 text-left">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Optimized Headline</p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-ink leading-snug">
                    {after.headline}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent">3-Part Quantified About</p>
                  <p className="mt-1 text-xs text-ink leading-relaxed font-medium">
                    {after.summary}
                  </p>
                </div>

                <div className="rounded-lg bg-accent-soft p-3 border border-accent/25">
                  <p className="text-[11px] font-bold text-accent uppercase">Action-Driven Bullet</p>
                  <p className="mt-1 text-xs text-ink font-medium leading-relaxed">
                    • {after.bullet}
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* Required Mandatory Label */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted inline-flex items-center gap-1.5 bg-bg px-3 py-1 rounded-full border border-border/80">
            <AlertCircle size={13} className="text-muted shrink-0" />
            <span>{beforeAfter.disclaimer}</span>
          </p>
        </div>
      </Container>
    </Section>
  );
}
