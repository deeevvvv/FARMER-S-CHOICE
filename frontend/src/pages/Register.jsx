import React from "react";
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'farmer', label: 'Farmer / FPO', icon: '🌾', desc: 'Sell your produce directly to buyers.' },
  { id: 'consumer', label: 'Consumer', icon: '🛒', desc: 'Buy fresh produce straight from farms.' },
  { id: 'bulk_buyer', label: 'Bulk Buyer', icon: '🏬', desc: 'Restaurants, retailers, hotels & supermarkets.' },
];

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  consumer: '/marketplace',
  bulk_buyer: '/bulk-buyer/dashboard',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'consumer');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', businessName: '', farmName: '', city: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const profile =
        role === 'farmer'
          ? { farmName: form.farmName, village: form.city }
          : role === 'bulk_buyer'
          ? { businessName: form.businessName, city: form.city }
          : { city: form.city };

      const user = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role, profile });
      navigate(ROLE_HOME[user.role] || '/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-xl py-16 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <span className="text-3xl">🌾</span>
        <h1 className="text-2xl font-semibold text-ink mt-3">Create your account</h1>
        <p className="text-ink/50 text-sm mt-1">Choose how you'll use Farmer's Choice</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`card p-4 text-center transition-all ${role === r.id ? 'ring-2 ring-forest border-transparent' : ''}`}
          >
            <div className="text-2xl mb-1.5">{r.icon}</div>
            <div className="text-sm font-medium text-ink">{r.label}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-ink/50 text-center mb-6">{ROLES.find((r) => r.id === role)?.desc}</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        {role === 'farmer' && (
          <div>
            <label className="label">Farm name</label>
            <input className="input" value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} />
          </div>
        )}
        {role === 'bulk_buyer' && (
          <div>
            <label className="label">Business name</label>
            <input className="input" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          </div>
        )}
        <div>
          <label className="label">City / Village</label>
          <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account…' : `Sign up as ${ROLES.find((r) => r.id === role)?.label}`}
        </button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        Already have an account? <Link to="/login" className="text-forest font-medium">Log in</Link>
      </p>
    </div>
  );
}