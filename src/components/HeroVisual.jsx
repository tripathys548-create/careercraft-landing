import { Link2, Gauge, Target, ListChecks, UserCheck } from "lucide-react";

function FloatingBadge({ icon: Icon, label, className, delay = "0s", rotate = "0deg" }) {
  return (
    <div
      className={`animate-float absolute flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2 shadow-[3px_3px_0_#111111] ${className}`}
      style={{ animationDelay: delay, "--tw-rotate": rotate, transform: `rotate(${rotate})` }}
    >
      <Icon size={16} className="text-brand-hover" />
      <span className="text-xs font-bold text-ink whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative mx-auto mt-16 h-[340px] w-full max-w-md sm:h-[380px]">
      {/* Central profile card */}
      <div className="absolute left-1/2 top-1/2 w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[8px_8px_0_#111111] sm:w-[270px]">
        <div className="h-12 border-b-2 border-ink bg-brand-soft" />
        <div className="px-5 pb-5">
          <div className="-mt-6 h-12 w-12 rounded-full border-2 border-ink bg-surface" />
          <div className="mt-3 space-y-2">
            <div className="h-2.5 w-2/5 rounded bg-ink/80" />
            <div className="rounded border-2 border-brand bg-brand-soft px-2 py-1.5">
              <div className="h-1.5 w-full rounded bg-brand/60" />
              <div className="mt-1 h-1.5 w-3/5 rounded bg-brand/60" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-1/4 rounded bg-ink/50" />
            <div className="h-1.5 w-full rounded bg-surface" />
            <div className="h-1.5 w-full rounded bg-surface" />
            <div className="h-1.5 w-3/4 rounded bg-surface" />
          </div>
          <div className="mt-4 flex gap-1.5">
            <div className="h-4 w-12 rounded-full border border-ink bg-cream" />
            <div className="h-4 w-14 rounded-full border border-ink bg-cream" />
            <div className="h-4 w-10 rounded-full border border-ink bg-cream" />
          </div>
        </div>
      </div>

      <FloatingBadge icon={Link2} label="Headline rewritten" className="left-0 top-6" delay="0s" rotate="-4deg" />
      <FloatingBadge icon={Gauge} label="Profile score: 92" className="right-0 top-2 sm:top-0" delay="0.6s" rotate="3deg" />
      <FloatingBadge icon={Target} label="Keywords added" className="left-0 bottom-16" delay="1.1s" rotate="2deg" />
      <FloatingBadge icon={ListChecks} label="Skills reordered" className="right-0 bottom-24 sm:bottom-28" delay="1.6s" rotate="-3deg" />
      <FloatingBadge icon={UserCheck} label="About section rewritten" className="left-0 right-0 bottom-0 mx-auto w-fit" delay="2s" rotate="0deg" />
    </div>
  );
}
