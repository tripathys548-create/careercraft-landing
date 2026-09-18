import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="border-t-2 border-ink">
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Your next opportunity starts with a better profile.
        </h2>
        <p className="mt-4 text-base text-ink-muted">
          Rewrite your LinkedIn in an afternoon and get a matching resume
          out of it.
        </p>
        <a
          href="#pricing"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#111111]"
        >
          Optimize My LinkedIn
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
