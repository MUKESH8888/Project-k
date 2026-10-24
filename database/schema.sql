-- ============================================================
-- KALYANAM SHOPPING MALL - PostgreSQL Schema
-- Indian Wedding Saree E-Commerce Database
-- ============================================================

-- Enable UUID extension if needed (not used here, keeping VARCHAR IDs to match mock)

-- -----------------------------------------------------------
-- 1. USERS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- 2. USER ADDRESSES (one-to-many from users)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_addresses (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- 3. PRODUCTS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE,
    department VARCHAR(100),
    category VARCHAR(255),
    occasion VARCHAR(255),
    color_family VARCHAR(100),
    zari_type VARCHAR(255),
    title TEXT NOT NULL,
    telugu TEXT,
    href VARCHAR(500),
    image TEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    original_price DECIMAL(12,2),
    discount VARCHAR(100),
    stock INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    colors JSONB DEFAULT '[]',
    delivery_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for product filtering (used by getProducts)
CREATE INDEX IF NOT EXISTS idx_products_department ON products(LOWER(department));
CREATE INDEX IF NOT EXISTS idx_products_category ON products(LOWER(category));
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- -----------------------------------------------------------
-- 4. ORDERS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(100),
    total_amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(100) DEFAULT 'Confirmed',
    payment_method VARCHAR(255),
    shipping_address TEXT,
    order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- -----------------------------------------------------------
-- 5. ORDER ITEMS (one-to-many from orders)
--   Note: product_id is nullable because mock data references
--   products by title, not by product id.
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id),
    title VARCHAR(255) NOT NULL,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    shade VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- -----------------------------------------------------------
-- 6. APPOINTMENTS (video consultation bookings)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    time VARCHAR(50),
    appointment_date DATE,
    slot VARCHAR(255),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(100),
    weaves JSONB DEFAULT '[]',
    status VARCHAR(100) DEFAULT 'Booked',
    language VARCHAR(100),
    stylist VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ============================================================
-- END OF SCHEMA
-- ============================================================