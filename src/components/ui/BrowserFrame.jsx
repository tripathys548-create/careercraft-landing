export default function BrowserFrame({
  title = "careercraft.ai",
  children,
  className = "",
}) {
  return (
    <div className={`rounded-xl border border-border bg-surface shadow-md overflow-hidden ${className}`}>
      {/* Chrome header */}
      <div className="flex items-center gap-2 border-b border-border bg-bg px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto max-w-[200px] truncate rounded bg-surface px-3 py-0.5 text-center text-[11px] font-medium text-muted border border-border/60">
          {title}
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
