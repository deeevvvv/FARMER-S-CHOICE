import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { EmptyState } from "../components/Shared";

export default function Marketplace() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(100);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => setProducts([]));
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    const query = search.trim().toLowerCase();

    if (query) {
      list = list.filter((p) =>
        [
          p.name,
          p.category_name,
          p.farmer_name,
          p.fpo_name,
          p.location,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.category_name === category);
    }

    list = list.filter(
      (p) => Number(p.price_per_kg || 0) <= maxPrice
    );

    if (sort === "price_asc") {
      list.sort(
        (a, b) =>
          Number(a.price_per_kg || 0) -
          Number(b.price_per_kg || 0)
      );
    }

    if (sort === "price_desc") {
      list.sort(
        (a, b) =>
          Number(b.price_per_kg || 0) -
          Number(a.price_per_kg || 0)
      );
    }

    return list;
  }, [products, search, category, sort, maxPrice]);

  const categoryItems = [
    {
      id: "all",
      name: "All Produce",
      icon: "🌾",
    },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "🥬",
    })),
  ];

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#18231b]">

      {/* MARKETPLACE HEADER */}
      <section className="bg-white border-b border-[#dce6dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f5e9] text-[#21733a] text-xs font-bold mb-4">
                🌱 DIRECT FARM MARKETPLACE
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Fresh from the farm.
                <span className="text-[#25833d]">
                  {" "}Straight to you.
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-[#637066] max-w-2xl">
                Buy fresh produce directly from farmers and FPOs.
                Better prices for farmers. Fresher produce for buyers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/price-transparency")}
                className="px-4 py-2.5 rounded-xl border border-[#cddacf] bg-white text-sm font-bold hover:bg-[#f3f7f3]"
              >
                Price Transparency
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="px-4 py-2.5 rounded-xl bg-[#257b3c] text-white text-sm font-bold hover:bg-[#1d6731]"
              >
                🛒 View Cart
              </button>

            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">

            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a877d]">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search tomatoes, wheat, cucumbers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#d2ddd4] bg-[#fbfdfb] outline-none focus:ring-2 focus:ring-[#65a873] focus:border-transparent text-sm"
              />

            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="h-12 px-5 rounded-xl border border-[#cfdacf] bg-white font-bold text-sm hover:bg-[#f3f7f3]"
            >
              ⚙ Filters
            </button>

          </div>

          {/* CATEGORY PILLS */}
          <div className="flex gap-2 overflow-x-auto mt-5 pb-1">

            {categoryItems.map((item) => {
              const selected =
                category ===
                (item.id === "all" ? "all" : item.name);

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setCategory(
                      item.id === "all" ? "all" : item.name
                    )
                  }
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    selected
                      ? "bg-[#267d3d] text-white border-[#267d3d]"
                      : "bg-white text-[#536057] border-[#d6e0d7] hover:border-[#8fb596]"
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              );
            })}

          </div>
        </div>
      </section>

      {/* MISSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        <div className="rounded-2xl bg-[#e6f4e8] border border-[#c9e2cc] p-5 sm:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="text-xs font-extrabold tracking-wider text-[#27753a] uppercase">
                Farmer's Choice Mission
              </div>

              <h2 className="mt-1 text-xl font-extrabold">
                Direct from Uttarakhand & U.P.
              </h2>

              <p className="text-sm text-[#536357] mt-1">
                0% middlemen markups. Farmers keep more of every sale.
              </p>

            </div>

            <div className="flex gap-6">

              <div>
                <div className="text-2xl font-black text-[#267b3c]">
                  +38%
                </div>
                <div className="text-xs text-[#657166]">
                  Farmer payout
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">
                  0%
                </div>
                <div className="text-xs text-[#657166]">
                  Middlemen
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ZERO INTERMEDIARY INDEX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        <div className="bg-white border border-[#dbe4dc] rounded-2xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#6b786e]">
                Price Transparency
              </p>

              <h2 className="text-lg font-extrabold mt-1">
                Zero-Intermediary Index
              </h2>

            </div>

            <button
              onClick={() => navigate("/price-transparency")}
              className="text-sm font-bold text-[#25783a] hover:underline"
            >
              See how your money is split →
            </button>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

            <div className="rounded-xl bg-[#edf7ee] p-4">
              <div className="text-2xl font-black text-[#277b3c]">
                76%
              </div>
              <div className="text-xs text-[#667269] mt-1">
                Farmer revenue
              </div>
            </div>

            <div className="rounded-xl bg-[#f5f7f5] p-4">
              <div className="text-2xl font-black">
                24%
              </div>
              <div className="text-xs text-[#667269] mt-1">
                Eco-logistics & quality
              </div>
            </div>

            <div className="rounded-xl bg-[#f5f7f5] p-4">
              <div className="text-2xl font-black">
                ₹0
              </div>
              <div className="text-xs text-[#667269] mt-1">
                Middlemen markup
              </div>
            </div>

            <div className="rounded-xl bg-[#f5f7f5] p-4">
              <div className="text-2xl font-black">
                100%
              </div>
              <div className="text-xs text-[#667269] mt-1">
                Traceable produce
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#6b786e]">
              Today's Harvest
            </p>

            <h2 className="text-2xl font-extrabold mt-1">
              Fresh produce near you
            </h2>

            <p className="text-sm text-[#6b756d] mt-1">
              Nashik • Pune • Ratnagiri
            </p>

          </div>

          <div className="flex items-center gap-3">

            <span className="text-sm text-[#6a756d]">
              {filtered.length} products
            </span>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#d4ded5] bg-white text-sm font-medium outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">
                Price: Low to High
              </option>
              <option value="price_desc">
                Price: High to Low
              </option>
            </select>

          </div>
        </div>

        {filtered.length === 0 ? (

          <div className="bg-white rounded-2xl border border-[#dbe4dc] p-8">

            <EmptyState
              title="No produce matches your filters"
              description="Try widening your price range or clearing the search."
            />

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#dbe4dc] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <ProductCard product={product} />
              </div>
            ))}

          </div>

        )}

      </main>

      {/* FEATURES */}
      <section className="border-t border-[#dce5dd] bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="flex gap-3">

              <div className="text-2xl">🌱</div>

              <div>
                <h3 className="font-bold text-sm">
                  Direct from farmers
                </h3>

                <p className="text-xs text-[#69746c] mt-1">
                  Know exactly who grew your food.
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <div className="text-2xl">🚚</div>

              <div>
                <h3 className="font-bold text-sm">
                  Smart logistics
                </h3>

                <p className="text-xs text-[#69746c] mt-1">
                  TULIP helps optimize delivery routes.
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <div className="text-2xl">🤖</div>

              <div>
                <h3 className="font-bold text-sm">
                  AI-powered decisions
                </h3>

                <p className="text-xs text-[#69746c] mt-1">
                  Demand forecasting powered by TULIP.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FILTER MODAL */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />

          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-extrabold">
                Filter produce
              </h2>

              <button
                onClick={() => setShowFilters(false)}
                className="w-9 h-9 rounded-full bg-[#f1f4f1] hover:bg-[#e7ebe7]"
              >
                ✕
              </button>

            </div>

            <label className="block text-sm font-bold mb-2">
              Maximum price
            </label>

            <div className="flex items-center justify-between mb-2">

              <span className="text-sm text-[#68736b]">
                ₹10/kg
              </span>

              <span className="font-bold text-[#267a3c]">
                ₹{maxPrice}/kg
              </span>

              <span className="text-sm text-[#68736b]">
                ₹100/kg
              </span>

            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(Number(e.target.value))
              }
              className="w-full accent-[#287c3e]"
            />

            <label className="block text-sm font-bold mt-6 mb-2">
              Sort
            </label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#d3ddd4] bg-white text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">
                Price: Low to High
              </option>
              <option value="price_desc">
                Price: High to Low
              </option>
            </select>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 h-12 rounded-xl bg-[#267c3d] text-white font-bold"
            >
              Apply Filters
            </button>

          </div>
        </div>
      )}

    </div>
  );
}