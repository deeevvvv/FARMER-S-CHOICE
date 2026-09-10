// Sample data mirroring database/seed.sql — lets the UI run standalone (no backend required).
export const categories = [
  { id: 1, name: 'Vegetables', icon: '🥕' },
  { id: 2, name: 'Fruits', icon: '🍎' },
  { id: 3, name: 'Grains', icon: '🌾' },
  { id: 4, name: 'Pulses', icon: '🫘' },
  { id: 5, name: 'Dairy', icon: '🥛' },
  { id: 6, name: 'Spices', icon: '🌶️' },
];

export const farmers = [
  { id: 1, farm_name: 'Patil Organic Farm', name: 'Ramesh Patil', village: 'Niphad', district: 'Nashik', state: 'Maharashtra', latitude: 20.085, longitude: 74.109, land_size_acres: 8.5, years_farming: 14, total_earnings: 186400, rating: 4.7 },
  { id: 2, farm_name: 'Yadav Farms', name: 'Suresh Yadav', village: 'Baramati', district: 'Pune', state: 'Maharashtra', latitude: 18.1514, longitude: 74.5815, land_size_acres: 5.2, years_farming: 9, total_earnings: 92300, rating: 4.4 },
  { id: 3, farm_name: 'Reddy Agro', name: 'Lakshmi Reddy', village: 'Kolar', district: 'Kolar', state: 'Karnataka', latitude: 13.1367, longitude: 78.1298, land_size_acres: 12, years_farming: 20, total_earnings: 251900, rating: 4.8 },
  { id: 4, farm_name: 'Singh Wheat Fields', name: 'Harpreet Singh', village: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', latitude: 30.901, longitude: 75.8573, land_size_acres: 15, years_farming: 25, total_earnings: 318700, rating: 4.6 },
  { id: 5, farm_name: 'Kumari Vegetable Farm', name: 'Meena Kumari', village: 'Mysuru Rd', district: 'Mysuru', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, land_size_acres: 4, years_farming: 7, total_earnings: 61200, rating: 4.3 },
];

export const products = [
  { id: 1, farmer_id: 1, category_id: 1, category_name: 'Vegetables', category_icon: '🥕', name: 'Tomato', description: 'Fresh vine-ripened tomatoes, hand-picked.', quantity_kg: 850, price_per_kg: 22, harvest_date: '2026-09-02', location: 'Niphad, Nashik', latitude: 20.085, longitude: 74.109, image_url: '🍅', is_organic: true, farm_name: 'Patil Organic Farm', farmer_name: 'Ramesh Patil', farmer_rating: 4.7 },
  { id: 2, farmer_id: 1, category_id: 1, category_name: 'Vegetables', category_icon: '🥕', name: 'Onion', description: 'Premium red onions, well cured.', quantity_kg: 1200, price_per_kg: 18.5, harvest_date: '2026-08-28', location: 'Niphad, Nashik', latitude: 20.085, longitude: 74.109, image_url: '🧅', is_organic: false, farm_name: 'Patil Organic Farm', farmer_name: 'Ramesh Patil', farmer_rating: 4.7 },
  { id: 3, farmer_id: 2, category_id: 2, category_name: 'Fruits', category_icon: '🍎', name: 'Grapes', description: 'Sweet seedless table grapes.', quantity_kg: 400, price_per_kg: 55, harvest_date: '2026-09-05', location: 'Baramati, Pune', latitude: 18.1514, longitude: 74.5815, image_url: '🍇', is_organic: true, farm_name: 'Yadav Farms', farmer_name: 'Suresh Yadav', farmer_rating: 4.4 },
  { id: 4, farmer_id: 3, category_id: 6, category_name: 'Spices', category_icon: '🌶️', name: 'Ragi (Finger Millet)', description: 'Traditionally grown, stone-milled ready.', quantity_kg: 600, price_per_kg: 42, harvest_date: '2026-08-20', location: 'Kolar, Karnataka', latitude: 13.1367, longitude: 78.1298, image_url: '🌾', is_organic: true, farm_name: 'Reddy Agro', farmer_name: 'Lakshmi Reddy', farmer_rating: 4.8 },
  { id: 5, farmer_id: 3, category_id: 1, category_name: 'Vegetables', category_icon: '🥕', name: 'Green Beans', description: 'Tender, freshly harvested.', quantity_kg: 300, price_per_kg: 30, harvest_date: '2026-09-06', location: 'Kolar, Karnataka', latitude: 13.1367, longitude: 78.1298, image_url: '🫛', is_organic: false, farm_name: 'Reddy Agro', farmer_name: 'Lakshmi Reddy', farmer_rating: 4.8 },
  { id: 6, farmer_id: 4, category_id: 3, category_name: 'Grains', category_icon: '🌾', name: 'Wheat', description: 'Sharbati wheat, low moisture, clean.', quantity_kg: 5000, price_per_kg: 24, harvest_date: '2026-04-15', location: 'Ludhiana, Punjab', latitude: 30.901, longitude: 75.8573, image_url: '🌾', is_organic: false, farm_name: 'Singh Wheat Fields', farmer_name: 'Harpreet Singh', farmer_rating: 4.6 },
  { id: 7, farmer_id: 4, category_id: 4, category_name: 'Pulses', category_icon: '🫘', name: 'Chickpeas (Chana)', description: 'Bold kabuli chana.', quantity_kg: 1800, price_per_kg: 68, harvest_date: '2026-04-20', location: 'Ludhiana, Punjab', latitude: 30.901, longitude: 75.8573, image_url: '🫘', is_organic: false, farm_name: 'Singh Wheat Fields', farmer_name: 'Harpreet Singh', farmer_rating: 4.6 },
  { id: 8, farmer_id: 5, category_id: 1, category_name: 'Vegetables', category_icon: '🥕', name: 'Carrot', description: 'Crunchy, deep-orange carrots.', quantity_kg: 500, price_per_kg: 26, harvest_date: '2026-09-01', location: 'Mysuru Rd, Mysuru', latitude: 12.2958, longitude: 76.6394, image_url: '🥕', is_organic: true, farm_name: 'Kumari Vegetable Farm', farmer_name: 'Meena Kumari', farmer_rating: 4.3 },
  { id: 9, farmer_id: 5, category_id: 1, category_name: 'Vegetables', category_icon: '🥕', name: 'Capsicum', description: 'Farm-fresh green capsicum.', quantity_kg: 260, price_per_kg: 34, harvest_date: '2026-09-04', location: 'Mysuru Rd, Mysuru', latitude: 12.2958, longitude: 76.6394, image_url: '🫑', is_organic: false, farm_name: 'Kumari Vegetable Farm', farmer_name: 'Meena Kumari', farmer_rating: 4.3 },
  { id: 10, farmer_id: 1, category_id: 2, category_name: 'Fruits', category_icon: '🍎', name: 'Banana', description: 'Robusta bananas, naturally ripened.', quantity_kg: 700, price_per_kg: 20, harvest_date: '2026-08-30', location: 'Niphad, Nashik', latitude: 20.085, longitude: 74.109, image_url: '🍌', is_organic: false, farm_name: 'Patil Organic Farm', farmer_name: 'Ramesh Patil', farmer_rating: 4.7 },
];

export const forecasts = [
  { product_name: 'Tomato', current_demand_kg: 6800, predicted_demand_kg: 8420, pct_change: 23.8, demand_level: 'HIGH', recommendation: 'Demand is expected to rise. Consider increasing tomato supply for the upcoming week.', icon: '🍅' },
  { product_name: 'Carrot', current_demand_kg: 1800, predicted_demand_kg: 2450, pct_change: 36.1, demand_level: 'HIGH', recommendation: 'Strong upward trend detected. Increase carrot listings if inventory allows.', icon: '🥕' },
  { product_name: 'Grapes', current_demand_kg: 2100, predicted_demand_kg: 2650, pct_change: 26.2, demand_level: 'HIGH', recommendation: 'A seasonal spike is expected. Prioritise grape harvesting and listing this week.', icon: '🍇' },
  { product_name: 'Ragi', current_demand_kg: 1400, predicted_demand_kg: 1600, pct_change: 14.3, demand_level: 'MEDIUM', recommendation: 'Healthy, steady growth. Good time to expand ragi supply modestly.', icon: '🌾' },
  { product_name: 'Onion', current_demand_kg: 5200, predicted_demand_kg: 4950, pct_change: -4.8, demand_level: 'MEDIUM', recommendation: 'Demand is roughly stable. Maintain current onion supply levels.', icon: '🧅' },
  { product_name: 'Wheat', current_demand_kg: 9000, predicted_demand_kg: 8700, pct_change: -3.3, demand_level: 'MEDIUM', recommendation: 'Demand is slightly softening. Hold stock or diversify buyers.', icon: '🌾' },
  { product_name: 'Chickpeas', current_demand_kg: 3000, predicted_demand_kg: 2100, pct_change: -30.0, demand_level: 'LOW', recommendation: 'Demand is falling sharply. Consider reducing planting or exploring bulk-buyer contracts.', icon: '🫘' },
];

export const salesTrend = [
  { day: 'Sep 1', revenue: 3200 }, { day: 'Sep 2', revenue: 4100 }, { day: 'Sep 3', revenue: 3800 },
  { day: 'Sep 4', revenue: 5200 }, { day: 'Sep 5', revenue: 4700 }, { day: 'Sep 6', revenue: 6100 },
  { day: 'Sep 7', revenue: 5800 }, { day: 'Sep 8', revenue: 7200 }, { day: 'Sep 9', revenue: 6600 },
  { day: 'Sep 10', revenue: 8100 },
];

export const orders = [
  { id: 1, buyer_type: 'consumer', buyer_name: 'Anita Sharma', items: [{ product_name: 'Tomato', quantity_kg: 20 }], total_amount: 440, status: 'delivered', delivery_city: 'Bengaluru', created_at: '2026-09-03' },
  { id: 2, buyer_type: 'consumer', buyer_name: 'Vikram Rao', items: [{ product_name: 'Carrot', quantity_kg: 8.5 }], total_amount: 220, status: 'in_transit', delivery_city: 'Pune', created_at: '2026-09-08' },
  { id: 3, buyer_type: 'consumer', buyer_name: 'Priya Nair', items: [{ product_name: 'Grapes', quantity_kg: 20 }], total_amount: 1100, status: 'confirmed', delivery_city: 'Mumbai', created_at: '2026-09-09' },
  { id: 4, buyer_type: 'bulk_buyer', buyer_name: 'Spice Route Hotel', items: [{ product_name: 'Tomato', quantity_kg: 600 }], total_amount: 13200, status: 'preparing', delivery_city: 'Bengaluru', created_at: '2026-09-10' },
  { id: 5, buyer_type: 'bulk_buyer', buyer_name: 'FreshMart Retail', items: [{ product_name: 'Ragi', quantity_kg: 228.6 }], total_amount: 9600, status: 'pending', delivery_city: 'Mumbai', created_at: '2026-09-12' },
];

export const bulkRequirements = [
  { id: 1, product_name: 'Tomato', quantity_kg: 800, max_price_per_kg: 24, delivery_date: '2026-09-18', delivery_location: 'Bengaluru', status: 'open' },
  { id: 2, product_name: 'Wheat', quantity_kg: 3000, max_price_per_kg: 26, delivery_date: '2026-09-25', delivery_location: 'Mumbai', status: 'open' },
  { id: 3, product_name: 'Milk (Litres)', quantity_kg: 500, max_price_per_kg: 45, delivery_date: '2026-09-15', delivery_location: 'Bengaluru', status: 'open' },
];

export const logisticsLocations = [
  { label: 'Patil Organic Farm', latitude: 20.085, longitude: 74.109, type: 'farm' },
  { label: 'Reddy Agro', latitude: 13.1367, longitude: 78.1298, type: 'farm' },
  { label: 'Yadav Farms', latitude: 18.1514, longitude: 74.5815, type: 'farm' },
  { label: 'Nashik Collection Center', latitude: 19.9975, longitude: 73.7898, type: 'collection_center' },
  { label: 'Spice Route Hotel (Buyer)', latitude: 12.9718, longitude: 77.6412, type: 'buyer' },
];

export const adminStats = {
  totalFarmers: 5, totalConsumers: 3, totalBulkBuyers: 2, totalProducts: 10, totalOrders: 5,
  totalRevenue: 24560, activeDeliveries: 3, highDemandCrops: 3,
  orderTrend: [
    { day: 'Sep 3', orders: 1, revenue: 440 }, { day: 'Sep 5', orders: 0, revenue: 0 },
    { day: 'Sep 8', orders: 1, revenue: 220 }, { day: 'Sep 9', orders: 1, revenue: 1100 },
    { day: 'Sep 10', orders: 1, revenue: 13200 }, { day: 'Sep 12', orders: 1, revenue: 9600 },
  ],
  topCategories: [
    { name: 'Vegetables', product_count: 5, total_kg: 3110 },
    { name: 'Fruits', product_count: 2, total_kg: 1100 },
    { name: 'Grains', product_count: 1, total_kg: 5000 },
    { name: 'Pulses', product_count: 1, total_kg: 1800 },
    { name: 'Spices', product_count: 1, total_kg: 600 },
  ],
};

export const priceComparison = {
  traditional: { farmer: 12, trader: 4, wholesaler: 5, distributor: 4, retailer: 5, consumerPrice: 30 },
  farmersChoice: { farmer: 20, logistics: 3, consumerPrice: 23 },
};

export const ORDER_STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'picked_up', 'in_transit', 'delivered'];