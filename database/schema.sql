-- ============================================================
-- Smart Home Service Automation (HomeEase) Database Schema
-- Compatible with MySQL, PostgreSQL, and SQLite
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'provider', 'admin')),
    avatar_url VARCHAR(255) DEFAULT '../assets/images/avatar-sayad.jpg',
    nid_verified BOOLEAN DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS service_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    pros_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    display_order INTEGER DEFAULT 0
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estimated_duration_mins INTEGER DEFAULT 60,
    warranty_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE
);

-- 4. SERVICE PROVIDERS / TECHNICIANS TABLE
CREATE TABLE IF NOT EXISTS service_providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    specialty VARCHAR(150) NOT NULL,
    hub_location VARCHAR(100) DEFAULT 'Dhaka North Hub',
    experience_years DECIMAL(3, 1) DEFAULT 1.0,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    vehicle_type VARCHAR(50) DEFAULT 'Motorcycle',
    vehicle_number VARCHAR(50),
    current_lat DECIMAL(10, 7),
    current_lng DECIMAL(10, 7),
    is_verified BOOLEAN DEFAULT 1,
    is_available BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. CUSTOMER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS customer_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    address_line TEXT NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(50) DEFAULT 'Dhaka',
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_default BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. BOOKINGS / SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code VARCHAR(30) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    technician_id INTEGER,
    service_id INTEGER NOT NULL,
    address_id INTEGER NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(50) NOT NULL CHECK (preferred_time_slot IN ('morning', 'afternoon', 'evening')),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'priority', 'urgent')),
    problem_description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled')),
    eta_minutes INTEGER DEFAULT 14,
    distance_km DECIMAL(4, 1) DEFAULT 2.4,
    otp_code VARCHAR(10) NOT NULL,
    base_fare DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    priority_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (technician_id) REFERENCES service_providers(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES customer_addresses(id) ON DELETE RESTRICT
);

-- 7. LIVE TRACKING TIMELINE TABLE
CREATE TABLE IF NOT EXISTS booking_timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    step_title VARCHAR(100) NOT NULL,
    step_description TEXT,
    step_order INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'current', 'pending')),
    completed_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 8. SERVICE MEDIA / ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS booking_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'audio', 'document')),
    file_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('bkash', 'nagad', 'card', 'cash')),
    account_mask VARCHAR(20),
    transaction_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 10. NOTIFICATIONS / ALERTS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'service' CHECK (category IN ('service', 'payment', 'system')),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(20) DEFAULT '📢',
    accent_color VARCHAR(30) DEFAULT 'primary',
    is_read BOOLEAN DEFAULT 0,
    link_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    technician_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (technician_id) REFERENCES service_providers(id) ON DELETE RESTRICT
);

-- 12. PROMOTIONS / OFFERS TABLE
CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(150) NOT NULL,
    badge_tag VARCHAR(50) DEFAULT 'SUMMER COOL DEAL',
    discount_percentage INTEGER DEFAULT 20,
    description TEXT,
    valid_until DATE,
    is_active BOOLEAN DEFAULT 1
);

-- CREATE INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(order_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_timeline_booking ON booking_timeline(booking_id, step_order);
