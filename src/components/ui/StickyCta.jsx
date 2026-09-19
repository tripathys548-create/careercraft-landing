import { useState, useEffect } from "react";
import Button from "./Button";
import { ArrowRight } from "lucide-react";
import { analytics } from "../../lib/analytics";

export default function StickyCta({
  targetId = "pricing",
  text = "Get My Free Score",
  onAction,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroElem = document.getElementById("hero-cta");
    const finalElem = document.getElementById("final-cta");

    if (!heroElem) return;

    let heroVisible = true;
    let finalVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "hero-cta") {
            heroVisible = entry.isIntersecting;
          }
          if (entry.target.id === "final-cta") {
            finalVisible = entry.isIntersecting;
          }
        });

        // Show when hero CTA has scrolled out of view and final CTA is not yet in view
        setVisible(!heroVisible && !finalVisible);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroElem);
    if (finalElem) observer.observe(finalElem);

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden bg-surface/95 backdrop-blur border-t border-border shadow-lg transition-transform duration-200 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
      role="region"
      aria-label="Sticky actions"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-left">
          <p className="text-xs font-bold text-ink leading-tight">CareerCraft AI</p>
          <p className="text-[11px] text-muted leading-tight">Instant profile audit</p>
        </div>
        <Button
          variant="primary"
          size="md"
          href={`#${targetId}`}
          onClick={() => {
            analytics.ctaClick("sticky_mobile_cta", "sticky_bar");
            if (onAction) onAction();
          }}
          className="w-auto gap-1.5 shadow-sm"
        >
          <span>{text}</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
