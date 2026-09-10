import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/Shared';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-xl py-10">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Browse the marketplace to find fresh produce from local farmers."
          action={<Link to="/marketplace" className="btn btn-primary">Go to Marketplace</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-xl py-10 grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink mb-6">Your Cart</h1>
        <div className="space-y-3">
          {items.map(({ product, quantityKg }) => (
            <div key={product.id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-leaf-50 flex items-center justify-center text-3xl shrink-0">
                {product.image_url?.length <= 4 ? product.image_url : '🌿'}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ink">{product.name}</h3>
                <p className="text-xs text-ink/50">by {product.farmer_name} · ₹{product.price_per_kg}/kg</p>
              </div>
              <div className="flex items-center border border-black/10 rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(product.id, Math.max(1, quantityKg - 1))} className="px-2.5 py-1.5 hover:bg-black/5">−</button>
                <span className="w-10 text-center text-sm">{quantityKg}</span>
                <button onClick={() => updateQuantity(product.id, quantityKg + 1)} className="px-2.5 py-1.5 hover:bg-black/5">+</button>
              </div>
              <div className="w-20 text-right font-medium">₹{(quantityKg * product.price_per_kg).toLocaleString()}</div>
              <button onClick={() => removeItem(product.id)} className="text-red-500 text-xs font-medium">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 h-fit">
        <h3 className="font-display font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between text-sm mb-2"><span className="text-ink/50">Subtotal</span><span>₹{total.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm mb-2"><span className="text-ink/50">Logistics fee</span><span>₹{Math.round(total * 0.05).toLocaleString()}</span></div>
        <div className="flex justify-between font-semibold text-base pt-3 border-t border-black/5 mb-5">
          <span>Total</span><span>₹{(total + Math.round(total * 0.05)).toLocaleString()}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full">Proceed to Checkout</button>
      </div>
    </div>
  );
}