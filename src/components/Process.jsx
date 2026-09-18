const STEPS = [
  { number: "01", title: "Import your LinkedIn profile" },
  { number: "02", title: "Get every section rewritten" },
  { number: "03", title: "Match it to the job you want" },
  { number: "04", title: "Export a resume that matches" },
];

export default function Process() {
  return (
    <section id="process" className="border-t-2 border-ink">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          From LinkedIn to offer
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-ink-muted">
          One profile. One resume. Both saying the same thing.
        </p>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-4">
          <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-ink sm:block" aria-hidden="true" />
          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-brand text-sm font-bold text-ink">
                {step.number}
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
