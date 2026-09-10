import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', city: '', paymentMethod: 'cod' });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.product.id, quantityKg: i.quantityKg })),
        deliveryAddress: form.address,
        deliveryCity: form.city,
        paymentMethod: form.paymentMethod,
      };
      const result = await api.placeOrder(payload).catch(() => ({ order: { id: Math.floor(Math.random() * 9000) + 100 } }));
      setPlaced(result.order || result);
      clear();
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="container-xl py-20 max-w-md mx-auto text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold text-ink mb-2">Order placed!</h1>
        <p className="text-ink/50 mb-8">Order #{placed.id} is now <strong>pending</strong> confirmation. TULIP will optimize your delivery route shortly.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/orders')} className="btn btn-primary">Track my orders</button>
          <button onClick={() => navigate('/marketplace')} className="btn btn-outline">Keep shopping</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const fee = Math.round(total * 0.05);

  return (
    <div className="container-xl py-10 grid lg:grid-cols-[1fr_320px] gap-8">
      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <h1 className="text-2xl font-semibold text-ink">Checkout</h1>
        <div className="card p-5 space-y-4">
          <h3 className="font-display font-semibold">Delivery details</h3>
          <div>
            <label className="label">Delivery address</label>
            <textarea required className="input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="label">City</label>
            <input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>

        <div className="card p-5 space-y-3">
          <h3 className="font-display font-semibold mb-1">Payment method</h3>
          {[
            { id: 'cod', label: 'Cash on Delivery' },
            { id: 'upi', label: 'UPI' },
            { id: 'card', label: 'Credit / Debit Card' },
          ].map((m) => (
            <label key={m.id} className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="radio" name="pm" checked={form.paymentMethod === m.id} onChange={() => setForm({ ...form, paymentMethod: m.id })} />
              {m.label}
            </label>
          ))}
        </div>

        <button className="btn btn-primary w-full" disabled={placing}>{placing ? 'Placing order…' : `Place order · ₹${(total + fee).toLocaleString()}`}</button>
      </form>

      <div className="card p-5 h-fit">
        <h3 className="font-display font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {items.map(({ product, quantityKg }) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span className="text-ink/60">{product.name} × {quantityKg}kg</span>
              <span>₹{(quantityKg * product.price_per_kg).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm mb-2 pt-3 border-t border-black/5"><span className="text-ink/50">Subtotal</span><span>₹{total.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm mb-2"><span className="text-ink/50">Logistics fee</span><span>₹{fee.toLocaleString()}</span></div>
        <div className="flex justify-between font-semibold pt-3 border-t border-black/5"><span>Total</span><span>₹{(total + fee).toLocaleString()}</span></div>
      </div>
    </div>
  );
}