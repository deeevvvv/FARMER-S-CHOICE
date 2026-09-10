import React from "react";
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, TulipBadge, EmptyState } from '../components/Shared';

const EMPTY_FORM = { categoryId: 1, productName: '', quantityKg: '', maxPricePerKg: '', deliveryDate: '', deliveryLocation: '' };

export default function BulkBuyerDashboard() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [activeReq, setActiveReq] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [ordering, setOrdering] = useState(null);
  const [orderedIds, setOrderedIds] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getMyBulkRequirements().then(setRequirements);
  }, []);

  function submitRequirement(e) {
    e.preventDefault();
    const payload = { ...form, quantityKg: Number(form.quantityKg), maxPricePerKg: Number(form.maxPricePerKg) };
    api
      .postBulkRequirement(payload)
      .catch(() => null)
      .then((created) => {
        const newReq = created || {
          id: Date.now(),
          product_name: form.productName,
          quantity_kg: Number(form.quantityKg),
          max_price_per_kg: Number(form.maxPricePerKg),
          delivery_date: form.deliveryDate,
          delivery_location: form.deliveryLocation,
          status: 'open',
        };
        setRequirements((prev) => [newReq, ...prev]);
        setForm(EMPTY_FORM);
        setShowForm(false);
      });
  }

  async function viewMatches(req) {
    setActiveReq(req);
    setMatches(null);
    setLoadingMatches(true);
    const data = await api.getRequirementMatches(req.id);
    setMatches(data?.matches || []);
    setLoadingMatches(false);
  }

  async function placeBulkOrder(product) {
    setOrdering(product.id);
    try {
      await api
        .placeOrder({
          items: [{ productId: product.id, quantityKg: activeReq.quantity_kg }],
          deliveryAddress: activeReq.delivery_location,
          deliveryCity: activeReq.delivery_location,
          paymentMethod: 'bank_transfer',
          requestedDate: activeReq.delivery_date,
        })
        .catch(() => ({}));
      setOrderedIds((prev) => [...prev, product.id]);
    } finally {
      setOrdering(null);
    }
  }

  const openCount = requirements.filter((r) => r.status === 'open').length;
  const matchedCount = requirements.filter((r) => r.status === 'matched').length;

  return (
    <div className="container-xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-ink/50">Bulk buyer</p>
          <h1 className="text-2xl font-semibold text-ink">{user?.name || 'Your business'} 🏬</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">+ Post requirement</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Open requirements" value={openCount} icon="📋" tone="forest" />
        <StatCard label="Matched" value={matchedCount} icon="🤝" tone="gold" />
        <StatCard label="Requirements posted" value={requirements.length} icon="📦" tone="leaf" />
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div>
          <h3 className="font-display font-semibold mb-4">Your requirements</h3>
          {requirements.length === 0 ? (
            <EmptyState
              title="No requirements posted yet"
              description="Post your first bulk requirement to find matching farmers."
              action={<button onClick={() => setShowForm(true)} className="btn btn-primary">+ Post requirement</button>}
            />
          ) : (
            <div className="space-y-3">
              {requirements.map((r) => (
                <button
                  key={r.id}
                  onClick={() => viewMatches(r)}
                  className={`card p-4 w-full text-left transition-all ${activeReq?.id === r.id ? 'ring-2 ring-forest border-transparent' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-ink">{r.product_name}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        r.status === 'open' ? 'bg-forest-50 text-forest' : r.status === 'matched' ? 'bg-gold-50 text-gold-600' : 'bg-black/5 text-ink/50'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink/50">
                    {r.quantity_kg} kg · up to ₹{r.max_price_per_kg}/kg · needed by {r.delivery_date} · 📍 {r.delivery_location}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Matching farmers</h3>
            <TulipBadge size="sm" />
          </div>
          {!activeReq && <p className="text-sm text-ink/50">Select a requirement to see farmers who can fulfil it.</p>}
          {activeReq && loadingMatches && <p className="text-sm text-ink/50">Finding matches…</p>}
          {activeReq && !loadingMatches && matches?.length === 0 && (
            <p className="text-sm text-ink/50">No farmers currently match this requirement's price and quantity.</p>
          )}
          {activeReq && !loadingMatches && matches?.length > 0 && (
            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="border border-black/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{m.farmer_name || m.farm_name}</span>
                    <span className="text-xs text-ink/50">⭐ {m.farmer_rating}</span>
                  </div>
                  <p className="text-xs text-ink/50 mb-2">
                    {m.quantity_kg} kg available · ₹{m.price_per_kg}/kg · 📍 {m.location}
                  </p>
                  <button
                    onClick={() => placeBulkOrder(m)}
                    disabled={ordering === m.id || orderedIds.includes(m.id)}
                    className="btn btn-primary w-full !py-1.5 text-sm"
                  >
                    {orderedIds.includes(m.id) ? 'Order placed ✓' : ordering === m.id ? 'Placing…' : 'Place bulk order'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submitRequirement} className="card p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-semibold text-lg">Post a bulk requirement</h3>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Product name</label>
              <input required className="input" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Required quantity (kg)</label>
                <input type="number" required className="input" value={form.quantityKg} onChange={(e) => setForm({ ...form, quantityKg: e.target.value })} />
              </div>
              <div>
                <label className="label">Max price per kg (₹)</label>
                <input type="number" required className="input" value={form.maxPricePerKg} onChange={(e) => setForm({ ...form, maxPricePerKg: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Delivery date</label>
              <input type="date" required className="input" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Delivery location</label>
              <input required className="input" value={form.deliveryLocation} onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline flex-1">Cancel</button>
              <button className="btn btn-primary flex-1">Post requirement</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
