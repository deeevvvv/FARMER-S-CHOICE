import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { LanguageProvider } from "./context/LanguageContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import BulkBuyerDashboard from "./pages/BulkBuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tulip from "./pages/Tulip";
import Logistics from "./pages/Logistics";
import PriceTransparency from "./pages/PriceTransparency";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#EAF6EC] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-5">🌾</div>
        <h1 className="text-3xl font-extrabold text-[#18231B] mb-3">Page not found</h1>
        <p className="text-[#68736B] mb-6">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#16833B] text-white font-bold hover:bg-[#0B5D2A] transition-all duration-200"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#EAF6EC] text-[#18231B]">
        <Navbar />

        <main className="flex-1 bg-[#EAF6EC]">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/farmer" element={<Login />} />
            <Route path="/login/consumer" element={<Login />} />
            <Route path="/login/bulk-buyer" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/tulip" element={<Tulip />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/price-transparency" element={<PriceTransparency />} />

            <Route path="/cart" element={<ProtectedRoute roles={["consumer"]}><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute roles={["consumer"]}><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={["consumer", "bulk_buyer", "farmer", "admin"]}><Orders /></ProtectedRoute>} />
            <Route path="/consumer/dashboard" element={<ProtectedRoute roles={["consumer"]}><ConsumerDashboard /></ProtectedRoute>} />
            <Route path="/farmer/dashboard" element={<ProtectedRoute roles={["farmer"]}><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/bulk-buyer/dashboard" element={<ProtectedRoute roles={["bulk_buyer"]}><BulkBuyerDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}
