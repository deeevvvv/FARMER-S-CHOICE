import React from "react";
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import api from '../utils/api';
import { logisticsLocations } from '../data/mockData';
import { StatCard, TulipBadge } from '../components/Shared';

// react-leaflet's default marker icons reference bundler-relative paths that break
// under Vite, so we point them at the CDN copies (a standard, well-known workaround).
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_COLOR = { farm: '#4F9D69', collection_center: '#E3A93F', buyer: '#8B5CF6', stop: '#4F9D69' };
const TYPE_ICON = { farm: '🌾', collection_center: '🏭', buyer: '🏬', stop: '📍' };

function markerIcon(type) {
  const color = TYPE_COLOR[type] || TYPE_COLOR.stop;
  const emoji = TYPE_ICON[type] || TYPE_ICON.stop;
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:30px;height:30px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,.25);border:2px solid white;">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

const FARM_LOCATIONS = logisticsLocations.filter((l) => l.type !== 'buyer');
const BUYER_LOCATIONS = logisticsLocations.filter((l) => l.type === 'buyer');

export default function Logistics() {
  const [overview, setOverview] = useState(null);
  const [selectedStops, setSelectedStops] = useState(FARM_LOCATIONS.slice(0, 3).map((l) => l.label));
  const [buyer, setBuyer] = useState(BUYER_LOCATIONS[0]?.label);
  const [route, setRoute] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    api.getLogisticsOverview().then(setOverview);
  }, []);

  function toggleStop(label) {
    setSelectedStops((prev) => (prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]));
  }

  async function runOptimizer() {
    const stops = FARM_LOCATIONS.filter((l) => selectedStops.includes(l.label));
    const buyerLoc = BUYER_LOCATIONS.find((l) => l.label === buyer);
    if (!stops.length || !buyerLoc) return;
    setOptimizing(true);
    try {
      const result = await api.optimizeRoute(stops, buyerLoc);
      setRoute(result);
    } finally {
      setOptimizing(false);
    }
  }

  const mapCenter = useMemo(() => {
    const lat = logisticsLocations.reduce((s, l) => s + l.latitude, 0) / logisticsLocations.length;
    const lng = logisticsLocations.reduce((s, l) => s + l.longitude, 0) / logisticsLocations.length;
    return [lat, lng];
  }, []);

  const routeLine = route?.route?.map((r) => [r.latitude, r.longitude]) || [];

  return (
    <div className="container-xl py-10">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-semibold text-ink">Logistics dashboard</h1>
        <TulipBadge size="sm" />
      </div>
      <p className="text-ink/50 text-sm mb-8">Pickup points, delivery status, and TULIP's route optimizer in one place.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active deliveries" value={overview?.activeOrders?.length ?? '—'} icon="🚚" tone="forest" />
        <StatCard label="Pickup points" value={FARM_LOCATIONS.length} icon="📍" tone="leaf" />
        <StatCard label="Total distance (last route)" value={route ? `${route.total_distance_km} km` : '—'} icon="🛣️" tone="gold" />
        <StatCard label="Est. delivery time" value={route ? `${route.estimated_minutes} min` : '—'} icon="⏱️" tone="tulip" />
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-3">Route optimizer</h3>
            <p className="text-xs text-ink/50 mb-3">Select pickup points and a buyer — TULIP will plan the most efficient collection route.</p>
            <div className="space-y-1.5 mb-4">
              {FARM_LOCATIONS.map((l) => (
                <label key={l.label} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedStops.includes(l.label)} onChange={() => toggleStop(l.label)} />
                  {TYPE_ICON[l.type]} {l.label}
                </label>
              ))}
            </div>
            <label className="label">Buyer</label>
            <select className="input mb-4" value={buyer} onChange={(e) => setBuyer(e.target.value)}>
              {BUYER_LOCATIONS.map((l) => (
                <option key={l.label} value={l.label}>{l.label}</option>
              ))}
            </select>
            <button onClick={runOptimizer} disabled={optimizing || selectedStops.length === 0} className="btn btn-tulip w-full">
              {optimizing ? 'TULIP is optimizing…' : '⚡ Optimize route with TULIP'}
            </button>

            {route && (
              <div className="mt-5 pt-5 border-t border-black/5 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-ink/50 shrink-0">Route</span>
                  <span className="font-medium text-right">{route.route.map((r) => r.label).join(' → ')}</span>
                </div>
                <div className="flex justify-between"><span className="text-ink/50">Total distance</span><span className="font-medium">{route.total_distance_km} km</span></div>
                <div className="flex justify-between"><span className="text-ink/50">Estimated time</span><span className="font-medium">{route.estimated_minutes} min</span></div>
                <div className="flex justify-between"><span className="text-ink/50">Stops</span><span className="font-medium">{route.number_of_stops}</span></div>
                <div className="flex justify-between"><span className="text-ink/50">Est. transport cost</span><span className="font-medium">₹{route.estimated_cost_inr.toLocaleString()}</span></div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold mb-3">Orders by area</h3>
            {!overview?.activeOrders?.length ? (
              <p className="text-sm text-ink/50">No active deliveries right now.</p>
            ) : (
              <div className="space-y-2">
                {overview.activeOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-sm border-b border-black/5 last:border-0 py-2">
                    <span>Order #{o.id} · {o.delivery_city}</span>
                    <span className="text-xs bg-gold-50 text-gold-600 px-2 py-0.5 rounded-full capitalize">{o.status?.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card overflow-hidden h-[600px]">
          <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {logisticsLocations.map((l) => (
              <Marker key={l.label} position={[l.latitude, l.longitude]} icon={markerIcon(l.type)}>
                <Popup>
                  <strong>{l.label}</strong><br />{l.type.replace('_', ' ')}
                </Popup>
              </Marker>
            ))}
            {routeLine.length > 1 && (
              <Polyline positions={routeLine} pathOptions={{ color: '#4F9D69', weight: 4, opacity: 0.8, dashArray: '6 6' }} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
