import React from "react";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';
import { StatCard, TulipBadge, EmptyState } from '../components/Shared';

const PIE_COLORS = ['#4F9D69', '#E3A93F', '#8B5CF6', '#EF4444', '#22C55E', '#3B82F6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getAdminStats().then(setStats);
  }, []);

  if (!stats) return <div className="container-xl py-20 text-center text-ink/40">Loading platform analytics…</div>;

  const orderTrend = [...(stats.orderTrend || [])].reverse();

  return (
    <div className="container-xl py-10">
      <h1 className="text-2xl font-semibold text-ink mb-1">Admin dashboard</h1>
      <p className="text-ink/50 text-sm mb-8">Platform-wide metrics across farmers, buyers, orders and TULIP.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Farmers" value={stats.totalFarmers} icon="🌾" tone="forest" />
        <StatCard label="Consumers" value={stats.totalConsumers} icon="🛒" tone="leaf" />
        <StatCard label="Bulk buyers" value={stats.totalBulkBuyers} icon="🏬" tone="gold" />
        <StatCard label="Products listed" value={stats.totalProducts} icon="📦" tone="tulip" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total orders" value={stats.totalOrders} icon="🧾" tone="forest" />
        <StatCard label="Platform revenue" value={`₹${Number(stats.totalRevenue).toLocaleString()}`} icon="💰" tone="gold" />
        <StatCard label="Active deliveries" value={stats.activeDeliveries} icon="🚚" tone="leaf" />
        <StatCard label="High-demand crops" value={stats.highDemandCrops} icon="📈" tone="tulip" />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 mb-8">
        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Orders &amp; revenue trend</h3>
          {orderTrend.length === 0 ? (
            <p className="text-sm text-ink/50 py-10 text-center">No order history yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#16211B10" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="#4F9D6980" name="Orders" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#E3A93F" strokeWidth={2.5} name="Revenue (₹)" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">TULIP analytics</h3>
            <TulipBadge size="sm" />
          </div>
          <p className="text-sm text-ink/60 leading-relaxed mb-4">
            TULIP is currently flagging <strong>{stats.highDemandCrops}</strong> crop{stats.highDemandCrops === 1 ? '' : 's'} as
            HIGH demand this week, and there {stats.activeDeliveries === 1 ? 'is' : 'are'} <strong>{stats.activeDeliveries}</strong> deliver{stats.activeDeliveries === 1 ? 'y' : 'ies'} in
            progress across the logistics network.
          </p>
          <div className="flex gap-2">
            <Link to="/tulip" className="btn btn-tulip flex-1 text-center !py-2 text-sm">View forecasts</Link>
            <Link to="/logistics" className="btn btn-outline flex-1 text-center !py-2 text-sm">View logistics</Link>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-semibold mb-4">Products by category</h3>
        {!stats.topCategories?.length ? (
          <EmptyState title="No product data yet" />
        ) : (
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.topCategories} dataKey="product_count" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {stats.topCategories.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {stats.topCategories.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between text-sm border-b border-black/5 last:border-0 py-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {c.name}
                  </span>
                  <span className="text-ink/50">{c.product_count} products · {Number(c.total_kg).toLocaleString()} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
