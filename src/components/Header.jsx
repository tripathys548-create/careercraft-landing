import { useState } from "react";
import Logo from "./Logo";
import Button from "./ui/Button";
import MarketSwitcher from "./ui/MarketSwitcher";
import { Menu, X, ArrowRight, Headphones } from "lucide-react";
import { analytics } from "../lib/analytics";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Header({ onOpenSupport, onOpenAdmin, marketConfig, currentMarket, onSwitchMarket }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-6 lg:gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => analytics.ctaClick(`nav_${item.label.toLowerCase().replace(/\s+/g, '_')}`, 'header')}
                className="text-sm font-semibold text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1.5 py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <MarketSwitcher currentMarket={currentMarket} onSwitch={onSwitchMarket} />

          <button
            type="button"
            onClick={() => {
              analytics.ctaClick("support_modal_trigger", "header");
              if (onOpenSupport) onOpenSupport();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink px-2 py-1.5 rounded-lg hover:bg-bg transition-colors"
          >
            <Headphones size={15} />
            Support
          </button>

          <Button
            variant="primary"
            size="sm"
            href="#pricing"
            onClick={() => analytics.ctaClick("header_get_started", "header")}
            className="gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <nav
          className="border-b border-border bg-surface px-4 py-4 md:hidden shadow-lg space-y-3"
          aria-label="Mobile Navigation"
        >
          <div className="pb-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Select Region</span>
            <MarketSwitcher currentMarket={currentMarket} onSwitch={onSwitchMarket} />
          </div>

          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => {
                    analytics.ctaClick(`mobile_nav_${item.label.toLowerCase()}`, 'header');
                    setMobileMenuOpen(false);
                  }}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-bg"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-border mt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSupport) onOpenSupport();
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:text-ink"
              >
                <Headphones size={16} /> Contact Support
              </button>
              <Button
                variant="primary"
                size="md"
                href="#pricing"
                onClick={() => {
                  analytics.ctaClick("mobile_header_get_started", "header");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center gap-2 mt-1"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
