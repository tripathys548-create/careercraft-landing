import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import { Gauge, Sparkles, FileText, Target, ListChecks, Link2 } from "lucide-react";

export default function Features({ marketConfig }) {
  const { features } = marketConfig;
  const icons = [Gauge, Link2, Sparkles, ListChecks, Target, FileText];

  return (
    <Section id="features" background="surface" className="scroll-mt-16 border-b border-border">
      <Container size="default">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Precision Feature Set
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            Everything Your Profile &amp; Resume Need to Convert
          </h2>
          <p className="mt-2 text-sm text-muted">
            Engineered around how recruiter search algorithms index profiles and how ATS systems parse resumes.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = icons[idx] || Sparkles;
            return (
              <Card key={idx} padding="md" className="border-border bg-bg/50 hover:bg-surface transition-all shadow-2xs hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                  {feat.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
