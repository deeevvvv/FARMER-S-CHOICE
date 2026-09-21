import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const ROLE_HOME = {
  farmer: "/farmer/dashboard",
  consumer: "/consumer/dashboard",
  bulk_buyer: "/bulk-buyer/dashboard",
  admin: "/admin/dashboard",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { to: "/marketplace", label: "Marketplace" },
    { to: "/tulip", label: "TULIP AI" },
    { to: "/logistics", label: "Logistics" },
    { to: "/price-transparency", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-black/5">
      <div className="container-xl flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-display font-semibold text-lg text-forest">Farmer's Choice</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "text-white bg-forest-700 shadow-green-sm ring-2 ring-forest-200"
                    : "text-ink hover:text-forest-800 hover:bg-forest-50"
                }`
              }
            >
              {t(l.label)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-forest-200 bg-white px-2.5 py-1.5 shadow-sm">
            <span className="text-sm" aria-hidden="true">🌐</span>
            <label htmlFor="language-select" className="sr-only">{t("Language")}</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-bold text-ink outline-none cursor-pointer"
              aria-label={t("Language")}
            >
              <option value="en">{language === "hi" ? "अंग्रेज़ी" : "English"}</option>
              <option value="hi">{language === "hi" ? "हिन्दी" : "Hindi"}</option>
            </select>
          </div>

          {user?.role === "consumer" && (
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-forest-50"
              aria-label={t("Cart")}
            >
              <span className="text-xl">🛒</span>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-forest-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={ROLE_HOME[user.role] || "/"}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-forest-50 px-3.5 py-2 text-sm font-bold text-forest-800 hover:bg-forest-100 transition-colors"
              >
                <span>{t("Dashboard")}</span>
                <span className="text-xs">↗</span>
              </Link>

              <Link
                to={ROLE_HOME[user.role] || "/"}
                className="hidden lg:block text-sm font-medium text-ink/70 hover:text-forest"
              >
                Hi, {user.name?.split(" ")[0] || "there"}
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn btn-outline !py-1.5 !px-3 text-sm"
              >
                {t("Log out")}
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline !py-1.5 !px-3 text-sm">{t("Log in")}</Link>
              <Link to="/register" className="btn btn-primary !py-1.5 !px-3 text-sm">{t("Sign up")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
