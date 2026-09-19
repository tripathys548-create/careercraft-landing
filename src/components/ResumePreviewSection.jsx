import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import Button from "./ui/Button";
import SampleBadge from "./ui/SampleBadge";
import { FileText, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { analytics } from "../lib/analytics";

export default function ResumePreviewSection({ marketConfig }) {
  const { resumeSection } = marketConfig;
  const { preview, callouts } = resumeSection;

  return (
    <Section id="resume-section" background="default" className="scroll-mt-16 border-b border-border/80">
      <Container size="default">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Explanations & Callouts */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-muted">
              <FileText size={13} className="text-accent" />
              <span>Matching ATS Resume</span>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink leading-tight">
              {resumeSection.headline}
            </h2>

            <p className="mt-3 text-sm text-muted leading-relaxed">
              {resumeSection.subhead}
            </p>

            <div className="mt-6 space-y-3">
              {callouts.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-ink">{c.title}</p>
                    <p className="text-[11px] text-muted leading-snug">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                variant="primary"
                size="md"
                href="#pricing"
                onClick={() => analytics.ctaClick("resume_section_cta", "resume_section")}
                className="gap-2 text-xs sm:text-sm"
              >
                <span>{resumeSection.cta}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Right: Realistic ATS Resume Document Preview */}
          <div className="lg:col-span-7">
            <Card padding="md" className="border-border shadow-lg bg-surface relative font-sans text-left">
              {/* Top Banner */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  ATS-Friendly Executive Resume (PDF Output)
                </span>
                <SampleBadge label="Sample output" />
              </div>

              {/* Resume Body */}
              <div className="mt-4 bg-white p-6 sm:p-8 rounded-lg border border-border/80 shadow-2xs space-y-4">
                {/* Header */}
                <div className="border-b border-ink/20 pb-3">
                  <h3 className="text-lg font-black tracking-tight text-ink uppercase font-sans">
                    {preview.name}
                  </h3>
                  <p className="text-xs font-semibold text-accent mt-0.5">
                    {preview.title}
                  </p>
                </div>

                {/* Professional Summary */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Professional Summary
                  </h4>
                  <p className="mt-1 text-xs text-ink leading-relaxed">
                    {preview.summary}
                  </p>
                </div>

                {/* Core Skills Badges */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Core Competencies &amp; Skills
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {preview.skills.map((s, i) => (
                      <span key={i} className="rounded bg-bg px-2 py-0.5 text-[11px] font-semibold text-ink border border-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Professional Experience
                  </h4>
                  <ul className="mt-1.5 space-y-2 text-xs text-ink leading-relaxed">
                    {preview.experience.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-accent font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Education */}
                <div className="pt-2 border-t border-border/60">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Education &amp; Credentials
                  </h4>
                  <p className="mt-1 text-xs font-medium text-ink">
                    {preview.education}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-center text-[11px] text-muted">
                Single-column standard hierarchy • No parsing traps • High-resolution vector PDF export
              </p>
            </Card>
          </div>

        </div>
      </Container>
    </Section>
  );
}
