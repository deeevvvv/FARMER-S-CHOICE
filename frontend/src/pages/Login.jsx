import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  consumer: '/marketplace',
  bulk_buyer: '/bulk-buyer/dashboard',
  admin: '/admin/dashboard',
};

export default function Login() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  function demoLogin(role) {
    const user = loginAsDemo(role);
    navigate(ROLE_HOME[user.role] || '/');
  }

  return (
    <div className="container-xl py-16 max-w-md mx-auto">
      <div className="text-center mb-8">
        <span className="text-3xl">🌾</span>
        <h1 className="text-2xl font-semibold text-ink mt-3">Welcome back</h1>
        <p className="text-ink/50 text-sm mt-1">Log in to your Farmer's Choice account</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            className="input"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 card p-5">
        <p className="text-xs text-ink/50 mb-3">
          No backend running yet? Jump straight into any role with sample data:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => demoLogin('farmer')} className="btn btn-outline text-sm">🌾 Farmer</button>
          <button onClick={() => demoLogin('consumer')} className="btn btn-outline text-sm">🛒 Consumer</button>
          <button onClick={() => demoLogin('bulk_buyer')} className="btn btn-outline text-sm">🏬 Bulk Buyer</button>
          <button onClick={() => demoLogin('admin')} className="btn btn-outline text-sm">🛡️ Admin</button>
        </div>
      </div>

      <p className="text-center text-sm text-ink/50 mt-6">
        New here? <Link to="/register" className="text-forest font-medium">Create an account</Link>
      </p>
    </div>
  );
}