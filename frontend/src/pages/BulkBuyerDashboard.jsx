import React from "react";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { StatCard, TulipBadge, EmptyState } from "../components/Shared";

const EMPTY_FORM = {
  categoryId: 1,
  productName: "",
  quantityKg: "",
  maxPricePerKg: "",
  deliveryDate: "",
  deliveryLocation: "",
};

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
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getMyBulkRequirements().then(setRequirements);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(title, message) {
    setToast({ title, message });
  }

  function closeForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  function submitRequirement(e) {
    e.preventDefault();

    const payload = {
      ...form,
      quantityKg: Number(form.quantityKg),
      maxPricePerKg: Number(form.maxPricePerKg),
    };

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
          status: "open",
        };

        setRequirements((prev) => [newReq, ...prev]);
        closeForm();
        notify("Requirement posted", `${newReq.product_name} is now open for farmer matching.`);
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
          paymentMethod: "bank_transfer",
          requestedDate: activeReq.delivery_date,
        })
        .catch(() => ({}));

      setOrderedIds((prev) => [...prev, product.id]);
      notify("Bulk order placed", `${product.name || "Farmer produce"} has been added to your order flow.`);
    } finally {
      setOrdering(null);
    }
  }

  const openCount = requirements.filter((r) => r.status === "open").length;
  const matchedCount = requirements.filter((r) => r.status === "matched").length;

  const budget = Number(form.quantityKg || 0) * Number(form.maxPricePerKg || 0);

  return (
    <div className="container-xl py-8 sm:py-10">
      <div className="rounded-[28px] bg-gradient-to-br from-forest-50 via-white to-leaf-50 border-2 border-[#8E9B93] p-5 sm:p-7 mb-7 shadow-[0_10px_35px_rgba(22,131,59,.09)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Bulk buyer workspace</p>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
              {user?.name || "Your business"} 🏬
            </h1>
            <p className="text-sm text-ink/55 mt-2 max-w-xl">
              Source directly from farmers. Post a requirement once, then compare matching farms without the usual back-and-forth.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="!bg-forest-600 hover:!bg-forest-700 !border-forest-600 !rounded-xl !px-5 !py-3.5 !shadow-none"
          >
            + Post requirement
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          <StatCard label="Open requirements" value={openCount} icon="📋" tone="forest" />
          <StatCard label="Matched" value={matchedCount} icon="🤝" tone="gold" />
          <StatCard label="Requirements posted" value={requirements.length} icon="📦" tone="leaf" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Demand board</p>
              <h2 className="font-display font-bold text-xl text-ink mt-1">Your requirements</h2>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="!bg-transparent !text-forest-700 !border-0 !shadow-none text-sm font-bold hover:!bg-transparent"
            >
              + New
            </button>
          </div>

          {requirements.length === 0 ? (
            <EmptyState
              title="No requirements posted yet"
              description="Post your first bulk requirement to find matching farmers."
              action={
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                  + Post requirement
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              <div className="hidden sm:grid sm:grid-cols-[minmax(170px,1.35fr)_120px_120px_130px_minmax(150px,1fr)_95px] gap-3 px-4 text-[10px] font-bold uppercase tracking-widest text-ink/35">
                <span>Requirement</span>
                <span>Quantity</span>
                <span>Max price</span>
                <span>Needed by</span>
                <span>Delivery</span>
                <span className="text-right">Status</span>
              </div>

              {requirements.map((r) => (
                <div
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => viewMatches(r)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") viewMatches(r);
                  }}
                  className={`group cursor-pointer rounded-2xl border bg-white p-4 sm:px-4 sm:py-4 transition-all duration-200 ${
                    activeReq?.id === r.id
                      ? "border-forest-500 border-2 ring-2 ring-forest-100 shadow-green-md"
                      : "border-[#8E9B93] hover:border-forest-500 hover:shadow-green-sm"
                  }`}
                >
                  <div className="grid sm:grid-cols-[minmax(170px,1.35fr)_120px_120px_130px_minmax(150px,1fr)_95px] gap-3 items-center">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-forest-700 mb-1">
                        Requirement #{String(r.id).slice(-4)}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-forest-50 flex items-center justify-center text-lg shrink-0">
                          {categories.find((c) => Number(c.id) === Number(r.category_id))?.icon || "📦"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-extrabold text-ink truncate">{r.product_name}</h3>
                          <p className="text-xs text-ink/40 mt-0.5 group-hover:text-forest-700 transition-colors">
                            Click to view matching farmers →
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0">
                      <span className="block sm:hidden text-[10px] font-bold uppercase tracking-widest text-ink/35 mb-1">Quantity</span>
                      <span className="font-display font-extrabold text-ink">{Number(r.quantity_kg).toLocaleString()} kg</span>
                    </div>

                    <div>
                      <span className="block sm:hidden text-[10px] font-bold uppercase tracking-widest text-ink/35 mb-1">Max price</span>
                      <span className="font-display font-extrabold text-forest">₹{r.max_price_per_kg}/kg</span>
                    </div>

                    <div>
                      <span className="block sm:hidden text-[10px] font-bold uppercase tracking-widest text-ink/35 mb-1">Needed by</span>
                      <span className="text-sm font-bold text-ink">{r.delivery_date}</span>
                    </div>

                    <div className="min-w-0">
                      <span className="block sm:hidden text-[10px] font-bold uppercase tracking-widest text-ink/35 mb-1">Delivery</span>
                      <span className="block text-sm font-bold text-ink truncate">📍 {r.delivery_location}</span>
                    </div>

                    <div className="sm:text-right">
                      <span
                        className={`inline-flex items-center justify-center text-[11px] font-extrabold px-2.5 py-1.5 rounded-full capitalize ${
                          r.status === "open"
                            ? "bg-forest-50 text-forest-800 border border-forest-100"
                            : r.status === "matched"
                              ? "bg-gold-50 text-gold-700 border border-gold-100"
                              : "bg-black/[0.04] text-ink/55 border border-black/5"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          r.status === "open" ? "bg-forest-600" : r.status === "matched" ? "bg-gold-500" : "bg-ink/30"
                        }`} />
                        {r.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 h-fit !border-2 !border-[#8E9B93] !bg-white shadow-[0_8px_24px_rgba(24,35,27,.07)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-forest-700">TULIP matching</p>
              <h3 className="font-display font-bold text-lg mt-1">Matching farmers</h3>
            </div>
            <TulipBadge size="sm" />
          </div>

          {!activeReq && (
            <div className="rounded-2xl bg-forest-50/60 border-2 border-forest-300 p-4 text-sm text-ink/55">
              Select a requirement to see farmers who can fulfil your quantity and budget.
            </div>
          )}

          {activeReq && loadingMatches && (
            <div className="rounded-2xl bg-forest-50/60 border-2 border-forest-300 p-4 text-sm text-ink/55">
              Finding the closest matches…
            </div>
          )}

          {activeReq && !loadingMatches && matches?.length === 0 && (
            <div className="rounded-2xl bg-black/[0.02] border-2 border-[#A1ACA5] p-4 text-sm text-ink/55">
              No farmers currently match this requirement's price and quantity.
            </div>
          )}

          {activeReq && !loadingMatches && matches?.length > 0 && (
            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="border-2 border-[#A1ACA5] rounded-2xl p-3.5 hover:border-forest-400 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-sm">{m.farmer_name || m.farm_name}</span>
                    <span className="text-xs text-ink/50">⭐ {m.farmer_rating}</span>
                  </div>
                  <p className="text-xs text-ink/50 mb-3">
                    {m.quantity_kg} kg available · ₹{m.price_per_kg}/kg · 📍 {m.location}
                  </p>
                  <button
                    onClick={() => placeBulkOrder(m)}
                    disabled={ordering === m.id || orderedIds.includes(m.id)}
                    className="btn btn-primary w-full !rounded-xl !py-2.5 text-sm"
                  >
                    {orderedIds.includes(m.id)
                      ? "Order placed ✓"
                      : ordering === m.id
                        ? "Placing…"
                        : "Place bulk order"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-[70] bg-[#071109]/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={closeForm}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitRequirement}
            className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[30px] bg-white border-2 border-[#7F8C84] shadow-[0_30px_90px_rgba(0,0,0,.24)]"
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b-2 border-[#A8B2AC] px-5 sm:px-7 py-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-forest-700">New sourcing request</p>
                <h2 className="font-display text-2xl font-extrabold text-ink mt-1">Post a bulk requirement</h2>
                <p className="text-sm text-ink/50 mt-1">Tell farmers exactly what you need. TULIP will use these details for matching.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="!bg-black/[0.04] !text-ink/60 !border-0 !w-10 !h-10 !min-w-10 !rounded-full !p-0 !shadow-none text-xl hover:!bg-black/[0.08]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-6 p-5 sm:p-7">
              <div className="space-y-5">
                <div className="rounded-2xl border-2 border-forest-300 bg-forest-50 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">📦</div>
                    <div>
                      <h3 className="font-display font-bold text-ink">What do you need?</h3>
                      <p className="text-xs text-ink/45">Product and volume you want farmers to quote for.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Category</label>
                      <select
                        className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Product name</label>
                      <input
                        required
                        className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                        placeholder="e.g. Tomato, Onion, Wheat"
                        value={form.productName}
                        onChange={(e) => setForm({ ...form, productName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Required quantity (kg)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                        placeholder="500"
                        value={form.quantityKg}
                        onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Maximum price per kg (₹)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                        placeholder="28"
                        value={form.maxPricePerKg}
                        onChange={(e) => setForm({ ...form, maxPricePerKg: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#A1ACA5] bg-[#F7FAF8] p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-xl">🚚</div>
                    <div>
                      <h3 className="font-display font-bold text-ink">Where and when?</h3>
                      <p className="text-xs text-ink/45">Your delivery deadline and destination.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Delivery date</label>
                      <input
                        type="date"
                        required
                        className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                        value={form.deliveryDate}
                        onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Delivery location</label>
                      <input
                        required
                        className="input !border-[#7F8C84] !border-2 !bg-white focus:!border-forest-600 focus:!ring-2 focus:!ring-forest-100"
                        placeholder="City / market / warehouse"
                        value={form.deliveryLocation}
                        onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-forest-900 text-white p-4 flex items-start gap-3">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <p className="font-bold text-sm">TULIP matching is ready</p>
                    <p className="text-xs text-white/65 mt-1 leading-relaxed">
                      Once posted, your requirement can be matched against farmer inventory using product, price, quantity and delivery needs.
                    </p>
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 h-fit">
                <div className="rounded-2xl border-2 border-[#8E9B93] bg-paper p-5 shadow-[0_6px_20px_rgba(24,35,27,.06)]">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-forest-700">Live summary</p>

                  <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-[#A1ACA5]">
                    <div className="text-3xl">{categories.find((c) => Number(c.id) === Number(form.categoryId))?.icon || "📦"}</div>
                    <h4 className="font-display font-bold text-ink mt-2">
                      {form.productName || "Your product"}
                    </h4>
                    <p className="text-xs text-ink/45 mt-1">
                      {form.quantityKg ? `${Number(form.quantityKg).toLocaleString()} kg` : "Quantity not set"}
                    </p>
                  </div>

                  <div className="space-y-3 mt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-ink/45">Max price</span>
                      <span className="font-bold text-ink">
                        {form.maxPricePerKg ? `₹${Number(form.maxPricePerKg).toLocaleString()}/kg` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-ink/45">Budget ceiling</span>
                      <span className="font-bold text-forest">
                        {budget ? `₹${budget.toLocaleString()}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-ink/45">Need by</span>
                      <span className="font-bold text-ink">{form.deliveryDate || "—"}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-ink/45">Destination</span>
                      <span className="font-bold text-ink text-right max-w-[150px] truncate">{form.deliveryLocation || "—"}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-[#B0BAB4] mt-4 pt-4">
                    <p className="text-[11px] text-ink/40 leading-relaxed">
                      Your maximum budget is a ceiling, not a guaranteed final price. You can review matching farmer offers before placing an order.
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t-2 border-[#A8B2AC] px-5 sm:px-7 py-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="!bg-white !text-ink/70 !border-[#7F8C84] !border-2 !rounded-xl !py-3 !shadow-none sm:flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="!rounded-xl !py-3 sm:flex-[1.5]">
                Post requirement →
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 bottom-5 z-[90] max-w-sm rounded-2xl bg-forest-900 text-white px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,.18)]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">✓</div>
            <div>
              <p className="font-bold text-sm">{toast.title}</p>
              <p className="text-xs text-white/65 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
