import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import { Check, X, Minus, Sparkles } from "lucide-react";

export default function Comparison({ marketConfig }) {
  const { comparison, docTermCap } = marketConfig;
  if (!comparison) return null;

  const rows = [
    {
      feature: "Full LinkedIn Profile Optimization",
      careercraft: "yes",
      traditional: "partial", // Some do it, but expensive add-on
      genericAi: "partial",   // Generic prompt, not specialized
      desc: "Rewrites headline, 3-part About section, experience bullets, and skills architecture.",
    },
    {
      feature: "Job-Specific Keyword & Skill Alignment",
      careercraft: "yes",
      traditional: "partial",
      genericAi: "partial",
      desc: "Maps target job requirements directly into your profile and document narrative.",
    },
    {
      feature: `ATS-Friendly ${docTermCap} Generation`,
      careercraft: "yes",
      traditional: "yes",
      genericAi: "no", // Generic chat tools output raw unformatted text
      desc: "Outputs a clean, single-column, standard-font PDF that parses reliably in ATS software.",
    },
    {
      feature: "Objective Profile & Headline Scoring",
      careercraft: "yes",
      traditional: "no",
      genericAi: "no",
      desc: "Evaluates keyword discoverability, role clarity, and measurable impact indicators.",
    },
    {
      feature: `LinkedIn & ${docTermCap} Alignment`,
      careercraft: "yes",
      traditional: "partial",
      genericAi: "no",
      desc: "Guarantees both assets reinforce the exact same professional positioning.",
    },
    {
      feature: "One-Time Payment (No Monthly Subscription)",
      careercraft: "yes",
      traditional: "varies",
      genericAi: "no", // Most are $20-$30/month recurring subs
      desc: "Single flat charge with no recurring billing or automatic card renewals.",
    },
  ];

  const renderIcon = (status) => {
    if (status === "yes") {
      return (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success font-bold" aria-label="Included">
          <Check size={13} strokeWidth={3} />
        </span>
      );
    }
    if (status === "no") {
      return (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-border text-muted font-bold" aria-label="Not included">
          <X size={13} strokeWidth={2.5} />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-bg px-2 py-0.5 rounded border border-border">
        Varies
      </span>
    );
  };

  return (
    <Section id="comparison" background="surface" className="scroll-mt-16 border-b border-border">
      <Container size="default">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-xs font-bold text-muted">
            <Sparkles size={13} className="text-accent" />
            <span>Category Comparison</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            {comparison.headline}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {comparison.subhead}
          </p>
        </div>

        {/* Desktop Semantic Table */}
        <div className="mt-12 hidden md:block overflow-hidden rounded-xl border border-border bg-surface shadow-2xs">
          <table className="w-full text-left border-collapse" aria-label="Comparison Table">
            <thead>
              <tr className="border-b border-border bg-bg/70 text-xs font-bold text-ink uppercase tracking-wider">
                <th scope="col" className="p-4 sm:px-6 sm:py-4 w-2/5">
                  Capability &amp; Deliverable
                </th>
                <th scope="col" className="p-4 sm:px-6 sm:py-4 w-1/5 text-center bg-accent/5 text-accent border-x border-border/80">
                  CareerCraft
                </th>
                <th scope="col" className="p-4 sm:px-6 sm:py-4 w-1/5 text-center text-muted">
                  Traditional {comparison.traditionalLabel}
                </th>
                <th scope="col" className="p-4 sm:px-6 sm:py-4 w-1/5 text-center text-muted">
                  Generic AI Writing Tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 text-xs">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-bg/40 transition-colors">
                  <th scope="row" className="p-4 sm:px-6 sm:py-4 font-normal text-ink">
                    <p className="font-bold text-xs sm:text-sm text-ink">{r.feature}</p>
                    <p className="text-muted text-[11px] mt-0.5 leading-snug">{r.desc}</p>
                  </th>
                  <td className="p-4 sm:px-6 sm:py-4 text-center bg-accent/5 font-bold border-x border-border/80">
                    <div className="flex justify-center">{renderIcon(r.careercraft)}</div>
                  </td>
                  <td className="p-4 sm:px-6 sm:py-4 text-center text-muted">
                    <div className="flex justify-center">{renderIcon(r.traditional)}</div>
                  </td>
                  <td className="p-4 sm:px-6 sm:py-4 text-center text-muted">
                    <div className="flex justify-center">{renderIcon(r.genericAi)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="mt-8 md:hidden space-y-4">
          {rows.map((r, idx) => (
            <Card key={idx} padding="md" className="border-border bg-surface text-left space-y-3 shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-ink">{r.feature}</h3>
                <p className="text-xs text-muted mt-0.5">{r.desc}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/70 text-center">
                <div className="rounded-lg bg-accent/5 p-2 border border-accent/20">
                  <p className="text-[10px] font-bold text-accent uppercase">CareerCraft</p>
                  <div className="mt-1 flex justify-center">{renderIcon(r.careercraft)}</div>
                </div>
                <div className="rounded-lg bg-bg p-2 border border-border">
                  <p className="text-[10px] font-bold text-muted uppercase">Traditional</p>
                  <div className="mt-1 flex justify-center">{renderIcon(r.traditional)}</div>
                </div>
                <div className="rounded-lg bg-bg p-2 border border-border">
                  <p className="text-[10px] font-bold text-muted uppercase">Generic AI</p>
                  <div className="mt-1 flex justify-center">{renderIcon(r.genericAi)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mandatory Comparison Footnote */}
        <p className="mt-6 text-center text-[11px] text-muted">
          * Categories represent general service classes, not specific brand products. Features and pricing models vary by provider.
        </p>
      </Container>
    </Section>
  );
}
