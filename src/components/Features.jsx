import { FileText, Link2, ListChecks, Target, Gauge, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    title: "Headline built for recruiter search",
    description:
      "Your headline is the line recruiters search against. We rewrite it around the skills and roles you actually want, not just your job title.",
  },
  {
    icon: Sparkles,
    title: "An About section people finish reading",
    description:
      "A clear three-part narrative — what you do, what you've shipped, and what you're looking for — instead of a blank box or three generic lines.",
  },
  {
    icon: ListChecks,
    title: "Experience and skills, reordered",
    description:
      "Experience bullets rewritten to lead with an action and a result, and skills reordered so the ones that matter for your target role sit at the top.",
  },
  {
    icon: Gauge,
    title: "Profile score",
    description:
      "See exactly where your profile is weak across headline, About, experience, skills and keyword coverage — then fix it section by section.",
  },
  {
    icon: Target,
    title: "Tailored to the job you want",
    description:
      "Paste a job description and get the keywords and skills that posting expects, mapped onto both your profile and your resume.",
  },
  {
    icon: FileText,
    title: "A matching ATS-friendly resume",
    description:
      "Generate a resume from the same optimized profile, structured to parse cleanly in Applicant Tracking Systems — plus cover letters when you need them.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          Everything your LinkedIn profile is missing
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_#111111] transition-transform duration-150 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-brand-soft text-brand-hover">
                <feature.icon size={20} />
              </div>
              <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
