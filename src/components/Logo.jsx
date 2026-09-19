export default function Logo({ showTagline = false, className = "" }) {
  return (
    <a
      href="/"
      className={`inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md ${className}`}
      aria-label="CareerCraft Home"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-2xs font-extrabold text-lg">
        CC
      </div>
      <div className="flex flex-col text-left">
        <span className="font-extrabold text-base tracking-tight text-ink leading-tight">
          CareerCraft
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-muted leading-tight">
            AI Profile &amp; ATS Resume Builder
          </span>
        )}
      </div>
    </a>
  );
}
