import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import FarmerDashboard from "./pages/FarmerDashboard";
import BulkBuyerDashboard from "./pages/BulkBuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tulip from "./pages/Tulip";
import Logistics from "./pages/Logistics";
import PriceTransparency from "./pages/PriceTransparency";

/* =========================================
   PAGE NOT FOUND
   ========================================= */

function NotFound() {
  return (
    <div className="min-h-screen bg-[#EAF6EC] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-5">🌾</div>

        <h1 className="text-3xl font-extrabold text-[#18231B] mb-3">
          Page not found
        </h1>

        <p className="text-[#68736B] mb-6">
          The page you're looking for doesn't exist.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl
                     bg-[#16833B] text-white font-bold
                     hover:bg-[#0B5D2A] transition-all duration-200"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

/* =========================================
   MAIN APP
   ========================================= */

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAF6EC] text-[#18231B]">

      {/* Navigation */}
      <Navbar />

      {/* Main page area */}
      <main className="flex-1 bg-[#EAF6EC]">
        <Routes>

          {/* =================================
              PUBLIC PAGES
              ================================= */}

          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/marketplace"
            element={<Marketplace />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/tulip"
            element={<Tulip />}
          />

          <Route
            path="/logistics"
            element={<Logistics />}
          />

          <Route
            path="/price-transparency"
            element={<PriceTransparency />}
          />

          {/* =================================
              CONSUMER PAGES
              ================================= */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["consumer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={["consumer"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* =================================
              ORDERS
              ================================= */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute
                roles={[
                  "consumer",
                  "bulk_buyer",
                  "farmer",
                  "admin",
                ]}
              >
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* =================================
              FARMER DASHBOARD
              ================================= */}

          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute roles={["farmer"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* =================================
              BULK BUYER DASHBOARD
              ================================= */}

          <Route
            path="/bulk-buyer/dashboard"
            element={
              <ProtectedRoute roles={["bulk_buyer"]}>
                <BulkBuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* =================================
              ADMIN DASHBOARD
              ================================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* =================================
              404
              ================================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}