import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";

const PLAN_FEATURES = [
  "Full LinkedIn profile optimization",
  "Headline, About, experience and skills rewrites",
  "Profile score and section-by-section fixes",
  "Job description matching and keyword recommendations",
  "1 ATS-friendly resume, generated from your optimized profile",
  "Tied to your account — use it whenever you update your profile",
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://careercraft.webelvate.com/api";

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Call backend to create Razorpay order
      const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay checkout with order ID
      if (!window.Razorpay) {
        throw new Error("Razorpay not loaded");
      }

      const rzp = new window.Razorpay({
        key_id: orderData.key_id,
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CareerCraft",
        description: "LinkedIn Profile Optimization",
        handler: (response) => {
          // Payment successful
          console.log("Payment successful", response);
          // Optionally: validate payment on backend
          window.location.href = "/success";
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to open checkout");
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-md px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          One plan. One-time fee.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-ink-muted">
          No subscription. Sign in, pay once, optimize your LinkedIn.
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

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Opening Checkout..." : "Sign In & Pay ₹199"}
            {!isLoading && <ArrowRight size={16} />}
          </button>

          {error && (
            <p className="mt-3 text-center text-xs text-red-600">
              {error}
            </p>
          )}

          <p className="mt-4 text-center text-xs text-ink-muted">
            CareerCraft reads your LinkedIn profile via a browser
            extension, which may violate LinkedIn's User Agreement and
            can result in restriction of your LinkedIn account — a real
            risk, not a formality. Purchase only if you accept this risk.
            See our{" "}
            <a href="/terms.html" className="underline hover:text-ink">
              Terms
            </a>{" "}
            &amp;{" "}
            <a href="/privacy.html" className="underline hover:text-ink">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
