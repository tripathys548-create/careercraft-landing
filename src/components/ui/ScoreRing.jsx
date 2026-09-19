export default function ScoreRing({
  score = 0,
  max = 100,
  size = 110,
  strokeWidth = 8,
  label = "LinkedIn Score",
  className = "",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score / max, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  // Determine accessible stroke color
  let strokeColor = "#0F8A5F"; // success
  if (score < 50) strokeColor = "#B45309"; // warn
  else if (score < 75) strokeColor = "#2F5BFF"; // accent

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${label}: ${score} out of ${max}`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E4E7EC"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold text-ink tracking-tight font-sans tabular-nums">
          {score}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          / {max}
        </span>
      </div>
    </div>
  );
}
