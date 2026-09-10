import React from "react";
export function StatCard({ label, value, sub, tone = 'forest', icon }) {
  const tones = {
    forest: 'bg-forest-50 text-forest-700',
    gold: 'bg-gold-50 text-gold-600',
    tulip: 'bg-tulip-50 text-tulip-600',
    leaf: 'bg-leaf-50 text-leaf-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-ink/50">{label}</span>
        {icon && <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${tones[tone]}`}>{icon}</span>}
      </div>
      <div className="text-2xl font-display font-semibold text-ink">{value}</div>
      {sub && <div className="text-xs text-ink/50 mt-1">{sub}</div>}
    </div>
  );
}

export function TulipBadge({ size = 'md' }) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-xs px-2.5 py-1' };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-tulip-50 text-tulip-600 font-semibold ${sizes[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-tulip-500 animate-pulse" />
      TULIP AI
    </span>
  );
}

export function DemandPill({ level }) {
  const styles = {
    HIGH: 'bg-leaf-50 text-leaf-600',
    MEDIUM: 'bg-gold-50 text-gold-600',
    LOW: 'bg-red-50 text-red-500',
  };
  const arrows = { HIGH: '↑', MEDIUM: '→', LOW: '↓' };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[level]}`}>
      {arrows[level]} {level}
    </span>
  );
}

const STATUS_LABELS = {
  pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  picked_up: 'Picked Up', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled',
};
const FLOW = ['pending', 'confirmed', 'preparing', 'picked_up', 'in_transit', 'delivered'];

export function OrderStatusTracker({ status }) {
  if (status === 'cancelled') {
    return <span className="text-sm font-medium text-red-500">Cancelled</span>;
  }
  const activeIndex = FLOW.indexOf(status);
  return (
    <div className="flex items-center w-full">
      {FLOW.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                i <= activeIndex ? 'bg-leaf-500 text-white' : 'bg-black/5 text-ink/30'
              }`}
            >
              {i < activeIndex ? '✓' : i + 1}
            </div>
            <span className={`text-[11px] text-center ${i <= activeIndex ? 'text-ink font-medium' : 'text-ink/40'}`}>
              {STATUS_LABELS[s]}
            </span>
          </div>
          {i < FLOW.length - 1 && (
            <div className={`h-0.5 flex-1 -mt-4 ${i < activeIndex ? 'bg-leaf-500' : 'bg-black/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon = '🌱', title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
      {description && <p className="text-ink/50 text-sm mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Section({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={`container-xl py-16 ${className}`}>
      {(eyebrow || title) && (
        <div className="max-w-2xl mb-10">
          {eyebrow && <div className="text-sm font-semibold text-leaf-600 mb-2">{eyebrow}</div>}
          {title && <h2 className="text-3xl font-semibold text-ink mb-3">{title}</h2>}
          {description && <p className="text-ink/60 leading-relaxed">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}