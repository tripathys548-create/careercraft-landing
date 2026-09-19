export default function ScoreBar({
  label,
  score,
  max = 100,
  className = "",
}) {
  const percentage = Math.min(Math.max((score / max) * 100, 0), 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-ink">{label}</span>
        <span className="text-muted tabular-nums">{score} / {max}</span>
      </div>
      <div
        className="w-full h-2 bg-border/60 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label} progress`}
      >
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
