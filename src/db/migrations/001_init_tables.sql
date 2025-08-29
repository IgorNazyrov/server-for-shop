-- 001_init_tables.sql
-- Initializing Basic Tables and Data Types

-- ======================
-- Creating custom types
-- ======================
CREATE TYPE category_type AS ENUM (
  'beauty', 'fragrances', 'furniture', 'groceries', 'skincare',
  'electronics', 'home', 'kitchen', 'fitness', 'health',
  'wearables', 'transport', 'supplements', 'smart home', 'baby',
  'automotive', 'office', 'garden', 'travel', 'outdoors'
);

CREATE TYPE dimensions_type AS (
  width NUMERIC(10, 2),
  height NUMERIC(10, 2),
  depth NUMERIC(10, 2)
);

CREATE TYPE meta_type AS (
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  barcode VARCHAR(100),
  qr_code VARCHAR(500)
);

-- ======================
-- Table users
-- ======================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL 
    CHECK (username ~ '^[a-zA-Z0-9_]+$'),
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL 
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- ======================
-- Table products
-- ======================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  category category_type,
  discount_percentage NUMERIC(5, 2) 
    CHECK (discount_percentage BETWEEN 0 AND 100),
  rating NUMERIC(3, 2) CHECK (rating BETWEEN 0 AND 5),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  tags TEXT[],
  brand VARCHAR(100),
  sku VARCHAR(50) GENERATED ALWAYS AS ('PROD-' || id) STORED UNIQUE,
  weight NUMERIC(10, 2) CHECK (weight >= 0),
  dimensions dimensions_type,
  warranty_information INTERVAL,
  shipping_information INTEGER CHECK (shipping_information >= 0),
  availability_status BOOLEAN DEFAULT TRUE,
  return_policy INTEGER DEFAULT 14 CHECK (return_policy >= 0),
  minimum_order_quantity INTEGER DEFAULT 1 CHECK (minimum_order_quantity > 0),
  meta meta_type,
  images TEXT[] CHECK (array_length(images, 1) > 0),
  thumbnail VARCHAR(500),
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- ======================
-- Table reviews
-- ======================
CREATE TABLE product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  rating NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_approved BOOLEAN DEFAULT FALSE
);

-- ======================
-- Table orders
-- ======================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL
);

-- ======================
-- Table order items
-- ======================
CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  discount NUMERIC(5,2) DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
  PRIMARY KEY (order_id, product_id)
);