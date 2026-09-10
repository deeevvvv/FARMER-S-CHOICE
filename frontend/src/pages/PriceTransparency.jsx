import React from "react";
import { Section } from '../components/Shared';
import { priceComparison } from '../data/mockData';

const TRADITIONAL_SEGMENTS = [
  { key: 'farmer', label: 'Farmer earnings', color: '#4F9D69' },
  { key: 'trader', label: 'Trader', color: '#E3A93F' },
  { key: 'wholesaler', label: 'Wholesaler', color: '#D97757' },
  { key: 'distributor', label: 'Distributor', color: '#8B5CF6' },
  { key: 'retailer', label: 'Retailer', color: '#EF4444' },
];

const FC_SEGMENTS = [
  { key: 'farmer', label: 'Farmer earnings', color: '#4F9D69' },
  { key: 'logistics', label: "Farmer's Choice logistics", color: '#E3A93F' },
];

function StackedBar({ data, segments, total }) {
  return (
    <div>
      <div className="h-10 rounded-lg overflow-hidden flex w-full border border-black/5">
        {segments.map((s) => (
          <div
            key={s.key}
            style={{ width: `${(data[s.key] / total) * 100}%`, backgroundColor: s.color }}
            title={`${s.label}: ₹${data[s.key]}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-ink/60">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            {s.label} · ₹{data[s.key]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PriceTransparency() {
  const { traditional, farmersChoice } = priceComparison;
  const farmerShareTraditional = Math.round((traditional.farmer / traditional.consumerPrice) * 100);
  const farmerShareFC = Math.round((farmersChoice.farmer / farmersChoice.consumerPrice) * 100);
  const consumerSavingsPct = Math.round(((traditional.consumerPrice - farmersChoice.consumerPrice) / traditional.consumerPrice) * 100);
  const farmerEarningsUpliftPct = Math.round(((farmersChoice.farmer - traditional.farmer) / traditional.farmer) * 100);

  return (
    <div>
      <Section
        eyebrow="Price transparency"
        title="See exactly where every rupee goes"
        description="A real per-kilogram breakdown comparing the traditional supply chain against Farmer's Choice — same crop, same market, very different outcomes."
      >
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="card p-5 text-center bg-leaf-50/40">
            <div className="text-3xl font-display font-semibold text-forest">+{farmerEarningsUpliftPct}%</div>
            <div className="text-sm text-ink/60 mt-1">More earnings for the farmer, per kg</div>
          </div>
          <div className="card p-5 text-center bg-gold-50/40">
            <div className="text-3xl font-display font-semibold text-gold-600">-{consumerSavingsPct}%</div>
            <div className="text-sm text-ink/60 mt-1">Lower price for the consumer, per kg</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <h3 className="font-display font-semibold text-ink">Traditional supply chain</h3>
              <span className="text-xs text-ink/40">Farmer → Trader → Wholesaler → Distributor → Retailer → Consumer</span>
            </div>
            <p className="text-xs text-ink/50 mb-5">Farmer keeps {farmerShareTraditional}% of the final price</p>
            <StackedBar data={traditional} segments={TRADITIONAL_SEGMENTS} total={traditional.consumerPrice} />
            <div className="flex justify-between items-baseline mt-5 pt-5 border-t border-black/5">
              <span className="text-sm text-ink/50">Consumer pays</span>
              <span className="text-2xl font-display font-semibold text-ink">
                ₹{traditional.consumerPrice}<span className="text-sm text-ink/40">/kg</span>
              </span>
            </div>
          </div>

          <div className="card p-6 border-leaf-500/30 bg-leaf-50/30">
            <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
              <h3 className="font-display font-semibold text-forest">Farmer's Choice</h3>
              <span className="text-xs text-ink/40">Farmer → Farmer's Choice → Consumer</span>
            </div>
            <p className="text-xs text-ink/50 mb-5">Farmer keeps {farmerShareFC}% of the final price</p>
            <StackedBar data={farmersChoice} segments={FC_SEGMENTS} total={farmersChoice.consumerPrice} />
            <div className="flex justify-between items-baseline mt-5 pt-5 border-t border-black/5">
              <span className="text-sm text-ink/50">Consumer pays</span>
              <span className="text-2xl font-display font-semibold text-forest">
                ₹{farmersChoice.consumerPrice}<span className="text-sm text-ink/40">/kg</span>
              </span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
