import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_HOME = {
  farmer: "/farmer/dashboard",
  consumer: "/consumer/dashboard",
  bulk_buyer: "/bulk-buyer/dashboard",
  admin: "/admin/dashboard",
};

const ROLE_LOGIN_PATH = {
  farmer: "/login/farmer",
  consumer: "/login/consumer",
  bulk_buyer: "/login/bulk-buyer",
};

const ROLES = [
  {
    key: "farmer",
    label: "Farmer",
    icon: "🌾",
    title: "Farmer Login",
    subtitle: "Manage your harvest, buyers, storage and TULIP insights.",
    demo: "Enter Farmer Demo",
    color: "forest",
  },
  {
    key: "consumer",
    label: "Consumer",
    icon: "🛒",
    title: "Consumer Login",
    subtitle: "Shop fresh produce directly from verified farmers.",
    demo: "Enter Consumer Demo",
    color: "leaf",
  },
  {
    key: "bulk_buyer",
    label: "Bulk Buyer",
    icon: "🏬",
    title: "Bulk Buyer Login",
    subtitle: "Post large requirements and connect directly with farmers.",
    demo: "Enter Bulk Buyer Demo",
    color: "gold",
  },
];

function roleFromPath(pathname) {
  if (pathname === "/login/farmer") return "farmer";
  if (pathname === "/login/consumer") return "consumer";
  if (pathname === "/login/bulk-buyer") return "bulk_buyer";
  return "";
}

export default function Login() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryRole = new URLSearchParams(location.search).get("role");
  const pathRole = roleFromPath(location.pathname);
  const initialRole = ROLES.some((r) => r.key === (pathRole || queryRole)) ? (pathRole || queryRole) : "farmer";

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const role = ROLES.find((r) => r.key === selectedRole) || ROLES[0];

  function chooseRole(key) {
    setSelectedRole(key);
    setError("");
    navigate(ROLE_LOGIN_PATH[key], { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      navigate(ROLE_HOME[user.role] || "/");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  function demoLogin(roleKey) {
    const user = loginAsDemo(roleKey);
    navigate(ROLE_HOME[user.role] || "/");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#EAF6EC] px-4 py-8 sm:py-12">
      <div className="container-xl max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_430px] gap-8 items-start">
          <section className="pt-2 lg:pt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#9AA79F] px-3 py-1.5 text-xs font-bold text-forest-700 mb-5">
              🌱 FARMER'S CHOICE
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-ink leading-tight">
              One marketplace.
              <br />
              <span className="text-forest">Choose your way in.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink/55 mt-4 max-w-xl leading-relaxed">
              Sign in to the workspace that matches how you use Farmer's Choice.
              Your dashboard and tools will be tailored to your role.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {ROLES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => chooseRole(item.key)}
                  className={`!text-left !p-4 !rounded-2xl !border transition-all duration-200 ${
                    selectedRole === item.key
                      ? "!bg-white !border-forest-600 !border-2 !shadow-[0_12px_30px_rgba(22,131,59,.16)] -translate-y-0.5"
                      : "!bg-white !border-[#9AA79F] hover:!border-forest-500 hover:!shadow-green-sm"
                  }`}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-sm font-extrabold text-ink">{item.label}</div>
                  <div className="text-xs text-ink/50 mt-1 leading-relaxed">{item.subtitle}</div>
                  <span className={`inline-flex mt-3 text-[10px] font-bold uppercase tracking-wider ${
                    selectedRole === item.key ? "text-forest" : "text-ink/35"
                  }`}>
                    {selectedRole === item.key ? "Selected" : "Choose"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-white border border-[#9AA79F] p-5 shadow-[0_6px_18px_rgba(24,35,27,.06)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-xl">{role.icon}</div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-forest-700">Current workspace</p>
                  <p className="font-display font-bold text-ink">{role.title.replace(" Login", "")}</p>
                </div>
              </div>
              <p className="text-sm text-ink/55 mt-3 leading-relaxed">{role.subtitle}</p>
            </div>
          </section>

          <section className="bg-white rounded-[28px] border-2 border-[#9AA79F] shadow-[0_18px_50px_rgba(24,35,27,.11)] p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-forest-700">{role.label}</p>
                <h2 className="text-2xl font-display font-extrabold text-ink mt-1">{role.title}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center text-2xl">{role.icon}</div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  required
                  className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                  placeholder={selectedRole === "farmer" ? "farmer@example.com" : selectedRole === "consumer" ? "consumer@example.com" : "business@example.com"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  required
                  className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button
                className="btn btn-primary w-full !rounded-xl !py-3.5"
                disabled={loading}
              >
                {loading ? "Signing in…" : `Login as ${role.label}`}
              </button>
            </form>

            <div className="relative my-6">
              <div className="border-t-2 border-[#B0BAB4]" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-[11px] font-bold uppercase tracking-widest text-ink/30">
                quick demo
              </span>
            </div>

            <button
              type="button"
              onClick={() => demoLogin(selectedRole)}
              className="w-full !bg-forest-50 !text-forest-800 !border-forest-300 !border-2 hover:!bg-forest-100 !rounded-xl !py-3.5 !shadow-none"
            >
              {role.demo} →
            </button>

            <p className="text-xs text-ink/40 text-center mt-4">
              Demo login uses the sample data already bundled with the MVP.
            </p>

            <div className="flex items-center justify-between mt-6 pt-5 border-t-2 border-[#B0BAB4] text-sm">
              <Link to={`/register?role=${selectedRole}`} className="text-forest font-bold hover:underline">
                Create {role.label} account
              </Link>
              <Link to="/" className="text-ink/45 hover:text-forest">
                Back home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
