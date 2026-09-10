import React from "react";
import { Link } from "react-router-dom";
import { Section, TulipBadge, DemandPill } from "../components/Shared";
import { forecasts } from "../data/mockData";

const STEPS = [
  {
    title: "Farmer lists produce",
    desc: "Farmers and FPOs add crops with quantity, price, harvest date and location in minutes.",
  },
  {
    title: "Buyers discover it directly",
    desc: "Consumers and bulk buyers browse the marketplace with no trader mark-ups in between.",
  },
  {
    title: "TULIP optimizes logistics",
    desc: "Our AI groups pickups by area and plans the most efficient delivery route to the buyer.",
  },
  {
    title: "Farmer gets paid more, faster",
    desc: "By cutting out 4-5 intermediaries, more of the final price reaches the farmer.",
  },
];

const BENEFITS = [
  {
    icon: "💰",
    title: "Better prices for farmers",
    desc: "Sell closer to retail price instead of losing margin to a chain of traders.",
  },
  {
    icon: "🥬",
    title: "Fresher produce for buyers",
    desc: "Shorter supply chains mean less time between harvest and your kitchen.",
  },
  {
    icon: "🧠",
    title: "AI-driven decisions",
    desc: "TULIP forecasts demand and plans routes so nothing is wasted or delayed.",
  },
  {
    icon: "🚚",
    title: "Managed logistics",
    desc: "Pickup, consolidation and delivery are coordinated for you, end to end.",
  },
];

export default function Landing() {
  const highDemand = forecasts
    .filter((f) => f.demand_level === "HIGH")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#EAF6EC] text-black">

      {/* =========================================
          HERO SECTION
          ========================================= */}

      <section className="relative overflow-hidden bg-[#EAF6EC]">

        <div className="absolute inset-0 bg-gradient-to-br from-[#E2F2E5] via-[#EAF6EC] to-[#DDF1E1] -z-10" />

        <div className="container-xl pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">

          {/* Hero Text */}

          <div>

            <div className="inline-flex items-center gap-2 bg-white/70 border border-black/5 rounded-full px-3.5 py-1.5 text-xs font-medium text-black mb-6">
              🇮🇳 An AI-powered agricultural marketplace
            </div>

            <h1 className="text-5xl leading-[1.08] font-semibold text-black mb-6">
              From Farm to Buyer,
              <br />
              <span className="text-[#16833B]">
                Directly.
              </span>
            </h1>

            <p className="text-lg text-black leading-relaxed mb-8 max-w-lg">
              Farmer's Choice connects farmers and FPOs straight to consumers
              and bulk buyers — cutting out unnecessary middlemen and using
              TULIP, our AI engine, to forecast demand and plan deliveries.
            </p>

            <div className="flex flex-wrap gap-3">

              <Link
                to="/register?role=farmer"
                className="btn btn-primary"
              >
                🌾 Join as Farmer
              </Link>

              <Link
                to="/marketplace"
                className="btn btn-gold"
              >
                🛒 Buy Produce
              </Link>

            </div>

            {/* Statistics */}

            <div className="flex gap-8 mt-10">

              <div>
                <div className="text-2xl font-display font-semibold text-[#16833B]">
                  5
                </div>

                <div className="text-xs text-black">
                  Intermediaries removed
                </div>
              </div>

              <div>
                <div className="text-2xl font-display font-semibold text-[#16833B]">
                  ~35%
                </div>

                <div className="text-xs text-black">
                  More earnings for farmers
                </div>
              </div>

              <div>
                <div className="text-2xl font-display font-semibold text-[#16833B]">
                  24/7
                </div>

                <div className="text-xs text-black">
                  TULIP AI monitoring
                </div>
              </div>

            </div>

          </div>


          {/* Demand Signals Card */}

          <div className="card p-5 bg-white">

            <div className="flex items-center justify-between mb-4">

              <span className="font-display font-semibold text-black">
                Today's demand signals
              </span>

              <TulipBadge />

            </div>

            <div className="space-y-3">

              {highDemand.map((f) => (

                <div
                  key={f.product_name}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#E8F5E9]"
                >

                  <div className="flex items-center gap-3">

                    <span className="text-2xl">
                      {f.icon}
                    </span>

                    <div>

                      <div className="font-medium text-black text-sm">
                        {f.product_name}
                      </div>

                      <div className="text-xs text-black">
                        {f.current_demand_kg.toLocaleString()} kg →{" "}
                        {f.predicted_demand_kg.toLocaleString()} kg
                      </div>

                    </div>

                  </div>

                  <DemandPill level={f.demand_level} />

                </div>

              ))}

            </div>

            <Link
              to="/tulip"
              className="block text-center text-sm font-medium text-[#16833B] mt-4 hover:underline"
            >
              See the full TULIP dashboard →
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================
          PROBLEM / SOLUTION
          ========================================= */}

      <Section
        eyebrow="The problem"
        title="Farmers earn the least in a chain built for everyone else"
      >

        <div className="grid md:grid-cols-2 gap-6">

          {/* Today */}

          <div className="card p-6 bg-white">

            <h3 className="font-display font-semibold mb-3 text-black">
              Today
            </h3>

            <p className="text-black text-sm leading-relaxed mb-4">
              Produce typically passes through a trader, a wholesaler, a
              distributor and a retailer before reaching a buyer — each one
              taking a cut. Farmers often see only a fraction of the final
              price, while demand signals travel too slowly for anyone to
              plan around.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-black">

              {[
                "Farmer",
                "Trader",
                "Wholesaler",
                "Distributor",
                "Retailer",
                "Consumer",
              ].map((s, i, arr) => (

                <span
                  key={s}
                  className="flex items-center gap-2"
                >

                  <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-black">
                    {s}
                  </span>

                  {i < arr.length - 1 && (
                    <span className="text-[#16833B]">
                      →
                    </span>
                  )}

                </span>

              ))}

            </div>

          </div>


          {/* Farmer's Choice */}

          <div className="card p-6 bg-[#F3FAF4] border-[#9BCFA3]">

            <h3 className="font-display font-semibold mb-3 text-[#16833B]">
              With Farmer's Choice
            </h3>

            <p className="text-black text-sm leading-relaxed mb-4">
              We connect farmers directly with buyers, handle logistics as a
              service, and let TULIP forecast demand so farmers know what to
              grow and sell more of — before it's too late.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">

              {[
                "Farmer",
                "Farmer's Choice",
                "Consumer",
              ].map((s, i, arr) => (

                <span
                  key={s}
                  className="flex items-center gap-2"
                >

                  <span className="px-2.5 py-1 rounded-full bg-[#16833B] text-white">
                    {s}
                  </span>

                  {i < arr.length - 1 && (
                    <span className="text-[#16833B]">
                      →
                    </span>
                  )}

                </span>

              ))}

            </div>

          </div>

        </div>

      </Section>


      {/* =========================================
          HOW IT WORKS
          ========================================= */}

      <Section
        eyebrow="How it works"
        title="Four steps from harvest to your doorstep"
        className="bg-[#E2F2E5] !max-w-none"
      >

        <div className="container-xl !px-0 grid md:grid-cols-4 gap-6">

          {STEPS.map((s, i) => (

            <div
              key={s.title}
              className="card p-5 bg-white"
            >

              <div className="w-9 h-9 rounded-lg bg-[#16833B] text-white flex items-center justify-center font-display font-semibold mb-4">
                {i + 1}
              </div>

              <h3 className="font-display font-semibold text-black mb-2">
                {s.title}
              </h3>

              <p className="text-sm text-black leading-relaxed">
                {s.desc}
              </p>

            </div>

          ))}

        </div>

      </Section>


      {/* =========================================
          TULIP AI SECTION
          ========================================= */}

      <Section>

        <div className="card bg-[#EAF6EC] border border-[#CFE3D2] p-10 grid lg:grid-cols-2 gap-10 items-center overflow-hidden relative">

          {/* TULIP Information */}

          <div>

            <TulipBadge />

            <h2 className="text-3xl font-semibold mt-4 mb-4 text-black">
              Meet TULIP — the intelligence behind every decision
            </h2>

            <p className="text-black leading-relaxed mb-6">
              TULIP (Technology for Unified Logistics &amp; Intelligent
              Prediction) is the AI engine that powers Farmer's Choice:
              forecasting demand, matching supply to buyers, and planning
              delivery routes across scattered pickup points.
            </p>

            <ul className="space-y-3 text-sm">

              {[
                "Agricultural demand forecasting",
                "Demand trend analysis",
                "Supply–demand matching",
                "Delivery route optimization",
                "Data-driven recommendations for farmers",
              ].map((f) => (

                <li
                  key={f}
                  className="flex items-center gap-2 text-black"
                >

                  <span className="w-2 h-2 rounded-full bg-[#16833B]" />

                  {f}

                </li>

              ))}

            </ul>

            <Link
              to="/tulip"
              className="btn btn-primary mt-7"
            >
              Explore TULIP AI dashboard
            </Link>

          </div>


          {/* Example Forecast */}

          <div className="bg-white rounded-xl p-5 border border-[#CFE3D2] shadow-sm">

            <div className="text-xs text-black mb-3">
              Example forecast
            </div>

            <div className="flex items-center gap-3 mb-4">

              <span className="text-3xl">
                🍅
              </span>

              <div>

                <div className="font-display font-semibold text-black">
                  Tomato
                </div>

                <div className="text-xs text-black">
                  Current demand: 6,800 kg
                </div>

              </div>

            </div>

            <div className="text-2xl font-display font-semibold text-[#16833B] mb-1">
              Predicted: 8,420 kg
            </div>

            <div className="text-sm text-[#16833B] mb-4">
              Expected increase: 24% ↑ · HIGH demand
            </div>

            <div className="bg-[#E8F5E9] rounded-lg p-3 text-sm text-black border border-[#CFE3D2]">
              "Demand is expected to rise. Consider increasing tomato supply
              for the upcoming week."
            </div>

          </div>

        </div>

      </Section>


      {/* =========================================
          BENEFITS
          ========================================= */}

      <Section
        eyebrow="Why Farmer's Choice"
        title="Built for every side of the transaction"
      >

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {BENEFITS.map((b) => (

            <div
              key={b.title}
              className="card p-5 bg-white"
            >

              <span className="text-2xl">
                {b.icon}
              </span>

              <h3 className="font-display font-semibold text-black mt-3 mb-1.5">
                {b.title}
              </h3>

              <p className="text-sm text-black leading-relaxed">
                {b.desc}
              </p>

            </div>

          ))}

        </div>

      </Section>


      {/* =========================================
          FINAL CTA
          ========================================= */}

      <Section>

        <div className="card p-12 text-center bg-[#E2F2E5] text-black border border-[#CFE3D2]">

          <h2 className="text-3xl font-semibold mb-3 text-black">
            Ready to sell or buy directly?
          </h2>

          <p className="text-black mb-7 max-w-lg mx-auto">
            Join the farmers, FPOs, consumers and businesses already trading
            on Farmer's Choice.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">

            <Link
              to="/register?role=farmer"
              className="btn btn-primary"
            >
              Join as Farmer
            </Link>

            <Link
              to="/marketplace"
              className="btn btn-primary"
            >
              Buy Produce
            </Link>

          </div>

        </div>

      </Section>

    </div>
  );
}