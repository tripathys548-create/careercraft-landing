import { useState } from "react";
import Section from "./ui/Section";
import Container from "./ui/Container";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { Check, ShieldCheck, ArrowRight, Loader2, CreditCard, QrCode, Mail, User, Phone, Sparkles } from "lucide-react";
import { analytics } from "../lib/analytics";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://careercraft-backend.careercraft-backend.workers.dev";
const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Tdb1rjpNchUkcj";

export default function Pricing({ marketConfig }) {
  const { pricing } = marketConfig;
  const [step, setStep] = useState(1); // 1: Candidate info, 2: Checkout options
  const [paymentMode, setPaymentMode] = useState("online"); // 'online' | 'qr'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [licenseKey, setLicenseKey] = useState(null);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    analytics.checkoutStart(pricing.planName, pricing.currency, pricing.price);
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
        throw new Error(data.message || "Could not register details. Please verify your email.");
      }

      if (data.existingKeys && data.existingKeys.length > 0) {
        const active = data.existingKeys.find((k) => k.status === "active") || data.existingKeys[0];
        setLicenseKey(active.key);
        localStorage.setItem("careercraft_license_key", active.key);
      }

      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to register details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 19900, // ₹199.00 in paise
          currency: "INR",
          email: userForm.email.trim(),
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.message || "Unable to initiate payment order.");
      }

      const order = await resp.json();
      const orderId = order.order_id || order.id;

      if (!orderId) {
        throw new Error("Invalid order received from payment server.");
      }

      if (!window.Razorpay) {
        throw new Error("Payment gateway is loading. Please refresh and try again.");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount || 19900,
        currency: order.currency || "INR",
        name: "CareerCraft by WebElvate",
        description: "Full LinkedIn Optimization & ATS Resume Suite",
        order_id: orderId,
        prefill: {
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          contact: userForm.mobile.trim(),
        },
        theme: {
          color: "#2F5BFF",
        },
        handler: async (response) => {
          setLoading(true);
          try {
            const verifyResp = await fetch(`${BACKEND_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: userForm.email.trim(),
                name: userForm.name.trim(),
                mobile: userForm.mobile.trim() || undefined,
              }),
            });

            const verifyData = await verifyResp.json().catch(() => ({}));
            if (verifyData.ok && verifyData.key) {
              setLicenseKey(verifyData.key);
              localStorage.setItem("careercraft_license_key", verifyData.key);
              setPaidSuccess(true);
            } else {
              setPaidSuccess(true);
            }
          } catch {
            setPaidSuccess(true);
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="pricing" background="default" className="scroll-mt-16">
      <Container size="default">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1 text-xs font-bold text-success">
            <ShieldCheck size={14} />
            <span>{pricing.badge}</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {pricing.headline}
          </h2>
          <p className="mt-3 text-base text-muted">
            {pricing.subhead}
          </p>
        </div>

        {/* Pricing Card & Checkout */}
        <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Inclusions & Plan details */}
          <div className="md:col-span-6 space-y-6">
            <Card padding="lg" className="border-border shadow-sm">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">{pricing.planName}</h3>
                  <p className="text-xs text-muted mt-0.5">Complete career positioning suite</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-ink tabular-nums">
                    {pricing.displayPrice}
                  </span>
                  <span className="block text-[11px] font-semibold text-muted uppercase">
                    Flat One-Time
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <ul className="mt-5 space-y-3">
                {pricing.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success text-white mt-0.5" aria-hidden="true">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted">
                <ShieldCheck size={16} className="text-success shrink-0" />
                <span>{pricing.guarantee}</span>
              </div>
            </Card>
          </div>

          {/* Right: Checkout Flow */}
          <div className="md:col-span-6">
            <Card padding="lg" className="border-border shadow-md bg-surface">
              {paidSuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check size={24} strokeWidth={3} />
                  </div>
                  <h3 className="text-lg font-bold text-ink">Access Activated!</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Your license key has been generated and sent to <strong>{userForm.email}</strong>.
                  </p>
                  {licenseKey && (
                    <div className="rounded-lg border border-border bg-bg p-3">
                      <p className="text-[11px] font-bold text-muted uppercase">Your Access Key</p>
                      <code className="mt-1 block font-mono text-sm font-bold text-accent">{licenseKey}</code>
                    </div>
                  )}
                  <Button
                    variant="primary"
                    size="md"
                    href="#optimize"
                    className="w-full justify-center gap-2"
                  >
                    <span>Proceed to Full Optimizer</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              ) : step === 1 ? (
                /* Step 1: Candidate Details */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-ink">1. Enter Delivery Details</h3>
                    <p className="text-xs text-muted mt-0.5">
                      Your access key and receipt will be delivered to your email.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-3 text-muted pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          placeholder="e.g. Sameer Tripathy"
                          className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-3 text-muted pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="your-email@domain.com"
                          className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">
                        Mobile Number <span className="text-muted font-normal text-[11px]">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-3 text-muted pointer-events-none" />
                        <input
                          type="tel"
                          value={userForm.mobile}
                          onChange={(e) => setUserForm({ ...userForm, mobile: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-warn/30 bg-warn/10 p-2.5 text-xs text-warn">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving Details...
                      </>
                    ) : (
                      <>
                        <span>Continue to Payment ({pricing.displayPrice})</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                /* Step 2: Payment Options */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <p className="text-xs font-bold text-ink">{userForm.name}</p>
                      <p className="text-[11px] text-muted">{userForm.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Edit Details
                    </button>
                  </div>

                  {/* Mode selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-bg rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setPaymentMode("online")}
                      className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${
                        paymentMode === "online" ? "bg-surface text-accent shadow-2xs" : "text-muted hover:text-ink"
                      }`}
                    >
                      <CreditCard size={14} />
                      Cards / UPI Gateway
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode("qr")}
                      className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${
                        paymentMode === "qr" ? "bg-surface text-accent shadow-2xs" : "text-muted hover:text-ink"
                      }`}
                    >
                      <QrCode size={14} />
                      Scan UPI QR
                    </button>
                  </div>

                  {paymentMode === "online" ? (
                    <div className="space-y-3 pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Opening Checkout...
                          </>
                        ) : (
                          <>
                            <span>Pay {pricing.displayPrice} &amp; Deliver Key</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </Button>
                      <p className="text-center text-[11px] text-muted flex items-center justify-center gap-1">
                        <ShieldCheck size={13} className="text-success" />
                        Encrypted 256-bit checkout via Razorpay
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pt-2 text-center">
                      <p className="text-xs font-bold text-ink">Instant UPI QR Payment ({pricing.displayPrice})</p>
                      <p className="text-[11px] text-muted mt-0.5">Scan using Google Pay, PhonePe, Paytm or any UPI app</p>
                      <div className="mt-3 overflow-hidden rounded-lg border border-border bg-white p-2 shadow-2xs max-w-[190px]">
                        <img
                          src="/razorpay-upi-qr.jpg"
                          alt="Razorpay UPI QR Code - WebElvate CareerCraft"
                          className="h-auto w-full rounded"
                        />
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-muted bg-bg px-2.5 py-1 rounded">
                        Beneficiary: Webelvate CareerCraft
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-warn/30 bg-warn/10 p-2.5 text-xs text-warn">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

        </div>
      </Container>
    </Section>
  );
}
