import { useState, useEffect } from "react";
import Button from "./Button";
import { ShieldCheck } from "lucide-react";

export default function ConsentBanner({ marketId }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only trigger banner on UK / EU routes
    if (marketId !== "uk" && marketId !== "eu") {
      setShow(false);
      return;
    }

    const consent = localStorage.getItem("careercraft_cookie_consent");
    if (consent === null) {
      setShow(true);
    } else if (consent === "declined") {
      window.__CAREERCRAFT_CONSENT__ = false;
    } else {
      window.__CAREERCRAFT_CONSENT__ = true;
    }
  }, [marketId]);

  const handleAccept = () => {
    localStorage.setItem("careercraft_cookie_consent", "accepted");
    window.__CAREERCRAFT_CONSENT__ = true;
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("careercraft_cookie_consent", "declined");
    window.__CAREERCRAFT_CONSENT__ = false;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-surface/98 backdrop-blur border-t border-border shadow-2xl animate-fade-in"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-left">
          <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            We use essential cookies to maintain your session and deliver your resume generation. We do not use third-party tracking or advertising cookies.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDecline}
            className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink rounded-lg border border-border bg-bg"
          >
            Essential Only
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            className="text-xs font-bold"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
