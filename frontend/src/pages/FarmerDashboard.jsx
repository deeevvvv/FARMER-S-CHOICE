import React from "react";
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../utils/api';
import { categories, forecasts } from '../data/mockData';
import { StatCard, TulipBadge, DemandPill, EmptyState } from '../components/Shared';
import { useAuth } from '../context/AuthContext';

const EMPTY_PRODUCT = { name: '', categoryId: 1, quantityKg: '', pricePerKg: '', location: '', harvestDate: '', isOrganic: false };

const POST_HARVEST_OPTIONS = [
  {
    id: 'sell',
    icon: '🤝',
    number: '01',
    title: "Sell to Farmer's Choice",
    short: 'Get paid after harvest',
    subtitle: 'Transfer ownership and let Farmer’s Choice handle the next steps.',
    description: 'Submit your crop details and receive a direct purchase offer from Farmer’s Choice.',
    button: 'Request purchase offer',
    tag: 'Fast payout',
  },
  {
    id: 'buyers',
    icon: '🏪',
    number: '02',
    title: 'Find Direct Buyers',
    short: 'Compare buyer offers',
    subtitle: 'Keep ownership until the sale and choose the buyer yourself.',
    description: 'Compare restaurants, wholesalers, retailers, and other buyers by price and quantity.',
    button: 'View buyer offers',
    tag: 'Farmer decides',
  },
  {
    id: 'store',
    icon: '🏬',
    number: '03',
    title: 'Store & Sell Later',
    short: 'Keep ownership',
    subtitle: 'Compare local warehouses and decide when to sell later.',
    description: 'Choose storage using distance, capacity, crop suitability, and daily storage cost.',
    button: 'Compare warehouses',
    tag: 'Flexible timing',
  },
];

const DEMO_BUYER_OFFERS = [
  { buyer: 'FreshBite Restaurant', type: 'Restaurant', quantity: 500, price: 24, location: 'Nearby' },
  { buyer: 'Sharma Wholesalers', type: 'Wholesaler', quantity: 1000, price: 23, location: '8 km away' },
  { buyer: 'GreenBasket Retail', type: 'Retailer', quantity: 300, price: 25, location: '5 km away' },
];

const DEMO_WAREHOUSES = [
  { name: 'Sharma Cold Storage', distance: 4, capacity: '20 tonnes', rate: 1.50, suitability: 'Vegetables & fruits' },
  { name: 'Green Store', distance: 7, capacity: '35 tonnes', rate: 1.40, suitability: 'Grains & pulses' },
  { name: 'AgriSafe Warehouse', distance: 11, capacity: '50 tonnes', rate: 1.25, suitability: 'Mixed crops' },
];

function IconClose({ onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close"
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className="w-10 h-10 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-2xl text-ink/60 cursor-pointer select-none transition"
    >
      ×
    </div>
  );
}

function ModalShell({ children, onClose, wide = false }) {
  return (
    <div
      className="fixed inset-0 bg-black/45 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-6 z-[80]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} max-h-[92vh] overflow-y-auto rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,0,0,.22)] border-2 border-[#9AA79F]`}
      >
        {children}
      </div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[100] w-[calc(100vw-2rem)] sm:w-[380px]">
      <div className="rounded-2xl bg-white border border-black/[0.06] shadow-[0_18px_55px_rgba(0,0,0,.16)] p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center text-lg shrink-0">✓</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink">{toast.title}</p>
          <p className="text-sm text-ink/55 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <div
          role="button"
          tabIndex={0}
          aria-label="Dismiss"
          onClick={onClose}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
          className="text-ink/35 hover:text-ink text-xl cursor-pointer leading-none px-1"
        >
          ×
        </div>
      </div>
    </div>
  );
}

function PostHarvestCard({ option, onClick }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border-2 border-forest-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(24,35,27,.10)] hover:border-forest-400 hover:shadow-[0_18px_42px_rgba(22,131,59,.16)] hover:-translate-y-0.5 transition-all min-h-[330px]">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-forest-100/80 translate-x-10 -translate-y-10" />
      <div className="absolute inset-x-0 top-0 h-1 bg-forest-500" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="w-13 h-13 rounded-2xl bg-forest-100 border border-forest-300 flex items-center justify-center text-2xl shadow-sm">
            {option.icon}
          </div>
          <span className="text-[11px] font-extrabold tracking-wider text-forest-800 bg-forest-100 border border-forest-300 rounded-full px-3 py-1">
            {option.number}
          </span>
        </div>
        <span className="inline-flex mt-4 rounded-full bg-leaf-50 border border-leaf-300 text-leaf-800 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide">
          {option.tag}
        </span>
        <h3 className="font-display font-extrabold text-lg text-ink mt-3 leading-tight">{option.title}</h3>
        <p className="text-sm font-bold text-forest-800 mt-2">{option.short}</p>
        <p className="text-sm text-ink/70 mt-1.5 leading-relaxed min-h-[64px]">{option.subtitle}</p>
        <button
          onClick={onClick}
          className="!bg-forest-600 hover:!bg-forest-700 !border-2 !border-forest-700 w-full mt-5 rounded-xl py-3 text-sm font-extrabold shadow-[0_5px_14px_rgba(22,131,59,.18)] hover:shadow-[0_9px_22px_rgba(22,131,59,.24)] transition-all"
        >
          {option.button} →
        </button>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [products, setProducts] = useState([]);
  const [postHarvestOption, setPostHarvestOption] = useState(null);
  const [postHarvestForm, setPostHarvestForm] = useState({ crop: '', quantityKg: '', location: '', pickupDate: '' });
  const [postHarvestRequests, setPostHarvestRequests] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getFarmerDashboard().then((d) => {
      setData(d);
      setProducts(d.products);
    });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(title, message) {
    setToast({ title, message });
  }

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
      setShowForm(false);
      notify('Produce updated', `${form.name} has been updated in your inventory.`);
      return;
    }

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
    setShowForm(false);
    notify('Produce added', `${form.name} is now listed in your inventory.`);
  }

  function deleteProduct(id) {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify('Produce removed', `${item?.name || 'The product'} was removed from your inventory.`);
  }

  function openPostHarvest(optionId) {
    setPostHarvestOption(optionId);
    const firstProduct = products[0];
    setPostHarvestForm((prev) => ({
      crop: prev.crop || firstProduct?.name || '',
      quantityKg: prev.quantityKg || firstProduct?.quantity_kg || '',
      location: prev.location || firstProduct?.location || '',
      pickupDate: prev.pickupDate || firstProduct?.harvest_date || '',
    }));
    setSelectedWarehouse(null);
    setSelectedBuyer(null);
  }

  function closePostHarvest() {
    setPostHarvestOption(null);
    setSelectedWarehouse(null);
    setSelectedBuyer(null);
  }

  function submitPostHarvest(e) {
    e.preventDefault();
    const option = POST_HARVEST_OPTIONS.find((item) => item.id === postHarvestOption);
    if (!option) return;

    setPostHarvestRequests((prev) => [
      {
        id: Date.now(),
        option: option.title,
        crop: postHarvestForm.crop,
        quantityKg: Number(postHarvestForm.quantityKg),
        location: postHarvestForm.location,
        pickupDate: postHarvestForm.pickupDate,
        selectedBuyer: selectedBuyer?.buyer || null,
        selectedWarehouse: selectedWarehouse || null,
        status: option.id === 'buyers' ? 'Buyer matching requested' : option.id === 'store' ? 'Warehouse comparison requested' : 'Purchase offer requested',
      },
      ...prev,
    ]);
    closePostHarvest();
    notify(
      option.id === 'sell' ? 'Purchase request sent' : option.id === 'buyers' ? 'Buyer matching started' : 'Storage request created',
      option.id === 'sell'
        ? `Your ${postHarvestForm.crop} request has been recorded for review.`
        : option.id === 'buyers'
          ? selectedBuyer
            ? `${selectedBuyer.buyer} was selected as your preferred buyer.`
            : 'We recorded your request and can show matching buyers.'
          : selectedWarehouse
            ? `${selectedWarehouse} was selected for your storage plan.`
            : 'We recorded your request and can show matching warehouses.',
    );
  }

  if (!data) return <div className="container-xl py-20 text-center text-ink/40">Loading dashboard…</div>;

  const inventory = products.reduce((s, p) => s + Number(p.quantity_kg), 0);

  return (
    <div className="container-xl py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-ink/45">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-1">{user?.name || data.farmer.farm_name} 🌾</h1>
          <p className="text-sm text-ink/55 mt-2">Choose what you want to do with your harvest.</p>
        </div>
        <button onClick={openAdd} className="!bg-forest-600 hover:!bg-forest-700 !border-forest-600 rounded-xl px-5 py-3 text-sm shadow-none">
          + Add new produce
        </button>
      </div>

      {/* Front-and-center post-harvest choices */}
      <section className="mb-8 rounded-[28px] bg-gradient-to-br from-forest-50 via-white to-leaf-50 border border-forest-100 p-4 sm:p-6 lg:p-7 shadow-[0_10px_35px_rgba(22,131,59,.06)]">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-forest-100 px-3 py-1 text-[11px] font-bold text-forest-700">
              <span>POST-HARVEST CENTER</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink mt-3">Three ways to handle your harvest</h2>
            <p className="text-sm text-ink/55 mt-1.5 max-w-2xl">Pick the option that matches your cash-flow, buyer, and storage needs. You stay in control unless you choose to sell directly to Farmer’s Choice.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {POST_HARVEST_OPTIONS.map((option) => (
            <PostHarvestCard key={option.id} option={option} onClick={() => openPostHarvest(option.id)} />
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total earnings" value={`₹${Number(data.totalEarnings).toLocaleString()}`} icon="💰" tone="forest" />
        <StatCard label="Active orders" value={data.activeOrders} icon="📦" tone="gold" />
        <StatCard label="Available inventory" value={`${inventory.toLocaleString()} kg`} icon="🧺" tone="leaf" />
        <StatCard label="Products sold" value={`${Number(data.productsSoldKg).toLocaleString()} kg`} icon="✅" tone="tulip" />
      </div>

      <div className="flex gap-1 mb-6 border-b border-black/5 overflow-x-auto">
        {['overview', 'post-harvest', 'products', 'analytics', 'tulip'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`!bg-transparent !border-0 !text-inherit px-4 py-2.5 text-sm font-medium border-b-2 !shadow-none whitespace-nowrap transition-colors capitalize ${
              tab === t ? '!text-forest-700 border-forest' : '!text-ink/50 border-transparent hover:!text-ink'
            }`}
          >
            {t === 'tulip' ? 'TULIP Forecast' : t === 'post-harvest' ? 'Post-Harvest' : t}
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

      {tab === 'post-harvest' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <h2 className="font-display font-semibold text-xl">Post-Harvest Center</h2>
            </div>
            <p className="text-sm text-ink/50 mt-1">Review your recent requests and reopen any harvest pathway.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {POST_HARVEST_OPTIONS.map((option) => (
              <PostHarvestCard key={option.id} option={option} onClick={() => openPostHarvest(option.id)} />
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="p-5 border-b border-black/5">
              <h3 className="font-display font-semibold">Recent post-harvest requests</h3>
              <p className="text-xs text-ink/45 mt-1">These demo requests are stored in this page session until the backend workflow is connected.</p>
            </div>
            {postHarvestRequests.length === 0 ? (
              <div className="p-6 text-sm text-ink/45">No requests yet. Choose one of the three options above to start.</div>
            ) : (
              <div className="divide-y divide-black/5">
                {postHarvestRequests.map((request) => (
                  <div key={request.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{request.option}</div>
                      <div className="text-xs text-ink/50 mt-1">
                        {request.crop} · {request.quantityKg.toLocaleString()} kg · {request.location}
                      </div>
                    </div>
                    <span className="text-xs rounded-full bg-leaf-50 text-leaf-700 px-2.5 py-1 font-semibold">{request.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="card overflow-hidden">
          {products.length === 0 ? (
            <EmptyState title="No produce listed yet" description="Add your first product to start selling." action={<button onClick={openAdd} className="!bg-forest-600 hover:!bg-forest-700 !border-forest-600 rounded-xl px-4 py-2.5">+ Add new produce</button>} />
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
                      <button onClick={() => openEdit(p)} className="!bg-transparent !text-forest-700 !border-0 !shadow-none text-xs font-medium mr-3">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="!bg-transparent !text-red-500 !border-0 !shadow-none text-xs font-medium">Delete</button>
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

      {/* Redesigned post-harvest modal */}
      {postHarvestOption && (
        <ModalShell onClose={closePostHarvest} wide={postHarvestOption !== 'sell'}>
          <div className="p-5 sm:p-7 lg:p-8">
            {(() => {
              const activeOption = POST_HARVEST_OPTIONS.find((o) => o.id === postHarvestOption);
              return (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-2xl shrink-0">
                          {activeOption?.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-forest-700">Post-Harvest</p>
                          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink mt-1 leading-tight">
                            {activeOption?.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-ink/60 mt-4 max-w-2xl leading-relaxed">
                        {activeOption?.description}
                      </p>
                    </div>
                    <IconClose onClick={closePostHarvest} />
                  </div>

                  {/* Harvest details */}
                  <section className="mt-7 rounded-2xl border border-[#B8C3BC] bg-[#F7FAF8] p-4 sm:p-5">
                    <div className="mb-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/55">Harvest details</p>
                      <p className="text-xs text-ink/45 mt-1">Enter the basics once. We’ll use them for this request.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Crop</label>
                        <input
                          required
                          className="input !h-12 rounded-xl !border !border-[#7B8981] !bg-white !text-ink placeholder:!text-ink/35 focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-200"
                          value={postHarvestForm.crop}
                          onChange={(e) => setPostHarvestForm({ ...postHarvestForm, crop: e.target.value })}
                          placeholder="e.g. Tomato"
                        />
                      </div>

                      <div>
                        <label className="label">Quantity (kg)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          className="input !h-12 rounded-xl !border !border-[#7B8981] !bg-white !text-ink placeholder:!text-ink/35 focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-200"
                          value={postHarvestForm.quantityKg}
                          onChange={(e) => setPostHarvestForm({ ...postHarvestForm, quantityKg: e.target.value })}
                          placeholder="500"
                        />
                      </div>

                      <div>
                        <label className="label">Farm / pickup location</label>
                        <input
                          required
                          className="input !h-12 rounded-xl !border !border-[#7B8981] !bg-white !text-ink placeholder:!text-ink/35 focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-200"
                          value={postHarvestForm.location}
                          onChange={(e) => setPostHarvestForm({ ...postHarvestForm, location: e.target.value })}
                          placeholder="Village / district"
                        />
                      </div>

                      <div>
                        <label className="label">Harvest / pickup date</label>
                        <input
                          type="date"
                          required
                          className="input !h-12 rounded-xl !border !border-[#7B8981] !bg-white !text-ink focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-200"
                          value={postHarvestForm.pickupDate}
                          onChange={(e) => setPostHarvestForm({ ...postHarvestForm, pickupDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Sell to Farmer's Choice */}
                  {postHarvestOption === 'sell' && (
                    <section className="mt-6 rounded-2xl border border-forest-200 bg-forest-50/70 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white border border-forest-200 flex items-center justify-center text-xl shrink-0">💰</div>
                        <div>
                          <p className="font-extrabold text-sm text-ink">What happens next?</p>
                          <p className="text-sm text-ink/60 mt-1.5 leading-relaxed">
                            Farmer’s Choice reviews your crop details, prepares a purchase offer, and takes ownership after the sale is completed.
                          </p>
                          <div className="mt-4 grid sm:grid-cols-3 gap-2 text-xs">
                            {['Submit crop details', 'Receive purchase offer', 'Get paid after sale'].map((step, index) => (
                              <div key={step} className="rounded-xl border border-white bg-white px-3 py-2.5 text-ink/70">
                                <span className="font-extrabold text-forest-700 mr-1">{index + 1}.</span>{step}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Direct buyer offers */}
                  {postHarvestOption === 'buyers' && (
                    <section className="mt-6">
                      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                        <div>
                          <p className="font-extrabold text-sm text-ink">Choose a buyer</p>
                          <p className="text-xs text-ink/45 mt-1">Compare the available offers and select one to continue.</p>
                        </div>
                        <span className="text-[10px] font-extrabold tracking-wider rounded-full border border-[#CBD3CE] bg-[#F7F9F8] px-2.5 py-1 text-ink/45">DEMO OFFERS</span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        {DEMO_BUYER_OFFERS.map((offer) => {
                          const active = selectedBuyer?.buyer === offer.buyer;
                          return (
                            <div
                              key={offer.buyer}
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedBuyer(active ? null : offer)}
                              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedBuyer(active ? null : offer)}
                              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                                active
                                  ? 'border-2 border-forest-600 bg-forest-50 ring-2 ring-forest-200 shadow-sm'
                                  : 'border border-[#AEBAB2] bg-white hover:border-forest-400 hover:bg-forest-50/40'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#F2F5F3] border border-[#C5CEC8] flex items-center justify-center text-lg shrink-0">🏪</div>
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-forest-600' : 'border-[#A8B3AC]'}`}>
                                  {active && <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />}
                                </span>
                              </div>
                              <p className="font-extrabold text-sm text-ink mt-4 leading-snug">{offer.buyer}</p>
                              <p className="text-[11px] text-ink/45 mt-1">{offer.type} · {offer.location}</p>
                              <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-end justify-between gap-3">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-ink/35">Quantity</p>
                                  <p className="text-sm font-bold text-ink mt-0.5">{offer.quantity.toLocaleString()} kg</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-ink/35">Offer</p>
                                  <p className="text-lg font-display font-extrabold text-forest-700 mt-0.5">₹{offer.price}<span className="text-[10px] text-ink/40">/kg</span></p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Warehouse choices */}
                  {postHarvestOption === 'store' && (
                    <section className="mt-6">
                      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                        <div>
                          <p className="font-extrabold text-sm text-ink">Choose a warehouse</p>
                          <p className="text-xs text-ink/45 mt-1">Pick based on distance, capacity, crop suitability, and storage rate.</p>
                        </div>
                        <span className="text-[10px] font-extrabold tracking-wider rounded-full border border-[#CBD3CE] bg-[#F7F9F8] px-2.5 py-1 text-ink/45">DEMO OPTIONS</span>
                      </div>

                      <div className="space-y-3">
                        {DEMO_WAREHOUSES.map((warehouse) => {
                          const active = selectedWarehouse === warehouse.name;
                          return (
                            <div
                              key={warehouse.name}
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedWarehouse(active ? null : warehouse.name)}
                              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedWarehouse(active ? null : warehouse.name)}
                              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                                active
                                  ? 'border-2 border-forest-600 bg-forest-50 ring-2 ring-forest-200 shadow-sm'
                                  : 'border border-[#AEBAB2] bg-white hover:border-forest-400 hover:bg-forest-50/40'
                              }`}
                            >
                              <div className="grid sm:grid-cols-[auto_1fr_auto] items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-[#F2F5F3] border border-[#C5CEC8] flex items-center justify-center text-lg">🏬</div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-extrabold text-sm text-ink">{warehouse.name}</span>
                                    <span className="text-[10px] font-semibold rounded-full bg-[#F3F5F4] border border-[#D2D8D4] px-2 py-0.5 text-ink/45">{warehouse.suitability}</span>
                                  </div>
                                  <p className="text-xs text-ink/50 mt-1">{warehouse.distance} km away · Capacity {warehouse.capacity}</p>
                                </div>
                                <div className="flex items-center justify-between sm:block sm:text-right gap-4">
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-ink/35">Rate</p>
                                    <p className="text-lg font-display font-extrabold text-forest-700 mt-0.5">₹{warehouse.rate.toFixed(2)}</p>
                                    <p className="text-[10px] text-ink/40">per kg / day</p>
                                  </div>
                                  <span className={`inline-flex sm:hidden w-5 h-5 rounded-full border-2 items-center justify-center ${active ? 'border-forest-600' : 'border-[#A8B3AC]'}`}>
                                    {active && <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Footer */}
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-5 border-t border-[#D8DED9]">
                    <button
                      type="button"
                      onClick={closePostHarvest}
                      className="!bg-white !text-ink !border !border-[#9AA79F] hover:!bg-[#F4F6F5] rounded-xl px-5 py-3 font-bold text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitPostHarvest}
                      disabled={postHarvestOption === 'store' && !selectedWarehouse}
                      className="!bg-forest-600 hover:!bg-forest-700 !border !border-forest-700 disabled:!opacity-40 disabled:cursor-not-allowed flex-1 rounded-xl py-3 font-extrabold text-sm shadow-none"
                    >
                      {postHarvestOption === 'sell'
                        ? 'Request purchase offer'
                        : postHarvestOption === 'buyers'
                          ? (selectedBuyer ? `Continue with ${selectedBuyer.buyer}` : 'Start buyer matching')
                          : (selectedWarehouse ? `Choose ${selectedWarehouse}` : 'Select a warehouse first')}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </ModalShell>
      )}

      {/* Polished add/edit produce modal */}
      {showForm && (
        <ModalShell onClose={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={saveProduct} className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-forest-700">
                  <span className="w-2 h-2 rounded-full bg-forest-600" />
                  Inventory
                </div>
                <h3 className="font-display font-bold text-2xl text-ink mt-1.5">{editing ? 'Edit your produce' : 'Add new produce'}</h3>
                <p className="text-sm text-ink/50 mt-1">Add clear crop details so buyers can understand your listing.</p>
              </div>
              <IconClose onClick={() => setShowForm(false)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Product name</label>
                <input required className="input rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tomato" autoFocus />
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input rounded-xl" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Quantity (kg)</label>
                  <input type="number" min="1" required className="input rounded-xl" value={form.quantityKg} onChange={(e) => setForm({ ...form, quantityKg: e.target.value })} placeholder="1000" />
                </div>
                <div>
                  <label className="label">Price per kg (₹)</label>
                  <input type="number" min="0" required className="input rounded-xl" value={form.pricePerKg} onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })} placeholder="25" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Farm / location</label>
                  <input required className="input rounded-xl" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Village / district" />
                </div>
                <div>
                  <label className="label">Harvest date</label>
                  <input type="date" required className="input rounded-xl" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-black/[0.015] p-4 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#16833B]" checked={form.isOrganic} onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })} />
                <span>
                  <span className="block text-sm font-semibold text-ink">Organically grown</span>
                  <span className="block text-xs text-ink/45 mt-0.5">Show an organic badge on your listing.</span>
                </span>
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7 pt-5 border-t-2 border-[#D0D8D3]">
              <button type="button" onClick={() => setShowForm(false)} className="!bg-black/[0.04] hover:!bg-black/[0.08] !text-ink !border-0 !shadow-none rounded-xl px-5 py-3 font-bold text-sm">
                Cancel
              </button>
              <button type="submit" className="!bg-forest-600 hover:!bg-forest-700 !border-forest-600 flex-1 rounded-xl py-3 font-bold text-sm shadow-none">
                {editing ? 'Save changes' : 'Add produce'}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
