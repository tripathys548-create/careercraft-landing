import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "See Demo", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href="#" className="text-sm font-medium text-ink-muted hover:text-ink">
            Sign In
          </a>
          <a
            href="#pricing"
            className="rounded-lg border-2 border-ink bg-brand px-4 py-2 text-sm font-bold text-ink shadow-[3px_3px_0_#111111] transition-transform hover:-translate-y-0.5"
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t-2 border-ink px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-ink-muted"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex flex-col gap-3 pt-2">
              <a href="#" className="text-sm font-medium text-ink-muted">
                Sign In
              </a>
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="rounded-lg border-2 border-ink bg-brand px-4 py-2 text-center text-sm font-bold text-ink shadow-[3px_3px_0_#111111]"
              >
                Get Started
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
