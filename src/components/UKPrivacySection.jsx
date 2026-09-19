import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import { ShieldCheck, Server, Cpu, Trash2, EyeOff } from "lucide-react";

export default function UKPrivacySection({ marketConfig }) {
  const { privacySection } = marketConfig;
  if (!privacySection) return null;

  const icons = [Server, Cpu, Trash2, EyeOff];

  return (
    <Section id="privacy-standards" background="surface" className="scroll-mt-16 border-b border-border">
      <Container size="default">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-xs font-bold text-muted">
            <ShieldCheck size={14} className="text-accent" />
            <span>Candidate Data Governance</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            {privacySection.headline}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {privacySection.subhead}
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {privacySection.facts.map((f, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            return (
              <Card key={idx} padding="md" className="border-border bg-bg/50 text-left flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent mt-0.5">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                    {f.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {f.value}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted">
            Have questions about your data? Read our full{" "}
            <a href="/privacy.html" className="font-semibold underline text-ink hover:text-accent">
              Privacy Policy
            </a>{" "}
            or email{" "}
            <a href="mailto:support@webelvate.com" className="font-semibold underline text-ink hover:text-accent">
              support@webelvate.com
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
