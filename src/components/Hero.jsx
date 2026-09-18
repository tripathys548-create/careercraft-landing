import { ArrowRight, PlayCircle, Check } from "lucide-react";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:pt-24">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        AI LinkedIn optimization
      </p>

      <h1 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
        Make recruiters stop at your LinkedIn
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-base text-ink-muted sm:text-lg">
        Rewrite your headline, About section, experience and skills so your
        profile turns up in recruiter searches — and build a matching
        ATS-friendly resume from the same profile.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#111111]"
        >
          Optimize My LinkedIn
          <ArrowRight size={16} />
        </a>
        <a
          href="#demo"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-cream px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
        >
          <PlayCircle size={16} />
          See an Example
        </a>
      </div>

      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-ink-muted">
        <li className="flex items-center gap-1.5">
          <Check size={14} className="text-accent-green" /> Recruiter-search ready
        </li>
        <li className="flex items-center gap-1.5">
          <Check size={14} className="text-accent-green" /> ATS-friendly resume
        </li>
        <li className="flex items-center gap-1.5">
          <Check size={14} className="text-accent-green" /> Cancel anytime
        </li>
      </ul>

      <p className="mx-auto mt-6 max-w-md text-sm text-ink-muted">
        Built for job seekers whose profiles are doing less work than they
        should.
      </p>

      <HeroVisual />
    </section>
  );
}
