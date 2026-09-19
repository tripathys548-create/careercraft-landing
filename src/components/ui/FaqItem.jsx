import { ChevronDown } from "lucide-react";

export default function FaqItem({
  question,
  answer,
  onToggle,
  isOpen,
  className = "",
}) {
  return (
    <details
      className={`group rounded-xl border border-border bg-surface transition-colors ${className}`}
      open={isOpen}
      onToggle={(e) => onToggle && onToggle(e.target.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm sm:text-base font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
        <span className="pr-4">{question}</span>
        <span className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180">
          <ChevronDown size={18} />
        </span>
      </summary>
      <div className="border-t border-border/50 px-5 pb-5 pt-3">
        <p className="text-sm leading-relaxed text-muted">{answer}</p>
      </div>
    </details>
  );
}
