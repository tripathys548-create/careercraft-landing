export default function Logo({ className = "", showTagline = false }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-7 w-7 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#logo-grad)" />
        <path
          d="M60 32 A20 20 0 1 0 60 68"
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M46 54 L74 26 M74 26 L58 26 M74 26 L74 42"
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold tracking-tight text-ink">
            Career<span className="text-accent-purple">Craft</span>
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            by WebElvate
          </span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-ink-muted">
            Better Profile. Bigger Opportunities.
          </span>
        )}
      </span>
    </span>
  );
}
