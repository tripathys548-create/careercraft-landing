import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import { ArrowRight, FileText, Target, Sparkles, Download } from "lucide-react";

export default function HowItWorks({ marketConfig }) {
  const { howItWorks } = marketConfig;
  const icons = [FileText, Target, Sparkles, Download];

  return (
    <Section id="how-it-works" background="surface" className="scroll-mt-16">
      <Container size="default">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Simple 4-Step Process
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            {howItWorks.headline}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {howItWorks.subhead}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.steps.map((step, idx) => {
            const Icon = icons[idx] || Sparkles;
            return (
              <div key={step.number} className="relative flex flex-col">
                <Card padding="md" className="h-full flex flex-col justify-between border-border bg-bg/60 hover:bg-surface transition-colors shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white font-extrabold text-xs">
                        {step.number}
                      </span>
                      <Icon size={18} className="text-muted" />
                    </div>

                    <h3 className="mt-4 text-sm sm:text-base font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-accent">
                    <span>Step {step.number}</span>
                    <span className="text-muted">✓</span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
