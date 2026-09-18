import { useState, useEffect } from "react";
import {
  ArrowRight,
  Loader2,
  FileText,
  ClipboardPaste,
  Download,
  TrendingUp,
  Sparkles,
  Upload,
  CheckCircle2,
  Target,
  FileCheck,
} from "lucide-react";
import { extractPdfText } from "../lib/pdfText";

function LinkedinIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://careercraft-backend.careercraft-backend.workers.dev";

const TEMPLATES = [
  { id: "modern", label: "Modern Executive", description: "Royal Sapphire & Teal ribbons, rounded skill badges." },
  { id: "classic", label: "Classic Corporate", description: "Navy & Slate, structured executive borders." },
  { id: "compact", label: "High-Density Compact", description: "Space-optimized single-page layout for experienced leaders." },
];

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
  const [template, setTemplate] = useState("modern");
  const [licenseKey, setLicenseKey] = useState("");
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [targetRole, setTargetRole] = useState("");

  // Existing Resume Inputs (Upload or Paste)
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "paste"
  const [resumeText, setResumeText] = useState("");
  const [resumePdfName, setResumePdfName] = useState("");
  const [parsingResumePdf, setParsingResumePdf] = useState(false);

  // LinkedIn Profile Inputs (URL, Paste sections or raw text)
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinMode, setLinkedinMode] = useState("quick"); // "quick" | "detailed"
  const [linkedinRawText, setLinkedinRawText] = useState("");
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Automatically read license key if saved in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("careercraft_license_key");
    if (saved && !licenseKey) {
      setLicenseKey(saved);
    }
  }, []);

  const handleResumePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumePdfName(file.name);
    setParsingResumePdf(true);
    setError(null);
    try {
      const text = await extractPdfText(file);
      setResumeText(text);
    } catch (err) {
      setError("Couldn't parse that resume PDF. You can switch to 'Paste Resume' instead.");
    } finally {
      setParsingResumePdf(false);
    }
  };

  const hasAnyInput =
    resumeText.trim().length > 0 ||
    linkedinRawText.trim().length > 0 ||
    headline.trim().length > 0 ||
    about.trim().length > 0 ||
    experience.trim().length > 0;

  const canSubmit = licenseKey.trim().length > 0 && hasAnyInput;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        key: licenseKey.trim(),
        name: name.trim() || undefined,
        education: education.trim() || undefined,
        targetRole: targetRole.trim() || undefined,
        template,
        linkedinUrl: linkedinUrl.trim() || undefined,
        resumeText: resumeText.trim() || undefined,
      };

      if (linkedinMode === "quick" && linkedinRawText.trim()) {
        payload.rawText = linkedinRawText.trim();
      } else if (linkedinMode === "detailed") {
        if (headline.trim()) payload.headline = headline.trim();
        if (about.trim()) payload.about = about.trim();
        if (experience.trim()) payload.experience = experience.trim();
        if (skills.trim()) payload.skills = skills.trim();
      }

      const resp = await fetch(`${BACKEND_URL}/analyze-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        const messages = {
          missing_key: "Please enter your license key. Check your email for your key.",
          invalid_key: "That license key doesn't match any purchase. Check your email or reach out to support.",
          inactive_key: "This key has been deactivated. Please contact support.",
          mismatched_account: "This key is bound to a different LinkedIn account.",
          rate_limited: "Too many requests — please wait a minute and try again.",
          missing_profile_content: "Please provide either your existing resume or LinkedIn details.",
          generation_failed: "The AI optimizer couldn't process your input. Please try again.",
        };
        throw new Error(messages[data.error] ?? (data.message || "Something went wrong. Please try again."));
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
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#111111]">
            <Sparkles size={14} /> Dual-Source AI Synthesis
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            Recreate from Your Resume &amp; LinkedIn
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-muted">
            Provide your existing Resume and LinkedIn profile. CareerCraft harmonizes your quantified achievements, metrics, and branding into a powerful LinkedIn rewrite and a colorful, ATS-compliant executive resume PDF.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-2xl rounded-2xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[8px_8px_0_#111111]">
            {/* Step 1: License Key & Identity */}
            <div className="border-b-2 border-ink/10 pb-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wide text-ink">
                  License Key *
                </label>
                <a href="#pricing" className="text-[11px] font-bold text-brand-hover underline">
                  Need a key? Get one here
                </a>
              </div>
              <input
                type="text"
                required
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="LKX-XXXXXXXX-..."
                className="mt-1.5 w-full rounded-lg border-2 border-ink bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:font-sans placeholder:text-ink-muted focus:outline-none"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sameer Tripathy"
                    className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Target Role / Objective
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. VP Regulatory Reporting"
                    className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Existing Resume Input */}
            <div className="mt-6 border-b-2 border-ink/10 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-brand-hover" />
                  <span className="text-xs font-bold uppercase tracking-wide text-ink">
                    1. Your Existing Resume
                  </span>
                </div>
                <div className="flex rounded-md border border-ink/30 bg-surface p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setResumeMode("upload")}
                    className={`rounded px-2.5 py-1 font-bold ${
                      resumeMode === "upload" ? "bg-brand text-ink" : "text-ink-muted"
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode("paste")}
                    className={`rounded px-2.5 py-1 font-bold ${
                      resumeMode === "paste" ? "bg-brand text-ink" : "text-ink-muted"
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {resumeMode === "upload" ? (
                <div className="mt-3">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/30 bg-surface p-6 text-center transition-colors hover:border-ink hover:bg-cream">
                    {parsingResumePdf ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-ink">
                        <Loader2 size={18} className="animate-spin" />
                        Extracting resume text from PDF...
                      </div>
                    ) : resumePdfName ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-green-800">
                        <FileCheck size={18} className="text-green-700" />
                        Attached: {resumePdfName}
                        <span className="text-[11px] font-normal text-ink-muted">
                          ({resumeText.length} characters parsed)
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-ink-muted mb-1" />
                        <span className="text-xs font-bold text-ink">
                          Click to upload your current Resume PDF
                        </span>
                        <span className="mt-1 text-[11px] text-ink-muted">
                          ATS text extracted locally in your browser
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-3">
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the text of your existing resume here (experience, summary, skills, metrics)..."
                    className="w-full rounded-lg border-2 border-ink bg-white p-3 text-xs text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Step 3: LinkedIn Profile Input */}
            <div className="mt-6 border-b-2 border-ink/10 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkedinIcon size={16} className="text-blue-700" />
                  <span className="text-xs font-bold uppercase tracking-wide text-ink">
                    2. Your LinkedIn Profile
                  </span>
                </div>
                <div className="flex rounded-md border border-ink/30 bg-surface p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setLinkedinMode("quick")}
                    className={`rounded px-2.5 py-1 font-bold ${
                      linkedinMode === "quick" ? "bg-brand text-ink" : "text-ink-muted"
                    }`}
                  >
                    Quick Paste / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkedinMode("detailed")}
                    className={`rounded px-2.5 py-1 font-bold ${
                      linkedinMode === "detailed" ? "bg-brand text-ink" : "text-ink-muted"
                    }`}
                  >
                    Section by Section
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                  LinkedIn Profile URL (optional)
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-xs text-ink focus:outline-none"
                />
              </div>

              {linkedinMode === "quick" ? (
                <div className="mt-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                    LinkedIn Summary / Export Text
                  </label>
                  <textarea
                    rows={3}
                    value={linkedinRawText}
                    onChange={(e) => setLinkedinRawText(e.target.value)}
                    placeholder="Paste your LinkedIn About section or full profile text here..."
                    className="mt-1 w-full rounded-lg border-2 border-ink bg-white p-3 text-xs text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                      Current Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Regulatory Reporting Specialist at NatWest"
                      className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-1.5 text-xs text-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                      About Section
                    </label>
                    <textarea
                      rows={2}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Your current About text..."
                      className="mt-1 w-full rounded-lg border-2 border-ink bg-white p-2.5 text-xs text-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                      Experience Highlights (one per line)
                    </label>
                    <textarea
                      rows={2}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Key roles and responsibilities..."
                      className="mt-1 w-full rounded-lg border-2 border-ink bg-white p-2.5 text-xs text-ink focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Resume Template Selection */}
            <div className="mt-6">
              <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Executive Resume Design Palette
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={`rounded-xl border-2 border-ink p-3 text-left transition-all ${
                      template === t.id
                        ? "bg-brand text-ink shadow-[3px_3px_0_#111111]"
                        : "bg-surface text-ink-muted hover:text-ink"
                    }`}
                  >
                    <p className="font-bold text-xs">{t.label}</p>
                    <p className="mt-1 text-[11px] leading-tight text-ink/70">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#111111] transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Synthesizing Resume &amp; LinkedIn Profile...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Recreate Profile &amp; Generate Executive Resume PDF
                </>
              )}
            </button>
          </form>
        ) : (
          /* Results View */
          <div className="reveal-in mt-10">
            {/* Score Comparison */}
            <div className="flex items-center justify-center gap-8 rounded-2xl border-2 border-ink bg-white p-8 shadow-[8px_8px_0_#111111]">
              <ScoreBadge label="Original Score" score={result.beforeScore} />
              <TrendingUp size={28} className="text-brand-hover" />
              <ScoreBadge label="CareerCraft Score" score={result.afterScore} />
            </div>
            <p className="mt-3 text-center text-sm font-bold text-brand-hover">
              +{Math.max(0, result.afterScore - result.beforeScore)} points achieved with AI synthesis &amp; ATS alignment
            </p>

            {/* Action Bar: Download PDF */}
            {result.resumePdfBase64 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between rounded-xl border-2 border-ink bg-brand p-5 shadow-[4px_4px_0_#111111]">
                <div>
                  <h4 className="font-display text-base font-bold text-ink">
                    Executive Resume PDF Ready!
                  </h4>
                  <p className="text-xs text-ink/80">
                    Styled with the {template} palette, multi-tonal section banners, and skill badges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadPdf(result.resumePdfBase64, `careercraft-${template}-resume.pdf`)}
                  className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_#111111] hover:-translate-y-0.5"
                >
                  <Download size={15} />
                  Download Resume PDF
                </button>
              </div>
            )}

            {/* Strategic Recommendations */}
            {result.improvements?.length > 0 && (
              <div className="mt-6 rounded-xl border-2 border-ink bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Executive Optimization Highlights
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-ink">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-hover" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side by Side Rewrite */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-ink bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Original Input</p>
                <p className="mt-3 text-xs font-semibold text-ink">{headline || "Provided via resume/raw export"}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted whitespace-pre-wrap">{about || resumeText.slice(0, 300) || "—"}</p>
              </div>
              <div className="rounded-xl border-2 border-ink bg-brand-soft p-5 shadow-[4px_4px_0_#111111]">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-hover">AI Synthesized Rewrite</p>
                <p className="mt-3 text-xs font-semibold text-ink">{result.rewrite?.headline}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink whitespace-pre-wrap">{result.rewrite?.about}</p>
              </div>
            </div>

            {/* Rewritten Experience Bullets */}
            {result.rewrite?.experience?.length > 0 && (
              <div className="mt-6 rounded-xl border-2 border-ink bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Quantified Experience Achievements
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.rewrite.experience.map((line, i) => (
                    <li key={i} className="text-xs sm:text-sm text-ink flex items-start gap-2">
                      <span className="text-brand-hover font-bold">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rewritten Skills Badges */}
            {result.rewrite?.skills?.length > 0 && (
              <div className="mt-6 rounded-xl border-2 border-ink bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  Targeted Competency Badges
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.rewrite.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-brand-hover/40 bg-brand/20 px-3 py-1 text-xs font-bold text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reset / Next Action */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-xs font-bold text-ink-muted underline hover:text-ink"
              >
                ← Optimize Another Resume or Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
