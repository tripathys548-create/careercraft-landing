import { Mail, Headphones, Shield } from "lucide-react";
import Logo from "./Logo";

const COMPANY_EMAIL = "Support.websitecreation@gmail.com";

export default function Footer({ onOpenSupport, onOpenAdmin }) {
  return (
    <footer className="border-t-2 border-ink bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo showTagline />

          {/* Company Contact Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenSupport}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-[2px_2px_0_#111111] hover:bg-white"
            >
              <Headphones size={13} /> Contact Support
            </button>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-[2px_2px_0_#111111] hover:bg-brand"
            >
              <Mail size={13} /> {COMPANY_EMAIL}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 sm:flex-row text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} CareerCraft (WebElvate). All rights reserved.</p>

          <nav>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <li>
                <a href="#demo" className="hover:text-ink">See Demo</a>
              </li>
              <li>
                <a href="#features" className="hover:text-ink">Features</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-ink">Pricing</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-ink">FAQ</a>
              </li>
              <li>
                <a href="/terms.html" className="hover:text-ink">Terms</a>
              </li>
              <li>
                <a href="/privacy.html" className="hover:text-ink">Privacy</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-ink font-semibold flex items-center gap-1"
                >
                  <Shield size={11} /> Admin
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
