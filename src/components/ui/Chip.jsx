export default function Chip({
  label,
  status = "neutral", // 'matched' | 'missing' | 'neutral' | 'warn'
  className = "",
  ariaLabel,
}) {
  const statusStyles = {
    matched: "bg-success/10 text-success border-success/25",
    missing: "bg-warn/10 text-warn border-warn/25",
    warn: "bg-warn/10 text-warn border-warn/25",
    neutral: "bg-bg text-muted border-border",
  };

  const prefixText = {
    matched: "Matched: ",
    missing: "Missing: ",
    warn: "Attention: ",
    neutral: "",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${statusStyles[status]} ${className}`}
      aria-label={ariaLabel || `${prefixText[status]}${label}`}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
