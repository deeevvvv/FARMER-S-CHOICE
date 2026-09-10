import React from "react";
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../utils/api';
import { categories, forecasts } from '../data/mockData';
import { StatCard, TulipBadge, DemandPill, EmptyState } from '../components/Shared';
import { useAuth } from '../context/AuthContext';

const EMPTY_PRODUCT = { name: '', categoryId: 1, quantityKg: '', pricePerKg: '', location: '', harvestDate: '', isOrganic: false };

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getFarmerDashboard().then((d) => {
      setData(d);
      setProducts(d.products);
    });
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
  }

  function openEdit(p) {
    setEditing(p.id);
    setForm({ name: p.name, categoryId: p.category_id, quantityKg: p.quantity_kg, pricePerKg: p.price_per_kg, location: p.location, harvestDate: p.harvest_date, isOrganic: p.is_organic });
    setShowForm(true);
  }

  function saveProduct(e) {
    e.preventDefault();
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing ? { ...p, name: form.name, quantity_kg: Number(form.quantityKg), price_per_kg: Number(form.pricePerKg), location: form.location, harvest_date: form.harvestDate, is_organic: form.isOrganic } : p)));
    } else {
      const cat = categories.find((c) => c.id === Number(form.categoryId));
      setProducts((prev) => [
        {
          id: Date.now(),
          name: form.name,
          category_id: Number(form.categoryId),
          category_name: cat?.name,
          category_icon: cat?.icon,
          quantity_kg: Number(form.quantityKg),
          price_per_kg: Number(form.pricePerKg),
          location: form.location,
          harvest_date: form.harvestDate,
          is_organic: form.isOrganic,
          image_url: cat?.icon,
        },
        ...prev,
      ]);
    }
    setShowForm(false);
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (!data) return <div className="container-xl py-20 text-center text-ink/40">Loading dashboard…</div>;

  const inventory = products.reduce((s, p) => s + Number(p.quantity_kg), 0);

  return (
    <div className="container-xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-ink/50">Welcome back,</p>
          <h1 className="text-2xl font-semibold text-ink">{user?.name || data.farmer.farm_name} 🌾</h1>
        </div>
        <button onClick={openAdd} className="btn btn-primary">+ Add new produce</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total earnings" value={`₹${Number(data.totalEarnings).toLocaleString()}`} icon="💰" tone="forest" />
        <StatCard label="Active orders" value={data.activeOrders} icon="📦" tone="gold" />
        <StatCard label="Available inventory" value={`${inventory.toLocaleString()} kg`} icon="🧺" tone="leaf" />
        <StatCard label="Products sold" value={`${Number(data.productsSoldKg).toLocaleString()} kg`} icon="✅" tone="tulip" />
      </div>

      <div className="flex gap-1 mb-6 border-b border-black/5">
        {['overview', 'products', 'analytics', 'tulip'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t ? 'border-forest text-forest' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {t === 'tulip' ? 'TULIP Forecast' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-display font-semibold mb-4">Revenue — last 10 days</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#16211B10" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#16211B60" />
                <YAxis tick={{ fontSize: 11 }} stroke="#16211B60" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4F9D69" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">TULIP recommendation</h3>
              <TulipBadge size="sm" />
            </div>
            {forecasts.slice(0, 3).map((f) => (
              <div key={f.product_name} className="flex items-start gap-3 py-3 border-b border-black/5 last:border-0">
                <span className="text-xl">{f.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{f.product_name}</span>
                    <DemandPill level={f.demand_level} />
                  </div>
                  <p className="text-xs text-ink/50 mt-1">{f.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="card overflow-hidden">
          {products.length === 0 ? (
            <EmptyState title="No produce listed yet" description="Add your first product to start selling." action={<button onClick={openAdd} className="btn btn-primary">+ Add new produce</button>} />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-forest-50/60 text-ink/60 text-left">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Qty (kg)</th>
                  <th className="p-3.5">Price/kg</th>
                  <th className="p-3.5">Harvest date</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-black/5">
                    <td className="p-3.5 font-medium flex items-center gap-2">
                      <span className="text-lg">{p.image_url || p.category_icon}</span> {p.name}
                      {p.is_organic && <span className="text-[10px] bg-leaf-50 text-leaf-600 px-1.5 py-0.5 rounded-full">Organic</span>}
                    </td>
                    <td className="p-3.5">{p.category_icon} {p.category_name}</td>
                    <td className="p-3.5">{p.quantity_kg}</td>
                    <td className="p-3.5">₹{p.price_per_kg}</td>
                    <td className="p-3.5">{p.harvest_date}</td>
                    <td className="p-3.5">{p.location}</td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(p)} className="text-forest text-xs font-medium mr-3">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-500 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'analytics' && (
        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Sales analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16211B10" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#E3A93F" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'tulip' && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <TulipBadge />
            <span className="text-sm text-ink/50">Demand forecast for crops relevant to your farm</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.map((f) => (
              <div key={f.product_name} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="font-display font-semibold">{f.product_name}</span>
                  </div>
                  <DemandPill level={f.demand_level} />
                </div>
                <div className="text-xs text-ink/50 mb-1">Current: {f.current_demand_kg.toLocaleString()} kg</div>
                <div className="text-lg font-display font-semibold text-ink mb-2">
                  {f.predicted_demand_kg.toLocaleString()} kg
                  <span className={`ml-2 text-sm ${f.pct_change >= 0 ? 'text-leaf-600' : 'text-red-500'}`}>
                    {f.pct_change >= 0 ? '↑' : '↓'} {Math.abs(f.pct_change)}%
                  </span>
                </div>
                <p className="text-xs text-tulip-600 bg-tulip-50 rounded-lg p-2.5 leading-relaxed">{f.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={saveProduct} className="card p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-semibold text-lg">{editing ? 'Edit produce' : 'Add new produce'}</h3>
            <div>
              <label className="label">Product name</label>
              <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Quantity (kg)</label>
                <input type="number" required className="input" value={form.quantityKg} onChange={(e) => setForm({ ...form, quantityKg: e.target.value })} />
              </div>
              <div>
                <label className="label">Price per kg (₹)</label>
                <input type="number" required className="input" value={form.pricePerKg} onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Location</label>
              <input required className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="label">Harvest date</label>
              <input type="date" required className="input" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isOrganic} onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })} /> Organically grown
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline flex-1">Cancel</button>
              <button className="btn btn-primary flex-1">{editing ? 'Save changes' : 'Add produce'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}