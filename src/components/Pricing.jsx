import { useState } from "react";
import { Check, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const PLAN_FEATURES = [
  "Full LinkedIn profile optimization",
  "Headline, About, experience and skills rewrites",
  "Profile score and section-by-section fixes",
  "Job description matching and keyword recommendations",
  "1 ATS-friendly resume, generated from your optimized profile",
  "Tied to your account — use it whenever you update your profile",
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://careercraft-backend.careercraft-backend.workers.dev";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TdTHN9NSYSvt8H";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
      });

      if (!resp.ok) {
        throw new Error("Unable to initiate order. Please try again.");
      }

      const order = await resp.json();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded. Please refresh the page.");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CareerCraft",
        description: "CareerCraft Full Access — One-time (₹199)",
        order_id: order.id,
        handler: function () {
          setPaidSuccess(true);
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: {
          color: "#FBBF24",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-md px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          One plan. One-time fee.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-ink-muted">
          No subscription. Pay once, optimize your LinkedIn.
        </p>

        <div className="mt-10 flex flex-col rounded-2xl border-2 border-ink bg-white p-8 shadow-[8px_8px_0_#111111]">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
            CareerCraft — Full Access
          </p>
          <div className="mt-3 flex items-end gap-1">
            <span className="font-display text-5xl font-bold tracking-tight text-ink">
              ₹199
            </span>
            <span className="pb-1 text-sm text-ink-muted">one-time</span>
          </div>
          <p className="mt-2 text-sm font-medium text-ink-muted">
            Per LinkedIn account. No recurring charge.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {PLAN_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink">
                <Check size={16} className="mt-0.5 shrink-0 text-brand-hover" />
                {f}
              </li>
            ))}
          </ul>

          {paidSuccess ? (
            <div className="mt-8 rounded-lg border-2 border-green-600 bg-green-50 p-4 text-center text-green-900">
              <div className="flex items-center justify-center gap-2 font-bold text-green-800">
                <CheckCircle2 size={20} />
                Payment Successful!
              </div>
              <p className="mt-2 text-xs text-green-700">
                Your license key is being generated and delivered to your email. Check your inbox and enter it into the CareerCraft Chrome extension to activate.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <p className="mt-4 rounded border border-red-300 bg-red-50 p-2 text-center text-xs font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Opening Checkout...
                  </>
                ) : (
                  <>
                    Get Access &amp; Pay ₹199
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </>
          )}

          <p className="mt-4 text-center text-xs text-ink-muted">
            CareerCraft reads your LinkedIn profile via a browser
            extension, which may violate LinkedIn's User Agreement and
            can result in restriction of your LinkedIn account — a real
            risk, not a formality. Purchase only if you accept this risk.
            See our{" "}
            <a href="#" className="underline hover:text-ink">
              Terms &amp; Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
