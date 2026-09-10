-- ============================================================
-- Farmer's Choice — PostgreSQL Schema
-- ============================================================
DROP TABLE IF EXISTS notifications, demand_forecasts, deliveries, vehicles,
  locations, order_items, orders, cart, products, categories,
  bulk_buyers, consumers, fpos, farmers, users CASCADE;

-- ---------- Core identity ----------
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(160) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  phone          VARCHAR(20),
  role           VARCHAR(20) NOT NULL CHECK (role IN ('farmer','consumer','bulk_buyer','admin')),
  avatar_url     TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fpos (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(160) NOT NULL,
  registration_no VARCHAR(80),
  region         VARCHAR(120),
  member_count   INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farmers (
  id              SERIAL PRIMARY KEY,
  user_id         INT REFERENCES users(id) ON DELETE CASCADE,
  fpo_id          INT REFERENCES fpos(id) ON DELETE SET NULL,
  farm_name       VARCHAR(160),
  village         VARCHAR(120),
  district        VARCHAR(120),
  state           VARCHAR(120),
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  land_size_acres DECIMAL(6,2),
  years_farming   INT,
  total_earnings  DECIMAL(12,2) DEFAULT 0,
  rating          DECIMAL(2,1) DEFAULT 4.5,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE consumers (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id) ON DELETE CASCADE,
  address       TEXT,
  city          VARCHAR(120),
  latitude      DECIMAL(9,6),
  longitude     DECIMAL(9,6),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bulk_buyers (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id) ON DELETE CASCADE,
  business_name  VARCHAR(160) NOT NULL,
  business_type  VARCHAR(60), -- restaurant, retailer, hotel, supermarket
  gst_number     VARCHAR(40),
  address        TEXT,
  city           VARCHAR(120),
  latitude       DECIMAL(9,6),
  longitude      DECIMAL(9,6),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ---------- Catalog ----------
CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(80) UNIQUE NOT NULL,
  icon  VARCHAR(20)
);

CREATE TABLE products (
  id              SERIAL PRIMARY KEY,
  farmer_id       INT REFERENCES farmers(id) ON DELETE CASCADE,
  category_id     INT REFERENCES categories(id),
  name            VARCHAR(120) NOT NULL,
  description     TEXT,
  quantity_kg     DECIMAL(10,2) NOT NULL,
  price_per_kg    DECIMAL(8,2) NOT NULL,
  harvest_date    DATE,
  location        VARCHAR(160),
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  image_url       TEXT,
  is_organic      BOOLEAN DEFAULT FALSE,
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','sold_out','inactive')),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ---------- Cart & Orders ----------
CREATE TABLE cart (
  id           SERIAL PRIMARY KEY,
  consumer_id  INT REFERENCES consumers(id) ON DELETE CASCADE,
  product_id   INT REFERENCES products(id) ON DELETE CASCADE,
  quantity_kg  DECIMAL(10,2) NOT NULL,
  added_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id              SERIAL PRIMARY KEY,
  buyer_type      VARCHAR(20) NOT NULL CHECK (buyer_type IN ('consumer','bulk_buyer')),
  consumer_id     INT REFERENCES consumers(id),
  bulk_buyer_id   INT REFERENCES bulk_buyers(id),
  total_amount    DECIMAL(12,2) NOT NULL,
  delivery_address TEXT,
  delivery_city   VARCHAR(120),
  delivery_lat    DECIMAL(9,6),
  delivery_lng    DECIMAL(9,6),
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','preparing','picked_up','in_transit','delivered','cancelled')),
  payment_method  VARCHAR(30) DEFAULT 'cod',
  requested_date  DATE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INT REFERENCES products(id),
  farmer_id    INT REFERENCES farmers(id),
  quantity_kg  DECIMAL(10,2) NOT NULL,
  price_per_kg DECIMAL(8,2) NOT NULL,
  subtotal     DECIMAL(12,2) NOT NULL
);

-- Bulk buyer requirement postings (RFQ style)
CREATE TABLE bulk_requirements (
  id             SERIAL PRIMARY KEY,
  bulk_buyer_id  INT REFERENCES bulk_buyers(id) ON DELETE CASCADE,
  category_id    INT REFERENCES categories(id),
  product_name   VARCHAR(120) NOT NULL,
  quantity_kg    DECIMAL(10,2) NOT NULL,
  max_price_per_kg DECIMAL(8,2) NOT NULL,
  delivery_date  DATE NOT NULL,
  delivery_location VARCHAR(160),
  status         VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','matched','closed')),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ---------- Logistics ----------
CREATE TABLE locations (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(160),
  latitude   DECIMAL(9,6),
  longitude  DECIMAL(9,6),
  type       VARCHAR(30) -- farm, collection_center, buyer, warehouse
);

CREATE TABLE vehicles (
  id             SERIAL PRIMARY KEY,
  vehicle_no     VARCHAR(40),
  driver_name    VARCHAR(120),
  capacity_kg    DECIMAL(10,2),
  status         VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','on_route','maintenance'))
);

CREATE TABLE deliveries (
  id               SERIAL PRIMARY KEY,
  order_id         INT REFERENCES orders(id) ON DELETE CASCADE,
  vehicle_id       INT REFERENCES vehicles(id),
  route_json       JSONB, -- ordered stop list produced by TULIP
  total_distance_km DECIMAL(8,2),
  estimated_minutes INT,
  estimated_cost   DECIMAL(10,2),
  status           VARCHAR(20) DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ---------- TULIP AI ----------
CREATE TABLE demand_forecasts (
  id                SERIAL PRIMARY KEY,
  category_id       INT REFERENCES categories(id),
  product_name      VARCHAR(120) NOT NULL,
  current_demand_kg DECIMAL(10,2),
  predicted_demand_kg DECIMAL(10,2),
  pct_change        DECIMAL(6,2),
  demand_level      VARCHAR(10) CHECK (demand_level IN ('LOW','MEDIUM','HIGH')),
  recommendation    TEXT,
  forecast_week     DATE,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(160),
  message     TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ---------- Indexes ----------
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_forecasts_product ON demand_forecasts(product_name);