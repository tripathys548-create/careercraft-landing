import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Users,
  Key,
  Mail,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  MessageSquare,
  Send,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://careercraft-backend.careercraft-backend.workers.dev";

const ADMIN_EMAIL = "Support.websitecreation@gmail.com";

export default function AdminModal({ isOpen, onClose }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("careercraft_admin_token") || "");
  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // "users" | "keys" | "generate" | "messages"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Data states
  const [users, setUsers] = useState([]);
  const [keys, setKeys] = useState([]);
  const [messages, setMessages] = useState([]);

  // Generate Key Form
  const [genForm, setGenForm] = useState({
    name: "",
    email: "",
    mobile: "",
    sendEmail: true,
  });

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Admin-Email": adminEmail,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Test auth by fetching users
      const resp = await fetch(`${BACKEND_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          "X-Admin-Email": adminEmail.trim(),
        },
      });

      if (!resp.ok) {
        throw new Error("Invalid admin credentials. Please check your password.");
      }

      const data = await resp.json();
      setIsAuthenticated(true);
      sessionStorage.setItem("careercraft_admin_token", token.trim());
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/users`, { headers: getHeaders() });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/keys`, { headers: getHeaders() });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || "Failed to fetch keys");
      setKeys(data.keys || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/messages`, { headers: getHeaders() });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || "Failed to fetch messages");
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "users") fetchUsers();
      if (activeTab === "keys") fetchKeys();
      if (activeTab === "messages") fetchMessages();
    }
  }, [activeTab, isAuthenticated]);

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!genForm.email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/generate-key`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(genForm),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || "Failed to issue key");
      setSuccessMsg(`Issued key: ${data.key} to ${data.email}`);
      setGenForm({ name: "", email: "", mobile: "", sendEmail: true });
      fetchKeys();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendKey = async (keyItem) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/resend-key`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ key: keyItem.key, email: keyItem.email }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || "Failed to resend key email");
      setSuccessMsg(`License key successfully emailed to ${keyItem.email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleKey = async (keyItem) => {
    const nextStatus = keyItem.status === "active" ? "revoked" : "active";
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/toggle-key`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ key: keyItem.key, status: nextStatus }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || "Failed to toggle status");
      setKeys((prev) =>
        prev.map((k) => (k.key === keyItem.key ? { ...k, status: nextStatus } : k))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveMessage = async (msgId) => {
    try {
      const resp = await fetch(`${BACKEND_URL}/admin/resolve-message`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id: msgId, status: "resolved" }),
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: "resolved" } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border-2 border-ink bg-white shadow-[8px_8px_0_#111111]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-ink bg-surface px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-brand text-ink shadow-[2px_2px_0_#111111]">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">CareerCraft Admin Control</h3>
              <p className="text-xs text-ink-muted">Authorized: {ADMIN_EMAIL}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-cream hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth Barrier or Main Admin View */}
        {!isAuthenticated ? (
          <div className="p-8">
            <div className="mx-auto max-w-sm rounded-xl border-2 border-ink bg-cream p-6 shadow-[4px_4px_0_#111111]">
              <div className="flex items-center gap-2 text-ink font-bold">
                <Lock size={18} />
                Admin Authentication
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                Enter your administrative password to manage candidates, licenses, and support.
              </p>

              {error && (
                <div className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-xs text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Password / Secret
                  </label>
                  <input
                    type="password"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter admin password"
                    className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand py-2 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_#111111] hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : "Access Dashboard"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b-2 border-ink bg-cream px-6">
              {[
                { id: "users", label: "Registered Users", icon: Users },
                { id: "keys", label: "License Keys", icon: Key },
                { id: "generate", label: "Issue Key", icon: PlusCircle },
                { id: "messages", label: "Support Inbox", icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                      active
                        ? "border-brand-hover bg-white text-ink shadow-[0_2px_0_#111111]"
                        : "border-transparent text-ink-muted hover:text-ink"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Notification messages */}
            {error && (
              <div className="mx-6 mt-3 rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs text-red-800">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mx-6 mt-3 rounded-lg border border-green-300 bg-green-50 p-2.5 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                {successMsg}
              </div>
            )}

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Users Tab */}
              {activeTab === "users" && (
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Total Registered Users: {users.length}
                    </p>
                    <button
                      onClick={fetchUsers}
                      disabled={loading}
                      className="flex items-center gap-1 text-xs font-bold text-ink hover:underline"
                    >
                      <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b-2 border-ink bg-surface text-ink font-bold">
                        <tr>
                          <th className="p-3">Candidate Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Mobile Number</th>
                          <th className="p-3">Keys Owned</th>
                          <th className="p-3">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-ink-muted">
                              No candidates registered yet.
                            </td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr key={u.id} className="hover:bg-cream/40">
                              <td className="p-3 font-bold text-ink">{u.name}</td>
                              <td className="p-3 text-ink-muted">{u.email}</td>
                              <td className="p-3 font-mono">{u.mobile || "—"}</td>
                              <td className="p-3">
                                <span className="rounded-full bg-brand/20 px-2 py-0.5 font-bold text-ink">
                                  {u.key_count || 0}
                                </span>
                              </td>
                              <td className="p-3 text-ink-muted">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* License Keys Tab */}
              {activeTab === "keys" && (
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Active Licenses: {keys.length}
                    </p>
                    <button
                      onClick={fetchKeys}
                      disabled={loading}
                      className="flex items-center gap-1 text-xs font-bold text-ink hover:underline"
                    >
                      <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border-2 border-ink bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b-2 border-ink bg-surface text-ink font-bold">
                        <tr>
                          <th className="p-3">License Key</th>
                          <th className="p-3">Associated Email</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">LinkedIn Binding</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {keys.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-ink-muted">
                              No license keys created yet.
                            </td>
                          </tr>
                        ) : (
                          keys.map((k) => (
                            <tr key={k.key} className="hover:bg-cream/40">
                              <td className="p-3 font-mono font-bold text-ink">{k.key}</td>
                              <td className="p-3 text-ink-muted">{k.email}</td>
                              <td className="p-3">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                    k.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {k.status}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[11px]">
                                {k.linkedin_id || "Unbound (first-use)"}
                              </td>
                              <td className="p-3 flex items-center gap-2">
                                <button
                                  onClick={() => handleResendKey(k)}
                                  title="Resend email with this key"
                                  className="flex items-center gap-1 rounded border border-ink/30 px-2 py-1 text-[11px] font-semibold hover:bg-cream"
                                >
                                  <Send size={11} /> Email Key
                                </button>
                                <button
                                  onClick={() => handleToggleKey(k)}
                                  title="Toggle status"
                                  className={`rounded border px-2 py-1 text-[11px] font-semibold ${
                                    k.status === "active"
                                      ? "border-red-300 text-red-700 hover:bg-red-50"
                                      : "border-green-300 text-green-700 hover:bg-green-50"
                                  }`}
                                >
                                  {k.status === "active" ? "Revoke" : "Activate"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Issue Key Form */}
              {activeTab === "generate" && (
                <div className="max-w-md">
                  <h4 className="font-display text-base font-bold text-ink">Manually Issue a License Key</h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    Generate an instant lifetime key for testing, partner access, or customer resolution.
                  </p>
                  <form onSubmit={handleGenerateKey} className="mt-4 flex flex-col gap-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                        Candidate Full Name
                      </label>
                      <input
                        type="text"
                        value={genForm.name}
                        onChange={(e) => setGenForm({ ...genForm, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                        Recipient Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={genForm.email}
                        onChange={(e) => setGenForm({ ...genForm, email: e.target.value })}
                        placeholder="candidate@example.com"
                        className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={genForm.mobile}
                        onChange={(e) => setGenForm({ ...genForm, mobile: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1 w-full rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm text-ink focus:outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={genForm.sendEmail}
                        onChange={(e) => setGenForm({ ...genForm, sendEmail: e.target.checked })}
                        className="h-4 w-4 rounded border-2 border-ink accent-brand"
                      />
                      Automatically send key details via email
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-brand py-2.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_#111111] hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
                      Generate &amp; Grant Access
                    </button>
                  </form>
                </div>
              )}

              {/* Support Inbox Tab */}
              {activeTab === "messages" && (
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Inquiries &amp; Help Requests: {messages.length}
                    </p>
                    <button
                      onClick={fetchMessages}
                      disabled={loading}
                      className="flex items-center gap-1 text-xs font-bold text-ink hover:underline"
                    >
                      <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {messages.length === 0 ? (
                      <div className="rounded-xl border-2 border-ink bg-white p-6 text-center text-xs text-ink-muted">
                        No support messages recorded yet.
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-xl border-2 border-ink bg-white p-4 shadow-[2px_2px_0_#111111]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-ink">{m.name || "Anonymous"}</span>
                                <span className="text-xs text-ink-muted">({m.email})</span>
                                {m.key && (
                                  <span className="rounded bg-cream border border-ink/20 px-1.5 py-0.5 text-[10px] font-mono">
                                    {m.key}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-ink-muted">
                                Received: {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                m.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                          <p className="mt-2.5 rounded-lg bg-surface p-3 text-xs text-ink whitespace-pre-wrap border border-ink/10">
                            {m.message}
                          </p>
                          {m.status !== "resolved" && (
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => handleResolveMessage(m.id)}
                                className="flex items-center gap-1 rounded-md border border-green-700 bg-green-50 px-3 py-1 text-xs font-bold text-green-900 hover:bg-green-100"
                              >
                                <CheckCircle2 size={12} /> Mark as Resolved
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
