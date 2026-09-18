import { useState } from "react";
import {
  Check,
  ArrowRight,
  Loader2,
  CheckCircle2,
  QrCode,
  CreditCard,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Copy,
  Check as CheckIcon,
  Sparkles,
} from "lucide-react";

const PLAN_FEATURES = [
  "Full LinkedIn profile optimization & scoring",
  "Headline, About, experience bullets & strategic skills rewrite",
  "Upload existing Resume + combine with LinkedIn profile",
  "Executive, colorful ATS-compliant Resume PDF download",
  "Tied to your account — use whenever you update your credentials",
  "Instant delivery of license key to your registered email ID",
];

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://careercraft-backend.careercraft-backend.workers.dev";
const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Tdb1rjpNchUkcj";

export default function Pricing() {
  const [step, setStep] = useState(1); // 1: Sign up details, 2: Checkout options
  const [paymentMode, setPaymentMode] = useState("online"); // 'online' | 'qr'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Candidate Registration form
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          mobile: userForm.mobile.trim() || undefined,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data.ok === false) {
        throw new Error(data.message || "Could not register details. Please check email and try again.");
      }

      // Check if candidate already has an active license key
      if (data.existingKeys && data.existingKeys.length > 0) {
        const active = data.existingKeys.find((k) => k.status === "active") || data.existingKeys[0];
        setLicenseKey(active.key);
        localStorage.setItem("careercraft_license_key", active.key);
      }

      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Call Backend to Create Razorpay Order
      const resp = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 19900,
          currency: "INR",
          email: userForm.email.trim(),
        }),
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

      // 2. Open Razorpay Standard Checkout Modal with Prefilled Candidate Info
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount || 19900,
        currency: order.currency || "INR",
        name: "CareerCraft",
        description: "CareerCraft Full Access — One-time (₹199)",
        order_id: orderId,
        prefill: {
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          contact: userForm.mobile.trim(),
        },
        handler: async function (response) {
          setLoading(true);
          try {
            // 3. Call Backend to Verify Payment Signature and Deliver Key
            const verifyResp = await fetch(`${BACKEND_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                mobile: userForm.mobile.trim(),
              }),
            });

            const verifyData = await verifyResp.json().catch(() => ({}));
            if (!verifyResp.ok || !verifyData.ok) {
              throw new Error(verifyData.message || "Payment signature verification failed.");
            }

            if (verifyData.license_key) {
              setLicenseKey(verifyData.license_key);
              localStorage.setItem("careercraft_license_key", verifyData.license_key);
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

  const copyLicenseKey = () => {
    if (!licenseKey) return;
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <section id="pricing" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto max-w-lg px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          One plan. One-time fee.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-ink-muted">
          No recurring subscription. Pay once, unlock executive LinkedIn &amp; Resume re-creation.
        </p>

        <div className="mt-10 flex flex-col rounded-2xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[8px_8px_0_#111111]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              CareerCraft — Full Access
            </p>
            <span className="rounded-full bg-brand/30 px-2.5 py-0.5 text-[11px] font-bold text-ink">
              Lifetime Single-User
            </span>
          </div>

          <div className="mt-3 flex items-end gap-1">
            <span className="font-display text-5xl font-bold tracking-tight text-ink">
              ₹199
            </span>
            <span className="pb-1 text-sm text-ink-muted">one-time</span>
          </div>
          <p className="mt-1.5 text-xs font-medium text-ink-muted">
            Includes AI LinkedIn rewrite, Resume synthesis, and executive PDF generator.
          </p>

          <ul className="mt-5 flex flex-col gap-2.5">
            {PLAN_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-ink">
                <Check size={16} className="mt-0.5 shrink-0 text-brand-hover" />
                {f}
              </li>
            ))}
          </ul>

          {paidSuccess ? (
            <div className="mt-8 rounded-xl border-2 border-green-600 bg-green-50 p-5 text-center text-green-950">
              <div className="flex items-center justify-center gap-2 font-bold text-green-800 text-base">
                <CheckCircle2 size={22} />
                Payment Successful &amp; Verified!
              </div>
              <p className="mt-2 text-xs text-green-800">
                Your license key has been delivered to <strong>{userForm.email}</strong>.
              </p>

              {licenseKey && (
                <div className="mt-4 rounded-lg border-2 border-green-400 bg-white p-3 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-green-800">
                    Your Personal License Key
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-ink select-all break-all">
                      {licenseKey}
                    </span>
                    <button
                      onClick={copyLicenseKey}
                      type="button"
                      className="flex shrink-0 items-center gap-1 rounded border border-ink/20 bg-cream px-2 py-1 text-xs font-bold text-ink hover:bg-brand"
                    >
                      {copiedKey ? <CheckIcon size={12} className="text-green-600" /> : <Copy size={12} />}
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              <a
                href="#optimize"
                onClick={() => {
                  if (licenseKey) localStorage.setItem("careercraft_license_key", licenseKey);
                }}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_#111111] transition-transform hover:-translate-y-0.5"
              >
                <Sparkles size={16} />
                Start Profile &amp; Resume Optimization
                <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="mt-7 border-t-2 border-ink/10 pt-6">
              {/* Step indicator */}
              <div className="mb-4 flex items-center justify-between text-xs font-bold text-ink">
                <span className={step === 1 ? "text-brand-hover" : "text-ink-muted"}>
                  1. Candidate Sign Up
                </span>
                <span className="text-ink-muted">→</span>
                <span className={step === 2 ? "text-brand-hover" : "text-ink-muted"}>
                  2. Payment &amp; License Delivery
                </span>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs text-red-800">
                  {error}
                </div>
              )}

              {step === 1 ? (
                /* Step 1: Pre-payment Registration */
                <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                      Full Name *
                    </label>
                    <div className="relative mt-1">
                      <User size={15} className="absolute left-3 top-3 text-ink-muted" />
                      <input
                        type="text"
                        required
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        placeholder="e.g. Sameer Tripathy"
                        className="w-full rounded-lg border-2 border-ink bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                      Email Address * <span className="font-normal lowercase text-[11px]">(key delivered here)</span>
                    </label>
                    <div className="relative mt-1">
                      <Mail size={15} className="absolute left-3 top-3 text-ink-muted" />
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="your-email@domain.com"
                        className="w-full rounded-lg border-2 border-ink bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                      Mobile Number <span className="font-normal lowercase text-[11px]">(for order tracking)</span>
                    </label>
                    <div className="relative mt-1">
                      <Phone size={15} className="absolute left-3 top-3 text-ink-muted" />
                      <input
                        type="tel"
                        value={userForm.mobile}
                        onChange={(e) => setUserForm({ ...userForm, mobile: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-lg border-2 border-ink bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_#111111] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving Candidate Info...
                      </>
                    ) : (
                      <>
                        Continue to Payment (₹199)
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Execution */
                <div>
                  <div className="mb-4 rounded-xl border border-ink/20 bg-surface p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-ink">{userForm.name}</p>
                        <p className="text-ink-muted">{userForm.email} {userForm.mobile ? `• ${userForm.mobile}` : ""}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[11px] font-bold text-brand-hover underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Payment Mode Selector */}
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

                  {paymentMode === "online" ? (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Opening Razorpay...
                          </>
                        ) : (
                          <>
                            Pay ₹199 &amp; Deliver Key
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-ink-muted">
                        <ShieldCheck size={14} className="text-green-600" />
                        Key will be sent to {userForm.email}
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

                      <div className="mt-3 overflow-hidden rounded-lg border-2 border-ink bg-white p-1.5 shadow-[4px_4px_0_#111111] max-w-[200px]">
                        <img
                          src="/razorpay-upi-qr.jpg"
                          alt="Razorpay UPI QR Code - Webelvate CareerCraft"
                          className="h-auto w-full rounded object-cover"
                        />
                      </div>

                      <div className="mt-3 rounded bg-brand/30 px-2 py-1 text-[11px] font-bold text-ink">
                        Account: Webelvate CareerCraft
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="mt-5 text-center text-[11px] text-ink-muted">
            Need help with payment or your key? Contact{" "}
            <a href="mailto:Support.websitecreation@gmail.com" className="font-bold underline text-ink hover:text-brand-hover">
              Support.websitecreation@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
