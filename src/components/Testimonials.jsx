const TESTIMONIALS = [
  {
    quote:
      "My LinkedIn profile looks completely different now. The optimization suggestions were actually useful.",
    role: "Finance Professional",
  },
  {
    quote:
      "The headline rewrite alone was worth it. I started showing up in searches I never did before.",
    role: "Software Professional",
  },
  {
    quote:
      "Finally, a tool that fixes the profile itself instead of just formatting a resume.",
    role: "Marketing Professional",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t-2 border-ink">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          What people are saying
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.role}
              className="flex flex-col justify-between rounded-xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_#111111]"
            >
              <span className="font-display text-3xl text-brand-hover" aria-hidden="true">
                “
              </span>
              <blockquote className="mt-1 text-sm leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-xs font-bold text-ink-muted">
                — {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
