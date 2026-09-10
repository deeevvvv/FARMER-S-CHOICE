import React from "react";
import { Link } from "react-router-dom";

const productImages = {
  tomato: "/products/tomatoes.jpg",
  onion: "/products/onion.png",
  grapes: "/products/grapes.jpg",
  ragi: "/products/ragi.jpg",
  greenbeans: "/products/green-beans.jpg",
  chickpeas: "/products/chickpeas.jpg",
  carrot: "/products/carrot.png",
  capsicum: "/products/capsicum.webp",
  banana: "/products/banana.avif",
  wheat: "/products/wheat.jpg",
};

function getProductImage(product) {
  const name = String(product.name || "").toLowerCase();
  const category = String(product.category_name || "").toLowerCase();

  const text = `${name} ${category}`;

  if (text.includes("tomato")) {
    return productImages.tomato;
  }

  if (text.includes("onion")) {
    return productImages.onion;
  }

  if (text.includes("grape")) {
    return productImages.grapes;
  }

  if (
    text.includes("ragi") ||
    text.includes("finger millet") ||
    text.includes("millet")
  ) {
    return productImages.ragi;
  }

  if (
    text.includes("green bean") ||
    text.includes("green beans") ||
    text.includes("french bean")
  ) {
    return productImages.greenbeans;
  }

  if (
    text.includes("chickpea") ||
    text.includes("chick peas") ||
    text.includes("chana") ||
    text.includes("gram")
  ) {
    return productImages.chickpeas;
  }

  if (text.includes("carrot")) {
    return productImages.carrot;
  }

  if (
    text.includes("capsicum") ||
    text.includes("bell pepper") ||
    text.includes("bellpepper")
  ) {
    return productImages.capsicum;
  }

  if (text.includes("banana")) {
    return productImages.banana;
  }

  if (text.includes("wheat")) {
    return productImages.wheat;
  }

  return null;
}

export default function ProductCard({ product }) {
  const image = getProductImage(product);

  const price = Number(product.price_per_kg || 0);
  const quantity = Number(product.quantity_kg || 0);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-[#e0e7e1] transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="relative h-44 w-full overflow-hidden bg-[#edf5ee]">

        {image ? (
          <img
            src={image}
            alt={product.name || "Fresh produce"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              console.error("IMAGE FAILED:", e.currentTarget.src);
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            🌱
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
          <span className="text-xs font-semibold text-[#16833b]">
            {product.is_organic ? "✓ Organic" : "✓ Fresh Produce"}
          </span>
        </div>

        {product.farmer_rating && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-xs font-semibold">
            ⭐ {product.farmer_rating}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4 flex flex-col gap-3">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#16251b] leading-tight group-hover:text-[#16783a]">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-[#68736b]">
                Farmer: {product.farmer_name || "Local Farmer"}
              </span>

              <span className="text-[#16833b]">
                ✓
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-[#16783a]">
              ₹{price}
            </div>

            <div className="text-[11px] text-[#78827a]">
              /kg
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <span className="px-2.5 py-1 rounded-full bg-[#f1f6f1] text-[#536057] text-[10px] font-semibold">
            {product.category_icon || "🌱"}{" "}
            {product.category_name || "Fresh Produce"}
          </span>

        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#657168]">
          📍 {product.location || "Local Farm"}
        </div>

        <div className="flex items-center justify-between text-xs text-[#667269] pt-1">

          <span>
            📦 {quantity} kg in stock
          </span>

          <span className="text-[#16833b]">
            ⚡ Direct
          </span>

        </div>

        <div
          className="h-11 w-full rounded-xl bg-[#16833b] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
        >
          🛒 Add to Cart
        </div>

      </div>
    </Link>
  );
}