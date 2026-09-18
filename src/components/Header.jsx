import { useState } from "react";
import { Menu, X, Headphones, Shield } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "See Demo", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "Optimize", href: "#optimize" },
];

export default function Header({ onOpenSupport, onOpenAdmin }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={onOpenSupport}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink px-2 py-1.5 rounded transition-colors"
          >
            <Headphones size={15} />
            Help &amp; Support
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink px-2 py-1.5 rounded transition-colors"
            title="Admin Login for Support.websitecreation@gmail.com"
          >
            <Shield size={14} />
            Admin
          </button>

          <a
            href="#pricing"
            className="rounded-lg border-2 border-ink bg-brand px-4 py-2 text-xs sm:text-sm font-bold text-ink shadow-[3px_3px_0_#111111] transition-transform hover:-translate-y-0.5"
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink sm:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t-2 border-ink px-5 py-4 sm:hidden bg-surface">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-bold text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex flex-col gap-2 pt-2 border-t border-ink/10">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenSupport();
                }}
                className="flex items-center gap-2 text-xs font-bold text-ink py-1.5"
              >
                <Headphones size={15} /> Help &amp; Support
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 text-xs font-bold text-ink py-1.5"
              >
                <Shield size={15} /> Admin Portal
              </button>
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg border-2 border-ink bg-brand px-4 py-2 text-center text-xs font-bold text-ink shadow-[3px_3px_0_#111111]"
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
