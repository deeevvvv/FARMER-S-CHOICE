import React from "react";
export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-forest-900 text-white/70 mt-24">
      <div className="container-xl py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌾</span>
            <span className="font-display font-semibold text-white">Farmer's Choice</span>
          </div>
          <p className="text-white/50 leading-relaxed">From Farm to Buyer, Directly.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Platform</h4>
          <ul className="space-y-2">
            <li>Marketplace</li>
            <li>TULIP AI</li>
            <li>Logistics</li>
            <li>Price Transparency</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">For</h4>
          <ul className="space-y-2">
            <li>Farmers &amp; FPOs</li>
            <li>Consumers</li>
            <li>Bulk Buyers</li>
            <li>Admin</li>
          </ul>
        </div>
        <div>
    
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © 2026 Farmer's Choice. Sample data used for demonstration.
      </div>
    </footer>
  );
}