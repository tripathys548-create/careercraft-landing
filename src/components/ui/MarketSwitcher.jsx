import { Globe } from "lucide-react";
import { analytics } from "../../lib/analytics";

const REGIONS = [
  { id: "in", label: "India (₹)", path: "/in" },
  { id: "uk", label: "UK / EU (£)", path: "/uk" },
  { id: "us", label: "US / Global ($)", path: "/" },
];

export default function MarketSwitcher({ currentMarket, onSwitch }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-muted">
      <Globe size={13} className="text-muted shrink-0" />
      <div className="flex items-center gap-1">
        {REGIONS.map((reg) => (
          <button
            key={reg.id}
            type="button"
            onClick={() => {
              analytics.ctaClick(`switch_market_${reg.id}`, "market_switcher");
              if (onSwitch) onSwitch(reg.id, reg.path);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              currentMarket === reg.id
                ? "bg-accent/10 text-accent font-bold"
                : "text-muted hover:text-ink hover:bg-bg"
            }`}
          >
            {reg.label}
          </button>
        ))}
      </div>
    </div>
  );
}
