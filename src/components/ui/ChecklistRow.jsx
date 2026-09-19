import { Check } from "lucide-react";

export default function ChecklistRow({
  label,
  sublabel,
  checked = true,
  className = "",
}) {
  return (
    <div className={`flex items-start gap-3 py-1.5 ${className}`}>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-xs ${
          checked ? "bg-success" : "bg-muted"
        }`}
        aria-hidden="true"
      >
        <Check size={12} strokeWidth={3} />
      </span>
      <div className="text-left">
        <p className="text-xs font-semibold text-ink leading-tight">{label}</p>
        {sublabel && <p className="text-[11px] text-muted mt-0.5 leading-tight">{sublabel}</p>}
      </div>
    </div>
  );
}
