import React from "react";
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('fc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fc_cart', JSON.stringify(items));
  }, [items]);

  function addItem(product, quantityKg) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantityKg: i.quantityKg + quantityKg } : i));
      }
      return [...prev, { product, quantityKg }];
    });
  }

  function updateQuantity(productId, quantityKg) {
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantityKg } : i)));
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.quantityKg * i.product.price_per_kg, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}