# HomeEase Database Documentation 🗄️

Complete relational database for the **Smart Home Service Automation (HomeEase)** project.

Compatible with:
- **SQLite** (Default local DB included: `smarthome.db`)
- **MySQL / MariaDB** (Import `schema.sql` and `seed_data.sql`)
- **PostgreSQL** (Compatible schema & queries)

---

## 📁 Database Files

| File | Description |
|---|---|
| `schema.sql` | 12 relational tables with foreign keys, checks, and performance indexes |
| `seed_data.sql` | Authentic starter data matching the UI screens (users, bookings, alerts, services) |
| `smarthome.db` | Ready-to-use compiled SQLite database file |
| `init_db.py` | Automated rebuild/reset script |

---

## 📊 Entity Relationship & Tables

### 1. `users`
Stores system accounts for Customers, Service Providers, and Admins.
- `id`: Primary key
- `full_name`, `phone`, `email`, `password_hash`
- `role`: `'customer' | 'provider' | 'admin'`
- `avatar_url`: User profile photo
- `nid_verified`: Government NID verification status
- `status`: `'active' | 'suspended' | 'pending'`

### 2. `service_categories`
Top-level categories shown in the Explore Services grid.
- `id`, `name`, `slug`, `description`, `icon`, `pros_count`
- Example: *Appliance & Gadgets (42 pros), Plumbing (28 pros), Electrical (35 pros)*

### 3. `services`
Specific catalog items under categories with base pricing.
- `id`, `category_id`, `name`, `base_price`, `estimated_duration_mins`, `warranty_days`
- Example: *AC Filter Servicing (৳1,200), AC Deep Servicing & Gas Refill (৳2,850)*

### 4. `service_providers`
Profile and location telemetry for assigned technicians.
- `id`, `user_id` (FK to `users`)
- `specialty`, `hub_location` (e.g. *Dhaka North Hub*)
- `experience_years`, `rating` (e.g. *4.9*), `total_reviews`
- `vehicle_type`, `vehicle_number` (e.g. *Hero Honda Splendor - Dhaka Metro-Ha 42-9912*)
- `current_lat`, `current_lng`, `is_available`

### 5. `customer_addresses`
Saved locations for booking logistics.
- `id`, `user_id`, `label` (*Home / Office*), `address_line`, `area`, `city`, `is_default`

### 6. `bookings`
Central table managing service orders and dispatch state.
- `id`, `order_code` (e.g. *#HE-8824-DH*)
- `customer_id`, `technician_id`, `service_id`, `address_id`
- `preferred_date`, `preferred_time_slot` (*morning / afternoon / evening*)
- `priority` (*normal / priority / urgent*)
- `status` (*pending / accepted / on_the_way / in_progress / completed / cancelled*)
- `eta_minutes`, `distance_km`, `otp_code` (*e.g. 4829*)
- `base_fare`, `priority_fee`, `discount_amount`, `total_amount`

### 7. `booking_timeline`
Live GPS & operational milestones for live tracking screen.
- Steps: *1. Service Requested → 2. Technician Accepted → 3. On The Way → 4. Service In Progress → 5. Completed & Signed*

### 8. `payments`
Financial transaction records for bKash, Nagad, card, and cash.
- `id`, `booking_id`, `customer_id`, `payment_method`, `transaction_id`, `amount`, `status`

### 9. `notifications`
Push alerts and notifications matching the Alerts screen.
- Categories: `'service' | 'payment' | 'system'`
- Unread status tracking and action links

### 10. `reviews`
Post-service ratings (1–5 stars) and customer feedback comments.

### 11. `promotions`
Banner promotional deals (e.g. *Summer Cool Deal 20% Off*).

---

## 🚀 How to Run & Initialize

### 1. SQLite (Instant - Python)
```bash
python database/init_db.py
```
This builds or refreshes `database/smarthome.db` immediately.

### 2. MySQL / MariaDB
```bash
mysql -u root -p -e "CREATE DATABASE homeease_db;"
mysql -u root -p homeease_db < database/schema.sql
mysql -u root -p homeease_db < database/seed_data.sql
```

### 3. PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE homeease_db;"
psql -U postgres -d homeease_db -f database/schema.sql
psql -U postgres -d homeease_db -f database/seed_data.sql
```
