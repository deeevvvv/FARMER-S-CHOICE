import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/* =========================================
   LOCAL PRODUCT IMAGES
   ========================================= */

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

/* =========================================
   FIND CORRECT IMAGE
   ========================================= */

function getProductImage(product) {
  const name = String(product?.name || "").toLowerCase();
  const category = String(product?.category_name || "").toLowerCase();

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

/* =========================================
   PRODUCT DETAIL
   ========================================= */

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  /* =========================================
     GET PRODUCT
     ========================================= */

  useEffect(() => {
    api.getProduct(id).then(setProduct);
  }, [id]);

  /* =========================================
     LOADING
     ========================================= */

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EAF6EC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🌱</div>

          <p className="text-black font-medium">
            Loading product…
          </p>
        </div>
      </div>
    );
  }

  /* =========================================
     PRODUCT IMAGE
     ========================================= */

  const image = getProductImage(product);

  /* =========================================
     ADD TO CART
     ========================================= */

  function handleAdd() {
    addItem(product, qty);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  /* =========================================
     BUY NOW
     ========================================= */

  function handleBuyNow() {
    addItem(product, qty);
    navigate("/checkout");
  }

  /* =========================================
     PAGE
     ========================================= */

  return (
    <div className="min-h-screen bg-[#EAF6EC]">

      <div className="container-xl py-10 grid lg:grid-cols-2 gap-10">

        {/* =====================================
            PRODUCT IMAGE
            ===================================== */}

        <div className="card bg-white overflow-hidden">

          <div className="h-[420px] w-full bg-[#E8F5E9] flex items-center justify-center">

            {image ? (
              <img
                src={image}
                alt={product.name || "Fresh produce"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    "PRODUCT IMAGE FAILED:",
                    e.currentTarget.src
                  );

                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="text-9xl">
                🌱
              </div>
            )}

          </div>

        </div>


        {/* =====================================
            PRODUCT INFORMATION
            ===================================== */}

        <div>

          {/* Category */}

          <div className="flex items-center gap-2 mb-3">

            <span className="text-xs font-medium bg-[#E8F5E9] text-[#16833B] px-2.5 py-1 rounded-full">
              {product.category_icon} {product.category_name}
            </span>

            {product.is_organic && (
              <span className="text-xs font-medium bg-[#E8F5E9] text-[#16833B] px-2.5 py-1 rounded-full">
                Organic
              </span>
            )}

          </div>


          {/* Product Name */}

          <h1 className="text-3xl font-semibold text-black mb-2">
            {product.name}
          </h1>


          {/* Description */}

          <p className="text-black leading-relaxed mb-5">
            {product.description}
          </p>


          {/* Price */}

          <div className="flex items-baseline gap-2 mb-6">

            <span className="text-3xl font-display font-semibold text-[#16833B]">
              ₹{product.price_per_kg}
            </span>

            <span className="text-black">
              / kg
            </span>

          </div>


          {/* =====================================
              PRODUCT DETAILS CARD
              ===================================== */}

          <div className="card bg-white p-4 mb-6 space-y-3 text-sm">

            <div className="flex justify-between gap-4">

              <span className="text-black">
                Farmer
              </span>

              <span className="font-medium text-black text-right">
                {product.farmer_name} ⭐ {product.farmer_rating}
              </span>

            </div>


            <div className="flex justify-between gap-4">

              <span className="text-black">
                Location
              </span>

              <span className="font-medium text-black text-right">
                📍 {product.location}
              </span>

            </div>


            <div className="flex justify-between gap-4">

              <span className="text-black">
                Available quantity
              </span>

              <span className="font-medium text-black">
                {product.quantity_kg} kg
              </span>

            </div>


            <div className="flex justify-between gap-4">

              <span className="text-black">
                Harvested on
              </span>

              <span className="font-medium text-black">
                {product.harvest_date}
              </span>

            </div>

          </div>


          {/* =====================================
              QUANTITY
              ===================================== */}

          {(!user || user.role === "consumer") && (

            <div className="flex items-center gap-4 mb-5">

              <label className="text-sm font-medium text-black">
                Quantity (kg)
              </label>

              <div className="flex items-center border border-[#CFE3D2] rounded-lg overflow-hidden bg-white">

                <button
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                  className="px-3 py-2"
                >
                  −
                </button>

                <input
                  type="number"
                  min="1"
                  className="w-16 text-center outline-none bg-white text-black"
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.max(
                        1,
                        Number(e.target.value)
                      )
                    )
                  }
                />

                <button
                  onClick={() =>
                    setQty((q) => q + 1)
                  }
                  className="px-3 py-2"
                >
                  +
                </button>

              </div>

              <span className="text-sm text-black">
                = ₹
                {(
                  qty * Number(product.price_per_kg || 0)
                ).toLocaleString()}
              </span>

            </div>

          )}


          {/* =====================================
              ACTION BUTTONS
              ===================================== */}

          {(!user || user.role === "consumer") && (

            <div className="flex gap-3">

              <button
                onClick={handleAdd}
                className="flex-1 bg-[#16833B] hover:bg-[#0B5D2A] text-white font-bold py-3 px-5 rounded-xl transition-all"
              >
                {added ? "Added ✓" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#16833B] hover:bg-[#0B5D2A] text-white font-bold py-3 px-5 rounded-xl transition-all"
              >
                Buy Now
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}