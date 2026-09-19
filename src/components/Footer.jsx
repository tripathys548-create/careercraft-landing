import Container from "./ui/Container";
import Logo from "./Logo";
import { Mail, Headphones, ShieldCheck, Shield } from "lucide-react";
import { analytics } from "../lib/analytics";

const COMPANY_EMAIL = "Support.websitecreation@gmail.com";

export default function Footer({ onOpenSupport, onOpenAdmin, marketConfig }) {
  return (
    <footer className="border-t border-border bg-surface py-12 text-xs text-muted">
      <Container size="default">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
          <Logo showTagline />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                analytics.ctaClick("footer_support_modal", "footer");
                if (onOpenSupport) onOpenSupport();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 font-semibold text-ink hover:bg-surface transition-colors"
            >
              <Headphones size={14} /> Help &amp; Support
            </button>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 font-semibold text-ink hover:bg-surface transition-colors"
            >
              <Mail size={14} /> {COMPANY_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareerCraft by WebElvate. All rights reserved.</p>

          <nav aria-label="Footer Links">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li>
                <a
                  href="#how-it-works"
                  onClick={() => analytics.ctaClick("footer_how_it_works", "footer")}
                  className="hover:text-ink transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={() => analytics.ctaClick("footer_pricing", "footer")}
                  className="hover:text-ink transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={() => analytics.ctaClick("footer_faq", "footer")}
                  className="hover:text-ink transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a href="/terms.html" className="hover:text-ink transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy.html" className="hover:text-ink transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-ink font-semibold flex items-center gap-1"
                  title="Admin Access"
                >
                  <Shield size={12} /> Admin
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
