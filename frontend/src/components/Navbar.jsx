import React from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  consumer: '/marketplace',
  bulk_buyer: '/bulk-buyer/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const links = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/tulip', label: 'TULIP AI' },
    { to: '/logistics', label: 'Logistics' },
    { to: '/price-transparency', label: 'Pricing' },
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
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-forest bg-forest-50' : 'text-ink/70 hover:text-forest hover:bg-forest-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user?.role === 'consumer' && (
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-forest-50" aria-label="Cart">
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
                to={ROLE_HOME[user.role] || '/'}
                className="hidden sm:block text-sm font-medium text-ink/80 hover:text-forest"
              >
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn btn-outline !py-1.5 !px-3 text-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline !py-1.5 !px-3 text-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary !py-1.5 !px-3 text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}