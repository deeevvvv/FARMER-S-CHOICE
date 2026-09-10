import React from "react";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '../utils/api';
import { StatCard, TulipBadge, DemandPill, EmptyState } from '../components/Shared';

const LEVELS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export default function Tulip() {
  const [forecasts, setForecasts] = useState([]);
  const [level, setLevel] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getForecasts().then((data) => {
      setForecasts(data || []);
      setLoading(false);
    });
  }, []);

  async function refresh() {
    setRefreshing(true);
    try {
      const data = await api.refreshForecasts();
      setForecasts(data || []);
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = level === 'ALL' ? forecasts : forecasts.filter((f) => f.demand_level === level);
  const highCount = forecasts.filter((f) => f.demand_level === 'HIGH').length;
  const lowCount = forecasts.filter((f) => f.demand_level === 'LOW').length;
  const chartData = forecasts.map((f) => ({
    name: f.product_name,
    Current: Number(f.current_demand_kg),
    Predicted: Number(f.predicted_demand_kg),
  }));

  if (loading) return <div className="container-xl py-20 text-center text-ink/40">Loading TULIP forecasts…</div>;

  return (
    <div className="container-xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-ink">TULIP AI Dashboard</h1>
          <TulipBadge />
        </div>
        <button onClick={refresh} disabled={refreshing} className="btn btn-tulip">
          {refreshing ? 'Recomputing…' : '⚡ Refresh forecasts'}
        </button>
      </div>
      <p className="text-ink/50 text-sm mb-8 max-w-2xl">
        Technology for Unified Logistics &amp; Intelligent Prediction — a linear-regression forecast over historical
        weekly sales, refreshed to surface which crops to grow more (or less) of next week.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Crops tracked" value={forecasts.length} icon="🌱" tone="forest" />
        <StatCard label="High demand" value={highCount} icon="📈" tone="leaf" />
        <StatCard label="Low demand" value={lowCount} icon="📉" tone="gold" />
      </div>

      {chartData.length > 0 && (
        <div className="card p-5 mb-8">
          <h3 className="font-display font-semibold mb-4">Current vs predicted demand (kg)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16211B10" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Current" fill="#4F9D6980" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Predicted" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex gap-1 mb-5">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              level === l ? 'bg-forest text-white' : 'bg-black/5 text-ink/60 hover:bg-black/10'
            }`}
          >
            {l === 'ALL' ? 'All crops' : l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No forecasts at this demand level" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <div key={f.product_name} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{f.icon || '🌾'}</span>
                  <span className="font-display font-semibold">{f.product_name}</span>
                </div>
                <DemandPill level={f.demand_level} />
              </div>
              <div className="text-xs text-ink/50 mb-1">Current: {Number(f.current_demand_kg).toLocaleString()} kg</div>
              <div className="text-lg font-display font-semibold text-ink mb-2">
                {Number(f.predicted_demand_kg).toLocaleString()} kg
                <span className={`ml-2 text-sm ${f.pct_change >= 0 ? 'text-leaf-600' : 'text-red-500'}`}>
                  {f.pct_change >= 0 ? '↑' : '↓'} {Math.abs(f.pct_change)}%
                </span>
              </div>
              <p className="text-xs text-tulip-600 bg-tulip-50 rounded-lg p-2.5 leading-relaxed">{f.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
