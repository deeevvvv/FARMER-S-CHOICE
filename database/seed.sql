-- ============================================================
-- Farmer's Choice — Seed / Sample Data
-- Password for every seeded user is: Password123
-- (bcrypt hash generated with 10 rounds)
-- ============================================================

INSERT INTO categories (name, icon) VALUES
 ('Vegetables', '🥕'), ('Fruits', '🍎'), ('Grains', '🌾'),
 ('Pulses', '🫘'), ('Dairy', '🥛'), ('Spices', '🌶️');

INSERT INTO fpos (name, registration_no, region, member_count) VALUES
 ('Green Valley FPO', 'FPO-2019-0451', 'Nashik, Maharashtra', 240),
 ('Sunrise Farmers Collective', 'FPO-2020-0982', 'Kolar, Karnataka', 180);

-- Users: 5 farmers, 3 consumers, 2 bulk buyers, 1 admin
INSERT INTO users (name, email, password_hash, phone, role) VALUES
 ('Ramesh Patil',   'ramesh.patil@example.com',   '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500001', 'farmer'),
 ('Suresh Yadav',   'suresh.yadav@example.com',   '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500002', 'farmer'),
 ('Lakshmi Reddy',  'lakshmi.reddy@example.com',  '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500003', 'farmer'),
 ('Harpreet Singh', 'harpreet.singh@example.com', '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500004', 'farmer'),
 ('Meena Kumari',   'meena.kumari@example.com',   '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500005', 'farmer'),
 ('Anita Sharma',   'anita.sharma@example.com',   '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500006', 'consumer'),
 ('Vikram Rao',     'vikram.rao@example.com',     '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500007', 'consumer'),
 ('Priya Nair',     'priya.nair@example.com',     '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500008', 'consumer'),
 ('Spice Route Hotel', 'buyer@spiceroute.example.com', '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500009', 'bulk_buyer'),
 ('FreshMart Retail',  'buyer@freshmart.example.com',  '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500010', 'bulk_buyer'),
 ('Platform Admin', 'admin@farmerschoice.example.com', '$2b$10$abcdefghijklmnopqrstuvQeH1', '9876500000', 'admin');

INSERT INTO farmers (user_id, fpo_id, farm_name, village, district, state, latitude, longitude, land_size_acres, years_farming, total_earnings, rating) VALUES
 (1, 1, 'Patil Organic Farm', 'Niphad', 'Nashik', 'Maharashtra', 20.0850, 74.1090, 8.5, 14, 186400, 4.7),
 (2, NULL, 'Yadav Farms', 'Baramati', 'Pune', 'Maharashtra', 18.1514, 74.5815, 5.2, 9, 92300, 4.4),
 (3, 2, 'Reddy Agro', 'Kolar', 'Kolar', 'Karnataka', 13.1367, 78.1298, 12.0, 20, 251900, 4.8),
 (4, NULL, 'Singh Wheat Fields', 'Ludhiana', 'Ludhiana', 'Punjab', 30.9010, 75.8573, 15.0, 25, 318700, 4.6),
 (5, 2, 'Kumari Vegetable Farm', 'Mysuru Rd', 'Mysuru', 'Karnataka', 12.2958, 76.6394, 4.0, 7, 61200, 4.3);

INSERT INTO consumers (user_id, address, city, latitude, longitude) VALUES
 (6, '12 MG Road, Indiranagar', 'Bengaluru', 12.9716, 77.5946),
 (7, '45 Baner Road', 'Pune', 18.5204, 73.8567),
 (8, '78 Marine Drive', 'Mumbai', 19.0760, 72.8777);

INSERT INTO bulk_buyers (user_id, business_name, business_type, gst_number, address, city, latitude, longitude) VALUES
 (9, 'Spice Route Hotel', 'hotel', '29ABCDE1234F1Z5', '221 Residency Rd', 'Bengaluru', 12.9718, 77.6412),
 (10, 'FreshMart Retail', 'supermarket', '27PQRSX5678K1Z2', '9 Andheri West', 'Mumbai', 19.1197, 72.8468);

-- Products
INSERT INTO products (farmer_id, category_id, name, description, quantity_kg, price_per_kg, harvest_date, location, latitude, longitude, image_url, is_organic, status) VALUES
 (1, 1, 'Tomato', 'Fresh vine-ripened tomatoes, hand-picked.', 850, 22.00, '2026-09-02', 'Niphad, Nashik', 20.0850, 74.1090, '/images/tomato.jpg', TRUE, 'active'),
 (1, 1, 'Onion', 'Premium red onions, well cured.', 1200, 18.50, '2026-08-28', 'Niphad, Nashik', 20.0850, 74.1090, '/images/onion.jpg', FALSE, 'active'),
 (2, 2, 'Grapes', 'Sweet seedless table grapes.', 400, 55.00, '2026-09-05', 'Baramati, Pune', 18.1514, 74.5815, '/images/grapes.jpg', TRUE, 'active'),
 (3, 6, 'Ragi (Finger Millet)', 'Traditionally grown, stone-milled ready.', 600, 42.00, '2026-08-20', 'Kolar, Karnataka', 13.1367, 78.1298, '/images/ragi.jpg', TRUE, 'active'),
 (3, 1, 'Green Beans', 'Tender, freshly harvested.', 300, 30.00, '2026-09-06', 'Kolar, Karnataka', 13.1367, 78.1298, '/images/beans.jpg', FALSE, 'active'),
 (4, 3, 'Wheat', 'Sharbati wheat, low moisture, clean.', 5000, 24.00, '2026-04-15', 'Ludhiana, Punjab', 30.9010, 75.8573, '/images/wheat.jpg', FALSE, 'active'),
 (4, 4, 'Chickpeas (Chana)', 'Bold kabuli chana.', 1800, 68.00, '2026-04-20', 'Ludhiana, Punjab', 30.9010, 75.8573, '/images/chickpea.jpg', FALSE, 'active'),
 (5, 1, 'Carrot', 'Crunchy, deep-orange carrots.', 500, 26.00, '2026-09-01', 'Mysuru Rd, Mysuru', 12.2958, 76.6394, '/images/carrot.jpg', TRUE, 'active'),
 (5, 1, 'Capsicum', 'Farm-fresh green capsicum.', 260, 34.00, '2026-09-04', 'Mysuru Rd, Mysuru', 12.2958, 76.6394, '/images/capsicum.jpg', FALSE, 'active'),
 (1, 2, 'Banana', 'Robusta bananas, naturally ripened.', 700, 20.00, '2026-08-30', 'Niphad, Nashik', 20.0850, 74.1090, '/images/banana.jpg', FALSE, 'active');

-- Sample orders across the pipeline
INSERT INTO orders (buyer_type, consumer_id, bulk_buyer_id, total_amount, delivery_address, delivery_city, delivery_lat, delivery_lng, status, requested_date) VALUES
 ('consumer', 1, NULL, 440.00, '12 MG Road, Indiranagar', 'Bengaluru', 12.9716, 77.5946, 'delivered', '2026-09-03'),
 ('consumer', 2, NULL, 220.00, '45 Baner Road', 'Pune', 18.5204, 73.8567, 'in_transit', '2026-09-08'),
 ('consumer', 3, NULL, 1100.00, '78 Marine Drive', 'Mumbai', 19.0760, 72.8777, 'confirmed', '2026-09-09'),
 ('bulk_buyer', NULL, 1, 13200.00, '221 Residency Rd', 'Bengaluru', 12.9718, 77.6412, 'preparing', '2026-09-10'),
 ('bulk_buyer', NULL, 2, 9600.00, '9 Andheri West', 'Mumbai', 19.1197, 72.8468, 'pending', '2026-09-12');

INSERT INTO order_items (order_id, product_id, farmer_id, quantity_kg, price_per_kg, subtotal) VALUES
 (1, 1, 1, 20, 22.00, 440.00),
 (2, 8, 5, 8.46, 26.00, 220.00),
 (3, 3, 2, 20, 55.00, 1100.00),
 (4, 1, 1, 600, 22.00, 13200.00),
 (5, 4, 3, 228.57, 42.00, 9600.00);

INSERT INTO bulk_requirements (bulk_buyer_id, category_id, product_name, quantity_kg, max_price_per_kg, delivery_date, delivery_location, status) VALUES
 (1, 1, 'Tomato', 800, 24.00, '2026-09-18', 'Bengaluru', 'open'),
 (2, 3, 'Wheat', 3000, 26.00, '2026-09-25', 'Mumbai', 'open'),
 (1, 5, 'Milk (Litres)', 500, 45.00, '2026-09-15', 'Bengaluru', 'open');

-- Logistics sample
INSERT INTO vehicles (vehicle_no, driver_name, capacity_kg, status) VALUES
 ('MH-12-AB-4521', 'Sanjay More', 2000, 'on_route'),
 ('KA-05-CD-7788', 'Nagaraj K', 1500, 'available');

INSERT INTO locations (label, latitude, longitude, type) VALUES
 ('Patil Organic Farm', 20.0850, 74.1090, 'farm'),
 ('Reddy Agro', 13.1367, 78.1298, 'farm'),
 ('Yadav Farms', 18.1514, 74.5815, 'farm'),
 ('Nashik Collection Center', 19.9975, 73.7898, 'collection_center'),
 ('Spice Route Hotel', 12.9718, 77.6412, 'buyer');

-- TULIP demand forecasts (matches the PDF example)
INSERT INTO demand_forecasts (category_id, product_name, current_demand_kg, predicted_demand_kg, pct_change, demand_level, recommendation, forecast_week) VALUES
 (1, 'Tomato',    6800, 8420, 23.8, 'HIGH',   'Demand is expected to rise. Consider increasing tomato supply for the upcoming week.', '2026-09-15'),
 (1, 'Onion',     5200, 4950, -4.8, 'MEDIUM', 'Demand is roughly stable. Maintain current onion supply levels.', '2026-09-15'),
 (2, 'Grapes',    2100, 2650, 26.2, 'HIGH',   'A seasonal spike is expected. Prioritise grape harvesting and listing this week.', '2026-09-15'),
 (3, 'Wheat',     9000, 8700, -3.3, 'MEDIUM', 'Demand is slightly softening. Hold stock or diversify buyers.', '2026-09-15'),
 (4, 'Chickpeas', 3000, 2100, -30.0, 'LOW',   'Demand is falling sharply. Consider reducing planting or exploring bulk-buyer contracts.', '2026-09-15'),
 (1, 'Carrot',    1800, 2450, 36.1, 'HIGH',   'Strong upward trend detected. Increase carrot listings if inventory allows.', '2026-09-15'),
 (6, 'Ragi',      1400, 1600, 14.3, 'MEDIUM', 'Healthy, steady growth. Good time to expand ragi supply modestly.', '2026-09-15');

INSERT INTO notifications (user_id, title, message, is_read) VALUES
 (1, 'New Order Received', 'You have received a new order for 600kg of Tomato.', FALSE),
 (1, 'TULIP Recommendation', 'Demand for Tomato is expected to rise 24% next week.', FALSE),
 (6, 'Order Delivered', 'Your order #1 has been delivered. Enjoy your fresh produce!', TRUE);