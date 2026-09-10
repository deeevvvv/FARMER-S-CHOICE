import axios from 'axios';
import * as mock from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

const client = axios.create({ baseURL: API_URL, timeout: 4000 });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('fc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Wraps a real API call with a mock-data fallback so the UI keeps working
// even if the backend / TULIP service isn't running (great for demos & judging).
async function withFallback(realCall, mockValue) {
  if (MOCK_MODE) return mockValue;
  try {
    return await realCall();
  } catch (err) {
    console.warn('API unavailable, using bundled sample data:', err.message);
    return mockValue;
  }
}

export const api = {
  // ---- Auth ----
  login: (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data),
  register: (payload) => client.post('/auth/register', payload).then((r) => r.data),

  // ---- Catalog ----
  getCategories: () => withFallback(() => client.get('/categories').then((r) => r.data), mock.categories),
  getProducts: (params) => withFallback(() => client.get('/products', { params }).then((r) => r.data), mock.products),
  getProduct: (id) => withFallback(
    () => client.get(`/products/${id}`).then((r) => r.data),
    mock.products.find((p) => String(p.id) === String(id))
  ),
  createProduct: (payload) => client.post('/products', payload).then((r) => r.data),
  updateProduct: (id, payload) => client.put(`/products/${id}`, payload).then((r) => r.data),
  deleteProduct: (id) => client.delete(`/products/${id}`).then((r) => r.data),

  // ---- Cart & Orders ----
  getCart: () => withFallback(() => client.get('/cart').then((r) => r.data), []),
  addToCart: (productId, quantityKg) => client.post('/cart', { productId, quantityKg }).then((r) => r.data),
  removeFromCart: (cartId) => client.delete(`/cart/${cartId}`).then((r) => r.data),
  placeOrder: (payload) => client.post('/orders', payload).then((r) => r.data),
  getMyOrders: () => withFallback(() => client.get('/orders/mine').then((r) => r.data), mock.orders),
  updateOrderStatus: (id, status) => client.patch(`/orders/${id}/status`, { status }).then((r) => r.data),

  // ---- Farmer dashboard ----
  getFarmerDashboard: () => withFallback(
    () => client.get('/farmers/dashboard').then((r) => r.data),
    {
      farmer: mock.farmers[0],
      totalEarnings: mock.farmers[0].total_earnings,
      activeOrders: 3,
      availableInventoryKg: mock.products.filter((p) => p.farmer_id === 1).reduce((s, p) => s + p.quantity_kg, 0),
      productsSoldKg: 2140,
      products: mock.products.filter((p) => p.farmer_id === 1),
      salesTrend: mock.salesTrend,
    }
  ),

  // ---- Bulk buyer ----
  postBulkRequirement: (payload) => client.post('/bulk-requirements', payload).then((r) => r.data),
  getMyBulkRequirements: () => withFallback(() => client.get('/bulk-requirements/mine').then((r) => r.data), mock.bulkRequirements),
  getRequirementMatches: (id) => withFallback(
    () => client.get(`/bulk-requirements/${id}/matches`).then((r) => r.data),
    { requirement: mock.bulkRequirements.find((r) => r.id === Number(id)), matches: mock.products.slice(0, 4) }
  ),

  // ---- Logistics / TULIP ----
  getLogisticsOverview: () => withFallback(
    () => client.get('/logistics/overview').then((r) => r.data),
    { deliveries: [], locations: mock.logisticsLocations, activeOrders: mock.orders }
  ),
  optimizeRoute: (stops, buyer) => withFallback(
    () => client.post('/logistics/optimize-route', { stops, buyer }).then((r) => r.data),
    mockOptimizeRoute(stops, buyer)
  ),
  getForecasts: () => withFallback(() => client.get('/forecasts').then((r) => r.data), mock.forecasts),
  refreshForecasts: () => withFallback(() => client.post('/forecasts/refresh').then((r) => r.data), mock.forecasts),

  // ---- Admin ----
  getAdminStats: () => withFallback(() => client.get('/admin/stats').then((r) => r.data), mock.adminStats),
};

// A tiny client-side mirror of TULIP's nearest-neighbor routing, used only when
// the Python AI service is unreachable, so the Logistics page always has something to show.
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function mockOptimizeRoute(stops, buyer) {
  const remaining = [...stops];
  const route = [];
  let current = remaining.shift();
  route.push(current);
  while (remaining.length) {
    remaining.sort((a, b) => haversine(current.latitude, current.longitude, a.latitude, a.longitude) - haversine(current.latitude, current.longitude, b.latitude, b.longitude));
    current = remaining.shift();
    route.push(current);
  }
  route.push({ ...buyer, type: 'buyer' });
  let dist = 0;
  for (let i = 0; i < route.length - 1; i++) {
    dist += haversine(route[i].latitude, route[i].longitude, route[i + 1].latitude, route[i + 1].longitude);
  }
  dist *= 1.15;
  return {
    route,
    total_distance_km: Math.round(dist * 100) / 100,
    estimated_minutes: Math.round((dist / 35) * 60),
    number_of_stops: route.length,
    estimated_cost_inr: Math.round((150 * route.length + dist * 18) * 100) / 100,
  };
}

export default api;