import { ArrowRight } from "lucide-react";

export default function ConversionCTA() {
  return (
    <section className="border-t-2 border-ink bg-ink">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Your profile is already being read. Make it count.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
          Recruiters are searching LinkedIn for people like you right now.
          Whether they find you depends on your headline, your keywords and
          how your experience is written. All three take about ten minutes
          to fix.
        </p>
        <a
          href="#pricing"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-0.5"
        >
          Optimize My LinkedIn
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
