export default function SampleBadge({ label = "Sample output", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-border bg-bg/90 text-muted ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
      {label}
    </span>
  );
}
