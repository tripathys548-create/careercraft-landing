import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import { ShieldCheck, CheckCircle2, Lock, Sparkles } from "lucide-react";

export default function Trust({ marketConfig }) {
  const { trust } = marketConfig;
  const icons = [CheckCircle2, Sparkles, Lock, ShieldCheck];

  return (
    <Section id="trust" background="surface" className="scroll-mt-16 border-b border-border">
      <Container size="default">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success">
            <ShieldCheck size={14} />
            <span>Integrity &amp; Standards</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            {trust.headline}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {trust.subhead}
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trust.points.map((p, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            return (
              <Card key={idx} padding="md" className="border-border bg-bg/50 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-ink">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">
                  {p.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
