import Logo from "./Logo";

const LINKS = [
  { label: "Resume Builder", href: "#pricing" },
  { label: "LinkedIn Optimization", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "/privacy.html" },
  { label: "Terms", href: "/terms.html" },
  { label: "Contact", href: "mailto:support@webelvate.com" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between">
        <Logo showTagline />
        <nav>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
