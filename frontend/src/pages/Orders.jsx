import React from "react";
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { OrderStatusTracker, EmptyState } from '../components/Shared';
import { ORDER_STATUS_FLOW } from '../data/mockData';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.getMyOrders().then((data) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  const canAdvance = user?.role === 'farmer' || user?.role === 'admin';

  function nextStatus(status) {
    const idx = ORDER_STATUS_FLOW.indexOf(status);
    return idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[idx + 1] : null;
  }

  async function advance(order) {
    const next = nextStatus(order.status);
    if (!next) return;
    setUpdating(order.id);
    try {
      await api.updateOrderStatus(order.id, next).catch(() => {});
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status);
    return o.status === filter;
  });

  if (loading) return <div className="container-xl py-20 text-center text-ink/40">Loading orders…</div>;

  return (
    <div className="container-xl py-10">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {user?.role === 'farmer' ? 'Orders to fulfil' : user?.role === 'admin' ? 'All platform orders' : 'Your orders'}
          </h1>
          <p className="text-ink/50 text-sm mt-1">Track every order from pending through to delivery.</p>
        </div>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-forest text-white' : 'bg-black/5 text-ink/60 hover:bg-black/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📦" title="No orders here yet" description="Orders will show up here as they come in." />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-semibold text-ink">Order #{order.id}</span>
                    {order.buyer_type && (
                      <span className="text-xs bg-forest-50 text-forest px-2 py-0.5 rounded-full capitalize">
                        {order.buyer_type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50">
                    {order.buyer_name && <>for {order.buyer_name} · </>}
                    {order.delivery_city} · placed {order.created_at}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display font-semibold text-forest">₹{Number(order.total_amount).toLocaleString()}</div>
                  {order.items?.length > 0 && (
                    <div className="text-xs text-ink/50">
                      {order.items.map((i) => `${i.product_name} (${i.quantity_kg}kg)`).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <OrderStatusTracker status={order.status} />

              {canAdvance && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => advance(order)}
                    disabled={updating === order.id}
                    className="btn btn-primary !py-1.5 !px-4 text-sm"
                  >
                    {updating === order.id ? 'Updating…' : `Mark as ${nextStatus(order.status)?.replace('_', ' ')}`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
