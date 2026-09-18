import { useState } from "react";
import { X, Mail, MessageSquare, CheckCircle2, Loader2, Copy, Check, Headphones } from "lucide-react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://careercraft-backend.careercraft-backend.workers.dev";

const COMPANY_SUPPORT_EMAIL = "Support.websitecreation@gmail.com";

export default function SupportModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    key: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(COMPANY_SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.message.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/support-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || undefined,
          email: form.email.trim(),
          key: form.key.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data.ok === false) {
        throw new Error(data.message || "Failed to submit message. Please try again or email us directly.");
      }

      setSuccess(true);
      setForm({ name: "", email: "", key: "", message: "" });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-ink bg-white p-6 shadow-[8px_8px_0_#111111] sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-cream hover:text-ink"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-brand text-ink shadow-[2px_2px_0_#111111]">
            <Headphones size={20} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-ink">Help &amp; Support</h3>
            <p className="text-xs text-ink-muted">We're here to assist you with access, billing, or optimization</p>
          </div>
        </div>

        {/* Company Email Banner */}
        <div className="mt-5 rounded-xl border-2 border-ink/20 bg-surface p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Official Company Support</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <a
              href={`mailto:${COMPANY_SUPPORT_EMAIL}`}
              className="flex items-center gap-2 text-sm font-bold text-brand-hover hover:underline break-all"
            >
              <Mail size={16} className="shrink-0" />
              {COMPANY_SUPPORT_EMAIL}
            </a>
            <button
              onClick={handleCopyEmail}
              type="button"
              className="flex shrink-0 items-center gap-1 rounded-md border border-ink/30 bg-white px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:bg-cream"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-ink-muted">
            Average response time: <strong>Within 2–4 hours</strong>
          </p>
        </div>

        {success ? (
          <div className="mt-6 rounded-xl border-2 border-green-600 bg-green-50 p-5 text-center text-green-950">
            <CheckCircle2 size={32} className="mx-auto text-green-700" />
            <h4 className="mt-2 font-display text-lg font-bold text-green-900">Message Received!</h4>
            <p className="mt-1 text-xs text-green-800">
              Our support team has logged your inquiry and will follow up at your email address shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 rounded-lg border-2 border-green-800 bg-white px-4 py-1.5 text-xs font-bold text-green-900 hover:bg-green-100"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs text-red-800">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sameer"
                  className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                License Key (Optional)
              </label>
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="LKX-XXXXXXXX-..."
                className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink font-mono placeholder:font-sans placeholder:text-ink-muted focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                How can we help you? *
              </label>
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your question, license key issue, or feedback..."
                className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
            </div>

            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_#111111] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare size={14} />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
