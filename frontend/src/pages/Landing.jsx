import React from 'react';
import { Link } from 'react-router-dom';
import { Section, TulipBadge, DemandPill } from '../components/Shared';
import { forecasts } from '../data/mockData';

const STEPS = [
  {
    number: '01',
    title: 'List your harvest',
    desc: 'Farmers and FPOs add produce, quantity, price, harvest date and location in minutes.',
  },
  {
    number: '02',
    title: 'Connect directly',
    desc: 'Consumers and bulk buyers discover available produce without unnecessary hand-offs.',
  },
  {
    number: '03',
    title: 'Plan with TULIP',
    desc: 'AI-assisted demand forecasts and route planning help coordinate the next move.',
  },
  {
    number: '04',
    title: 'Complete the delivery',
    desc: 'Pickup, consolidation and delivery are coordinated so each side can focus on its role.',
  },
];

const BENEFITS = [
  {
    icon: '₹',
    title: 'Direct price visibility',
    desc: 'See quantities, prices and buyer requirements in one transparent marketplace.',
  },
  {
    icon: '🌱',
    title: 'Farm-fresh sourcing',
    desc: 'Shorter supply chains can help move produce from farms to buyers more efficiently.',
  },
  {
    icon: '✦',
    title: 'AI-assisted decisions',
    desc: 'TULIP turns demand history into practical signals for planning supply and movement.',
  },
  {
    icon: '🚚',
    title: 'Logistics support',
    desc: 'Coordinate pickups, delivery points and routes through one connected workflow.',
  },
];

const ROLES = [
  {
    key: 'farmer',
    icon: '🌾',
    title: 'Farmer',
    eyebrow: 'Sell & manage',
    desc: 'List harvest, compare buyers, manage storage and use TULIP demand signals.',
    login: '/login/farmer',
    signup: '/register?role=farmer',
    cta: 'Farmer login',
  },
  {
    key: 'consumer',
    icon: '🛒',
    title: 'Consumer',
    eyebrow: 'Shop direct',
    desc: 'Browse fresh produce, add to cart, checkout and track farm-direct orders.',
    login: '/login/consumer',
    signup: '/register?role=consumer',
    cta: 'Consumer login',
  },
  {
    key: 'bulk',
    icon: '🏬',
    title: 'Bulk Buyer',
    eyebrow: 'Source at scale',
    desc: 'Post requirements, find matching farmers and place direct bulk orders.',
    login: '/login/bulk-buyer',
    signup: '/register?role=bulk_buyer',
    cta: 'Bulk buyer login',
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4" fill="none">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  const highDemand = forecasts.filter((f) => f.demand_level === 'HIGH').slice(0, 3);
  const featuredProducts = [
    { id: 'tomatoes', name: 'Tomatoes', price: 42, image: '/products/tomatoes.jpg' },
    { id: 'onion', name: 'Onion', price: 35, image: '/products/onion.png' },
    { id: 'grapes', name: 'Grapes', price: 95, image: '/products/grapes.jpg' },
    { id: 'ragi', name: 'Ragi', price: 68, image: '/products/ragi.jpg' },
  ];

  return (
    <main className="bg-[#F7FBF8] text-ink">
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-forest-100">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,131,59,0.14),_transparent_38%),radial-gradient(circle_at_85%_30%,_rgba(168,210,175,0.28),_transparent_30%)]" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-forest-100/60 blur-3xl" />
        <div aria-hidden="true" className="absolute -left-24 bottom-0 w-72 h-72 rounded-full bg-leaf-100/60 blur-3xl" />

        <div className="container-xl relative py-14 sm:py-18 lg:py-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 xl:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-forest-200 px-3.5 py-2 text-xs sm:text-sm font-bold text-forest-800 shadow-sm">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-forest-500" />
              AI-powered agricultural marketplace
            </div>

            <h1 id="hero-title" className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] font-black tracking-tight text-ink max-w-3xl">
              From farm to buyer,
              <span className="block text-forest-700">directly.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-ink/75 leading-relaxed">
              Farmer&apos;s Choice connects farmers and FPOs directly with consumers and bulk buyers, while TULIP helps turn demand data into smarter supply and logistics decisions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register?role=farmer"
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
                aria-label="Join Farmer's Choice as a farmer"
              >
                🌾 Join as Farmer
                <ArrowIcon />
              </Link>
              <Link
                to="/marketplace"
                className="btn inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white !text-ink border border-forest-200 hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
                aria-label="Browse the Farmer's Choice marketplace"
              >
                🛒 Browse marketplace
                <ArrowIcon />
              </Link>
            </div>

            <div className="mt-9 grid grid-cols-3 max-w-xl border-t border-forest-200 pt-6 gap-4" aria-label="Farmer's Choice highlights">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-forest-700">3</div>
                <div className="text-xs sm:text-sm text-ink/65 mt-1">role-based workspaces</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-forest-700">TULIP</div>
                <div className="text-xs sm:text-sm text-ink/65 mt-1">AI demand & route tools</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-forest-700">24/7</div>
                <div className="text-xs sm:text-sm text-ink/65 mt-1">digital marketplace access</div>
              </div>
            </div>
          </div>

          {/* Hero product / AI preview */}
          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-forest-200/70 via-white to-leaf-100/70 blur-xl" />
            <div className="relative bg-white rounded-[2rem] border border-forest-200 shadow-[0_24px_70px_rgba(22,131,59,.15)] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-forest-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-ink/50 font-bold">Live marketplace view</div>
                  <div className="mt-1 text-xl font-black text-ink">Today&apos;s demand signals</div>
                </div>
                <TulipBadge />
              </div>

              <div className="p-5 sm:p-6 space-y-3">
                {highDemand.map((f) => (
                  <div key={f.product_name} className="rounded-2xl border border-forest-100 bg-forest-50/70 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-forest-100 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
                        {f.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-ink truncate">{f.product_name}</div>
                        <div className="text-xs sm:text-sm text-ink/60 mt-1">
                          {f.current_demand_kg.toLocaleString()} kg → {f.predicted_demand_kg.toLocaleString()} kg predicted
                        </div>
                      </div>
                    </div>
                    <DemandPill level={f.demand_level} />
                  </div>
                ))}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-forest-100 px-4 py-4 text-ink border border-forest-200">
                    <div className="text-xs uppercase tracking-wider text-ink/55">Supply signal</div>
                    <div className="mt-1 text-lg font-black">Plan ahead</div>
                  </div>
                  <div className="rounded-2xl bg-forest-100 px-4 py-4 text-ink">
                    <div className="text-xs uppercase tracking-wider text-ink/55">Route support</div>
                    <div className="mt-1 text-lg font-black text-forest-800">Optimized</div>
                  </div>
                </div>

                <Link
                  to="/tulip"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-forest-900 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-100 rounded"
                >
                  Explore the TULIP dashboard
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role entry */}
      <section aria-labelledby="roles-title" className="relative border-b border-forest-100 bg-[#EAF6EC]">
        <div className="container-xl py-14 sm:py-18">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full bg-white border border-forest-200 px-3 py-1 text-[11px] font-black text-forest-800 tracking-[0.16em]">
                GET STARTED
              </div>
              <h2 id="roles-title" className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-ink mt-4">
                One platform. Three clear ways in.
              </h2>
              <p className="text-base sm:text-lg text-ink/70 mt-3 max-w-xl">
                Choose the workspace that matches what you do, with a dedicated dashboard after login.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-bold text-forest-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-100 rounded w-fit"
            >
              Create a new account
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ROLES.map((role) => (
              <article
                key={role.key}
                className="group bg-white rounded-[1.75rem] border border-forest-200 p-6 sm:p-7 shadow-[0_10px_30px_rgba(24,35,27,.06)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,131,59,.12)] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-3xl" aria-hidden="true">
                    {role.icon}
                  </div>
                  <span className="rounded-full bg-forest-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-forest-800">
                    {role.eyebrow}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-ink mt-6">{role.title}</h3>
                <p className="text-sm sm:text-base text-ink/70 leading-relaxed mt-2 min-h-[72px]">{role.desc}</p>

                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <Link
                    to={role.login}
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-forest-100 !text-ink border border-forest-200 font-bold px-4 py-3 hover:bg-forest-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200 transition"
                    aria-label={`Log in as ${role.title}`}
                  >
                    {role.cta}
                  </Link>
                  <Link
                    to={role.signup}
                    className="inline-flex items-center justify-center rounded-xl border border-forest-200 bg-white !text-forest-800 font-bold px-4 py-3 hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-100 transition"
                    aria-label={`Sign up as ${role.title}`}
                  >
                    Sign up
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <Section eyebrow="Marketplace" title="See what the buying experience looks like" className="!bg-white">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
          <div className="rounded-[1.75rem] border border-forest-100 bg-[#F7FBF8] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-ink/45 font-bold">Featured produce</div>
                <div className="text-xl font-black mt-1 text-ink">Fresh listings from farmers</div>
              </div>
              <Link to="/marketplace" className="text-sm font-bold text-forest-800 underline underline-offset-4">View all</Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to="/marketplace"
                  className="group bg-white rounded-2xl border border-forest-100 overflow-hidden hover:border-forest-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-100"
                  aria-label={`Open marketplace to view ${product.name}`}
                >
                  <div className="h-32 bg-forest-50 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-ink truncate">{product.name}</div>
                    <div className="text-xs text-ink/55 mt-1">Farm-fresh listing</div>
                    <div className="flex items-center justify-between mt-3 gap-3">
                      <span className="font-black text-forest-800">₹{product.price}/kg</span>
                      <span className="text-xs font-bold text-ink/55">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#E2F1E4] text-ink border border-forest-200 p-7 sm:p-8 flex flex-col justify-between shadow-[0_18px_50px_rgba(22,131,59,.10)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-forest-200 px-3 py-1.5 text-xs font-bold text-forest-900">
                <span aria-hidden="true">✦</span> TULIP intelligence
              </div>
              <h3 className="text-3xl font-black mt-5 text-ink">Make the next move with better information.</h3>
              <p className="mt-4 text-ink/75 leading-relaxed">
                Use demand trends, supply signals and route planning together instead of managing each step separately.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {[
                'Demand forecasting from historical sales data',
                'Supply-to-buyer matching',
                'Route planning across pickup points',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-white border border-forest-100 px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 font-bold" aria-hidden="true">✓</span>
                  <span className="text-sm sm:text-base text-ink/85">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/tulip"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-forest-100 !text-ink border border-forest-200 font-black px-4 py-3 hover:bg-forest-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
            >
              Explore TULIP AI
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </Section>

      {/* Problem / solution */}
      <section aria-labelledby="problem-title" className="border-y border-forest-100 bg-[#F1F8F2]">
        <div className="container-xl py-14 sm:py-18">
          <div className="max-w-2xl mb-9">
            <div className="text-xs uppercase tracking-[0.18em] text-forest-700 font-black">Why Farmer&apos;s Choice</div>
            <h2 id="problem-title" className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-3 text-ink">
              A simpler supply chain, built around the people using it.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <article className="bg-white rounded-[1.75rem] border border-black/5 p-6 sm:p-7 shadow-sm">
              <div className="text-sm font-black text-ink/50 uppercase tracking-wider">Traditional flow</div>
              <h3 className="text-2xl font-black mt-2 text-ink">More hand-offs, less visibility</h3>
              <p className="text-ink/70 leading-relaxed mt-3">
                Produce can pass through several parties before reaching a buyer, making price and demand information harder to see in one place.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Traditional supply chain">
                {['Farmer', 'Trader', 'Wholesaler', 'Distributor', 'Retailer', 'Buyer'].map((s, i, arr) => (
                  <React.Fragment key={s}>
                    <span className="px-3 py-1.5 rounded-full bg-ink/5 text-xs font-bold text-ink">{s}</span>
                    {i < arr.length - 1 && <span aria-hidden="true" className="text-ink/35">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </article>

            <article className="bg-white rounded-[1.75rem] border border-forest-200 p-6 sm:p-7 shadow-sm">
              <div className="text-sm font-black text-forest-700 uppercase tracking-wider">Farmer&apos;s Choice</div>
              <h3 className="text-2xl font-black mt-2 text-ink">Direct access + coordinated tools</h3>
              <p className="text-ink/70 leading-relaxed mt-3">
                Farmers and buyers connect on one platform, while logistics support and TULIP help coordinate the work around each transaction.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Farmer's Choice flow">
                <span className="px-3 py-1.5 rounded-full bg-forest-100 text-xs font-bold text-forest-900">Farmer / FPO</span>
                <span aria-hidden="true" className="text-forest-500">↔</span>
                <span className="px-3 py-1.5 rounded-full bg-forest-100 text-ink border border-forest-200 text-xs font-bold">Farmer&apos;s Choice</span>
                <span aria-hidden="true" className="text-forest-500">↔</span>
                <span className="px-3 py-1.5 rounded-full bg-forest-100 text-xs font-bold text-forest-900">Buyer</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section eyebrow="How it works" title="From harvest to delivery, in four clear steps" className="!bg-white">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {STEPS.map((step) => (
            <article key={step.number} className="bg-[#F7FBF8] rounded-[1.5rem] border border-forest-100 p-6">
              <div className="text-sm font-black text-forest-700 tracking-widest">{step.number}</div>
              <div className="w-10 h-1 bg-forest-200 rounded-full mt-3" aria-hidden="true" />
              <h3 className="text-xl font-black text-ink mt-5">{step.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed mt-2">{step.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section eyebrow="What you get" title="Useful tools without a complicated workflow" className="!bg-[#F7FBF8]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="bg-white rounded-[1.5rem] border border-forest-100 p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-2xl font-black text-forest-800" aria-hidden="true">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-black text-ink mt-5">{benefit.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed mt-2">{benefit.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section aria-labelledby="cta-title" className="relative overflow-hidden bg-[#E2F1E4] border-t border-forest-200">
        <div aria-hidden="true" className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_15%_20%,_white,_transparent_22%),radial-gradient(circle_at_85%_80%,_#A9D5AF,_transparent_24%)]" />
        <div className="container-xl relative py-16 sm:py-20 text-center">
          <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            Ready to get closer to the source?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-ink/75 text-base sm:text-lg leading-relaxed">
            Start as a farmer, shop as a consumer, or source at scale as a bulk buyer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/login/farmer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-100 !text-ink border border-forest-200 font-black px-5 py-3.5 hover:bg-forest-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
            >
              Farmer login
              <ArrowIcon />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white !text-ink border border-forest-200 font-black px-5 py-3.5 hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200"
            >
              Browse produce
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
