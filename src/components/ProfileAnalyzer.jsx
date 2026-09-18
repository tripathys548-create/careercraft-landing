import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  FileText,
  ClipboardPaste,
  Download,
  TrendingUp,
} from "lucide-react";
import { extractPdfText } from "../lib/pdfText";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://careercraft-backend.careercraft-backend.workers.dev";

const EMPTY_FORM = {
  licenseKey: "",
  linkedinUrl: "",
  name: "",
  headline: "",
  about: "",
  experience: "",
  education: "",
  skills: "",
};

function scoreColor(score) {
  if (score >= 75) return "text-brand-hover";
  if (score >= 50) return "text-accent-yellow";
  return "text-accent-pink";
}

function ScoreBadge({ label, score }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className={`font-display text-5xl font-bold ${scoreColor(score)}`}>
        {score}
      </p>
      <p className="text-xs text-ink-muted">out of 100</p>
    </div>
  );
}

function downloadPdf(base64, filename) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export default function ProfileAnalyzer() {
  const [mode, setMode] = useState("paste"); // "paste" | "upload"
  const [form, setForm] = useState(EMPTY_FORM);
  const [rawText, setRawText] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [parsingPdf, setParsingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);
    setParsingPdf(true);
    setError(null);
    try {
      const text = await extractPdfText(file);
      setRawText(text);
    } catch (err) {
      setError("Couldn't read that PDF. Try a different export, or use 'Paste my details' instead.");
    } finally {
      setParsingPdf(false);
    }
  };

  const canSubmit =
    form.licenseKey.trim().length > 0 &&
    (mode === "paste"
      ? form.headline.trim() || form.about.trim() || form.experience.trim()
      : rawText.trim().length > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        key: form.licenseKey.trim(),
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        name: form.name.trim() || undefined,
        education: form.education.trim() || undefined,
      };

      if (mode === "paste") {
        payload.headline = form.headline.trim();
        payload.about = form.about.trim();
        payload.experience = form.experience.trim();
        payload.skills = form.skills.trim();
      } else {
        payload.rawText = rawText;
      }

      const resp = await fetch(`${BACKEND_URL}/analyze-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        const messages = {
          invalid_key: "That license key doesn't match any purchase. Check the email you received.",
          inactive_key: "This key has been deactivated. Contact support.",
          mismatched_account: "This key is already bound to a different LinkedIn profile.",
          rate_limited: "Too many requests — please wait a minute and try again.",
          missing_profile_content: "Please fill in at least your headline, About section, or experience.",
          generation_failed: "The AI couldn't process that profile. Please try again.",
        };
        throw new Error(messages[data.error] ?? "Something went wrong. Please try again.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="optimize" className="border-t-2 border-ink bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-display text-center text-2xl font-bold text-ink sm:text-3xl">
          Get your profile scored and rewritten
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-ink-muted">
          Already paid? Enter your license key and your profile details below —
          no extension required.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
            <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
              License key
            </label>
            <input
              type="text"
              value={form.licenseKey}
              onChange={setField("licenseKey")}
              placeholder="Sent to your email after purchase"
              className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />

            <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              Your LinkedIn profile URL (optional — ties your key to your profile)
            </label>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={setField("linkedinUrl")}
              placeholder="linkedin.com/in/your-name"
              className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("paste")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
                  mode === "paste" ? "bg-brand text-ink" : "bg-white text-ink-muted"
                }`}
              >
                <ClipboardPaste size={16} />
                Paste my details
              </button>
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
                  mode === "upload" ? "bg-brand text-ink" : "bg-white text-ink-muted"
                }`}
              >
                <FileText size={16} />
                Upload PDF export
              </button>
            </div>

            {mode === "paste" ? (
              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={setField("headline")}
                    placeholder="e.g. Software Engineer at TCS"
                    className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    About section
                  </label>
                  <textarea
                    value={form.about}
                    onChange={setField("about")}
                    rows={4}
                    placeholder="Paste your current About section"
                    className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Experience (one bullet per line)
                  </label>
                  <textarea
                    value={form.experience}
                    onChange={setField("experience")}
                    rows={4}
                    placeholder={"Senior Developer @ Company A\nBuilt X, led Y"}
                    className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.skills}
                    onChange={setField("skills")}
                    placeholder="JavaScript, React, Node.js, AWS"
                    className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                  LinkedIn PDF export
                </label>
                <p className="mt-1 text-xs text-ink-muted">
                  On your LinkedIn profile: click "More" → "Save to PDF". Upload that file here —
                  it's read in your browser, not sent anywhere until you submit.
                </p>
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink bg-white px-4 py-6 text-sm font-medium text-ink-muted hover:bg-surface">
                  <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                  {parsingPdf ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Reading PDF…
                    </>
                  ) : pdfFileName ? (
                    <>
                      <FileText size={16} /> {pdfFileName} — extracted {rawText.length.toLocaleString()} characters
                    </>
                  ) : (
                    <>
                      <FileText size={16} /> Click to choose a PDF
                    </>
                  )}
                </label>
                {rawText && (
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={6}
                    className="mt-3 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-xs text-ink focus:outline-none"
                  />
                )}
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Name (for your resume)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Education (optional)
                </label>
                <input
                  type="text"
                  value={form.education}
                  onChange={setField("education")}
                  placeholder="B.Tech CS, IIT ..."
                  className="mt-1.5 w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm text-ink focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded border border-red-300 bg-red-50 p-2 text-center text-xs font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  Analyze My Profile <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {result && (
          <div className="reveal-in mt-10">
            <div className="flex items-center justify-center gap-8 rounded-2xl border-2 border-ink bg-white p-8 shadow-[8px_8px_0_#111111]">
              <ScoreBadge label="Before" score={result.beforeScore} />
              <TrendingUp size={28} className="text-brand-hover" />
              <ScoreBadge label="After" score={result.afterScore} />
            </div>
            <p className="mt-3 text-center text-sm font-bold text-brand-hover">
              +{Math.max(0, result.afterScore - result.beforeScore)} points with CareerCraft's rewrite
            </p>

            {result.improvements?.length > 0 && (
              <div className="mt-8 rounded-xl border-2 border-ink bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Top improvements
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink">
                      <span className="mt-0.5 text-brand-hover">•</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-ink bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Before</p>
                <p className="mt-3 text-sm font-semibold text-ink">{form.headline || "—"}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{form.about || "—"}</p>
              </div>
              <div className="rounded-xl border-2 border-ink bg-brand-soft p-5 shadow-[4px_4px_0_#111111]">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-hover">After</p>
                <p className="mt-3 text-sm font-semibold text-ink">{result.rewrite?.headline}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{result.rewrite?.about}</p>
              </div>
            </div>

            {result.rewrite?.experience?.length > 0 && (
              <div className="mt-6 rounded-xl border-2 border-ink bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Rewritten experience
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.rewrite.experience.map((line, i) => (
                    <li key={i} className="text-sm text-ink">• {line}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-3">
              {result.resumePdfBase64 && (
                <button
                  type="button"
                  onClick={() => downloadPdf(result.resumePdfBase64, "careercraft-resume.pdf")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-0.5"
                >
                  <Download size={16} />
                  Download Resume PDF
                </button>
              )}
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-xs font-medium text-ink-muted underline hover:text-ink"
              >
                Analyze another profile
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
