import { useState } from "react";
import { Check, ArrowRight, Loader2, CheckCircle2, QrCode, CreditCard, ShieldCheck } from "lucide-react";

const PLAN_FEATURES = [
  "Full LinkedIn profile optimization",
  "Headline, About, experience and skills rewrites",
  "Profile score and section-by-section fixes",
  "Job description matching and keyword recommendations",
  "1 ATS-friendly resume, generated from your optimized profile",
  "Tied to your account — use it whenever you update your profile",
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://careercraft-backend.careercraft-backend.workers.dev";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Tdb1rjpNchUkcj";

export default function Pricing() {
  const [paymentMode, setPaymentMode] = useState("online"); // 'online' | 'qr'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Call Backend to Create Razorpay Order
      const resp = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 19900, currency: "INR" }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.message || "Unable to initiate order. Please try again.");
      }

      const order = await resp.json();
      const orderId = order.order_id || order.id;

      if (!orderId) {
        throw new Error("Invalid order received from server.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded. Please refresh the page.");
      }

      // 2. Open Razorpay Standard Checkout Modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount || 19900,
        currency: order.currency || "INR",
        name: "CareerCraft",
        description: "CareerCraft Full Access — One-time (₹199)",
        order_id: orderId,
        handler: async function (response) {
          setLoading(true);
          try {
            // 3. Call Backend to Verify Payment Signature
            const verifyResp = await fetch(`${BACKEND_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResp.json().catch(() => ({}));
            if (!verifyResp.ok || !verifyData.ok) {
              throw new Error(verifyData.message || "Payment signature verification failed.");
            }

            if (verifyData.license_key) {
              setLicenseKey(verifyData.license_key);
            }
            setPaidSuccess(true);
          } catch (verifyErr) {
            setError(verifyErr.message || "Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
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

        <div className="mt-10 flex flex-col rounded-2xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[8px_8px_0_#111111]">
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
                Payment Successful &amp; Verified!
              </div>
              {licenseKey ? (
                <div className="mt-3 rounded border border-green-300 bg-white p-2.5 text-xs font-mono font-bold text-ink">
                  License Key: {licenseKey}
                </div>
              ) : (
                <p className="mt-2 text-xs text-green-700">
                  Your payment was verified. Your license key is being delivered to your email.
                </p>
              )}
              <a
                href="#optimize"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_#111111]"
              >
                Enter your key &amp; analyze your profile
                <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="mt-8">
              {/* Payment Mode Segmented Selector */}
              <div className="flex rounded-lg border-2 border-ink bg-surface p-1 shadow-[2px_2px_0_#111111]">
                <button
                  type="button"
                  onClick={() => setPaymentMode("online")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition-all ${
                    paymentMode === "online"
                      ? "bg-brand text-ink shadow-[2px_2px_0_#111111]"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <CreditCard size={14} />
                  Razorpay Checkout
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("qr")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition-all ${
                    paymentMode === "qr"
                      ? "bg-brand text-ink shadow-[2px_2px_0_#111111]"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <QrCode size={14} />
                  Scan UPI QR
                </button>
              </div>

              {error && (
                <p className="mt-4 rounded border border-red-300 bg-red-50 p-2 text-center text-xs font-medium text-red-700">
                  {error}
                </p>
              )}

              {paymentMode === "online" ? (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Opening Razorpay...
                      </>
                    ) : (
                      <>
                        Pay ₹199 via Razorpay
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-ink-muted">
                    <ShieldCheck size={14} className="text-green-600" />
                    Cards, UPI Apps, NetBanking &amp; Wallets supported
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex flex-col items-center rounded-xl border-2 border-ink bg-surface-alt p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink">
                    Instant UPI QR Code (₹199)
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                  </p>

                  <div className="mt-3 overflow-hidden rounded-lg border-2 border-ink bg-white p-1.5 shadow-[4px_4px_0_#111111] max-w-[220px]">
                    <img
                      src="/razorpay-upi-qr.jpg"
                      alt="Razorpay UPI QR Code - Webelvate CareerCraft"
                      className="h-auto w-full rounded object-cover"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-1 rounded bg-brand/30 px-2 py-1 text-[11px] font-bold text-ink">
                    <span>Account: Webelvate CareerCraft</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="mt-5 text-center text-xs text-ink-muted">
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

