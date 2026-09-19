export function CareerCraftMark({ className = "h-9 w-9" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cc-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B7CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#cc-brand-gradient)" />
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
  );
}

export default function Logo({ showTagline = false, className = "" }) {
  return (
    <a
      href="/"
      className={`inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md ${className}`}
      aria-label="CareerCraft Home"
    >
      <CareerCraftMark className="h-9 w-9 shadow-2xs rounded-lg" />
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
