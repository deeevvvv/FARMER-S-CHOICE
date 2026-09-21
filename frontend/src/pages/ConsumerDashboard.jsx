import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../utils/api";

const QUICK_LINKS = [
  { to: "/marketplace", icon: "🥬", title: "Shop fresh produce", desc: "Browse directly from farmers" },
  { to: "/cart", icon: "🛒", title: "Open your cart", desc: "Review items before checkout" },
  { to: "/orders", icon: "📦", title: "Track orders", desc: "See status and delivery updates" },
];

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const { count } = useCart();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getMyOrders().then((data) => setOrders(Array.isArray(data) ? data.slice(0, 4) : []));
  }, []);

  const spent = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || order.total || 0),
    0
  );

  return (
    <div className="container-xl py-8 sm:py-10">
      <section className="rounded-[30px] bg-gradient-to-br from-forest-50 via-white to-leaf-50 border border-forest-100 p-6 sm:p-8 shadow-[0_10px_35px_rgba(22,131,59,.06)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Consumer dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-ink mt-2">
              Welcome, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-sm sm:text-base text-ink/55 mt-2 max-w-2xl">
              Everything you need to discover fresh produce, manage your cart and keep track of your direct-from-farm orders.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center rounded-xl bg-forest-600 text-white font-bold px-5 py-3.5 hover:bg-forest-700 transition-all"
          >
            Shop now →
          </Link>
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/35">Cart items</p>
          <p className="text-3xl font-display font-extrabold text-ink mt-2">{count}</p>
          <p className="text-sm text-ink/45 mt-1">Ready for checkout</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/35">Recent orders</p>
          <p className="text-3xl font-display font-extrabold text-ink mt-2">{orders.length}</p>
          <p className="text-sm text-ink/45 mt-1">Latest activity</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/35">Tracked value</p>
          <p className="text-3xl font-display font-extrabold text-forest mt-2">₹{spent.toLocaleString()}</p>
          <p className="text-sm text-ink/45 mt-1">From recent orders</p>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Quick actions</p>
            <h2 className="font-display font-extrabold text-xl text-ink mt-1">Your shortcuts</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card p-5 group hover:-translate-y-0.5 hover:shadow-green-md transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-ink mt-4">{item.title}</h3>
              <p className="text-sm text-ink/50 mt-1">{item.desc}</p>
              <span className="inline-flex mt-4 text-sm font-bold text-forest">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Latest activity</p>
              <h2 className="font-display font-extrabold text-xl text-ink mt-1">Recent orders</h2>
            </div>
            <Link to="/orders" className="text-sm font-bold text-forest">View all →</Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-forest-50/60 p-5 text-sm text-ink/55">
              No recent orders yet. Start by browsing today's harvest.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id || order.order_id} className="rounded-2xl border border-black/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-ink text-sm">
                        Order #{order.order_id || order.id}
                      </p>
                      <p className="text-xs text-ink/45 mt-1">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent order"}
                      </p>
                    </div>
                    <span className="text-xs font-bold rounded-full bg-forest-50 text-forest px-2.5 py-1 capitalize">
                      {String(order.status || "pending").replaceAll("_", " ")}
                    </span>
                  </div>
                  {order.total_amount || order.total ? (
                    <p className="text-sm font-bold text-forest mt-3">
                      ₹{Number(order.total_amount || order.total).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 bg-forest-900 text-white">
          <div className="text-2xl">🌱</div>
          <p className="text-xs font-bold uppercase tracking-widest text-leaf-200 mt-4">Why Farmer's Choice?</p>
          <h2 className="font-display font-extrabold text-2xl mt-2">Buy closer to the farm.</h2>
          <p className="text-sm text-white/65 mt-3 leading-relaxed">
            Find produce listed directly by farmers and FPOs, with transparent prices and a shorter route from harvest to your kitchen.
          </p>
          <Link
            to="/price-transparency"
            className="inline-flex mt-6 rounded-xl bg-white text-forest-900 font-bold px-4 py-3 text-sm"
          >
            See price transparency →
          </Link>
        </div>
      </section>
    </div>
  );
}
