import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_HOME = {
  farmer: "/farmer/dashboard",
  consumer: "/consumer/dashboard",
  bulk_buyer: "/bulk-buyer/dashboard",
};

const ROLES = [
  {
    key: "farmer",
    icon: "🌾",
    label: "Farmer",
    title: "Sell your harvest directly",
    short: "List produce, compare buyers and use TULIP insights.",
    accent: "bg-forest-50 border-forest-200",
  },
  {
    key: "consumer",
    icon: "🛒",
    label: "Consumer",
    title: "Shop fresh produce",
    short: "Discover farm-direct produce and track your orders.",
    accent: "bg-leaf-50 border-leaf-200",
  },
  {
    key: "bulk_buyer",
    icon: "🏬",
    label: "Bulk Buyer",
    title: "Source at scale",
    short: "Post requirements and connect with matching farmers.",
    accent: "bg-[#F4F7E8] border-[#DDE6B2]",
  },
];

function roleFromQuery(search) {
  const value = new URLSearchParams(search).get("role");
  return ROLES.some((role) => role.key === value) ? value : "farmer";
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = useMemo(() => roleFromQuery(location.search), [location.search]);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const role = ROLES.find((item) => item.key === selectedRole) || ROLES[0];
  const passwordLengthOK = form.password.length >= 8;
  const passwordMatch = form.password !== "" && form.password === form.confirmPassword;

  function changeRole(roleKey) {
    setSelectedRole(roleKey);
    setError("");
    navigate(`/register?role=${roleKey}`, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!passwordLengthOK) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!accepted) {
      setError("Please accept the terms to create your account.");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: selectedRole,
      });
      navigate(ROLE_HOME[user?.role || selectedRole] || "/");
    } catch (err) {
      setError(err?.response?.data?.message || "We couldn't create your account. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#EAF6EC] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_500px] gap-8 xl:gap-12 items-start">
          <section className="pt-2 lg:pt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#9AA79F] px-3.5 py-2 text-xs font-extrabold tracking-wide text-forest-800 shadow-sm">
              <span aria-hidden="true">🌱</span>
              JOIN FARMER'S CHOICE
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.04] text-ink">
              Create your account.
              <span className="block text-forest-700">Choose your role.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg text-ink/70 leading-relaxed">
              Start with the workspace that fits you. You can switch between roles later only through the appropriate account, while your dashboard stays focused on what you need.
            </p>

            <div className="mt-8 space-y-3" aria-label="Choose account type">
              {ROLES.map((item) => {
                const active = selectedRole === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => changeRole(item.key)}
                    className={`w-full !text-left !rounded-2xl !border !p-4 sm:!p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200 ${
                      active
                        ? "!bg-white !border-forest-600 !border-2 !shadow-[0_12px_30px_rgba(22,131,59,.16)]"
                        : "!bg-white !border-[#9AA79F] hover:!border-forest-500 hover:!shadow-green-sm"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${item.accent}`}>
                        <span aria-hidden="true">{item.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display font-extrabold text-ink">{item.label}</h2>
                          {active && (
                            <span className="inline-flex items-center rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-forest-800">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-ink/75">{item.title}</p>
                        <p className="mt-1 text-xs sm:text-sm text-ink/50 leading-relaxed">{item.short}</p>
                      </div>
                      <span aria-hidden="true" className={`mt-1 text-lg ${active ? "text-forest-700" : "text-ink/20"}`}>
                        {active ? "✓" : "→"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 grid sm:grid-cols-3 gap-3">
              {[
                ["01", "Quick setup"],
                ["02", "Role-based dashboard"],
                ["03", "TULIP + marketplace"],
              ].map(([number, label]) => (
                <div key={number} className="rounded-2xl bg-white border border-[#9AA79F] p-4 shadow-[0_6px_18px_rgba(24,35,27,.05)]">
                  <div className="text-xs font-black text-forest-700">{number}</div>
                  <div className="mt-1 text-sm font-bold text-ink">{label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] bg-white border-2 border-[#9AA79F] shadow-[0_18px_55px_rgba(24,35,27,.12)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-forest-700">Create account as</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-display font-black text-ink">{role.label}</h2>
                <p className="mt-1 text-sm text-ink/50">{role.title}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${role.accent}`} aria-hidden="true">
                {role.icon}
              </div>
            </div>

            {error && (
              <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="signup-name" className="label">Full name</label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="input !h-12 !rounded-xl !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                  placeholder={selectedRole === "bulk_buyer" ? "Your name or contact person" : "Your full name"}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="label">Email address</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className="input !h-12 !rounded-xl !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                  placeholder={selectedRole === "farmer" ? "farmer@example.com" : selectedRole === "consumer" ? "you@example.com" : "business@example.com"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="label">Password</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="input !h-12 !rounded-xl !pr-24 !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 !bg-transparent !text-ink/55 !border-0 !shadow-none !px-2.5 !py-2 text-xs font-extrabold hover:!bg-forest-50 hover:!text-forest-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
                  <span className={`w-2 h-2 rounded-full ${passwordLengthOK ? "bg-forest-500" : "bg-black/15"}`} />
                  <span className={passwordLengthOK ? "text-forest-700" : "text-ink/40"}>At least 8 characters</span>
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm" className="label">Confirm password</label>
                <div className="relative">
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="input !h-12 !rounded-xl !pr-24 !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 !bg-transparent !text-ink/55 !border-0 !shadow-none !px-2.5 !py-2 text-xs font-extrabold hover:!bg-forest-50 hover:!text-forest-800"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {form.confirmPassword !== "" && (
                  <p className={`mt-2 text-xs font-bold ${passwordMatch ? "text-forest-700" : "text-red-600"}`}>
                    {passwordMatch ? "✓ Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 rounded-2xl bg-forest-50 border-2 border-forest-300 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#16833B]"
                  required
                />
                <span className="text-xs sm:text-sm text-ink/65 leading-relaxed">
                  I agree to the Farmer&apos;s Choice terms and understand that my account is created for the selected role: <strong className="text-ink">{role.label}</strong>.
                </span>
              </label>

              <button
                type="submit"
                className="btn btn-primary w-full !rounded-xl !py-3.5 !text-base focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
                disabled={loading}
              >
                {loading ? "Creating your account…" : `Create ${role.label} account`}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t-2 border-[#B0BAB4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
              <p className="text-ink/50">
                Already have an account?
              </p>
              <Link to={`/login/${selectedRole === "bulk_buyer" ? "bulk-buyer" : selectedRole}`} className="font-extrabold text-forest-700 hover:text-forest-900 hover:underline">
                Log in as {role.label} →
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-xs font-bold text-ink/40 hover:text-forest-700">← Back to homepage</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
