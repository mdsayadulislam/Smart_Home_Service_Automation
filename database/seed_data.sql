-- ============================================================
-- Smart Home Service Automation (HomeEase) Sample Seed Data
-- ============================================================

-- 1. USERS
INSERT INTO users (id, full_name, phone, email, password_hash, role, avatar_url, nid_verified, status) VALUES
(1, 'Md. Sayadul Islam', '+8801712345678', 'sayadul@email.com', '$2b$10$w8cO1qLgIu3gC1vXqUqS8.qFfV0fG7fX9eQx1mZ2jK3lM4nO5pP6q', 'customer', '../assets/images/avatar-sayad.jpg', 1, 'active'),
(2, 'Rahim Uddin', '+8801722334455', 'rahim.uddin@homeease.bd', '$2b$10$w8cO1qLgIu3gC1vXqUqS8.qFfV0fG7fX9eQx1mZ2jK3lM4nO5pP6q', 'provider', '../assets/images/logo.png', 1, 'active'),
(3, 'Kazi Rahim', '+8801733445566', 'kazi.rahim@homeease.bd', '$2b$10$w8cO1qLgIu3gC1vXqUqS8.qFfV0fG7fX9eQx1mZ2jK3lM4nO5pP6q', 'provider', '../assets/images/logo.png', 1, 'active'),
(4, 'Karim Ali', '+8801744556677', 'karim.ali@homeease.bd', '$2b$10$w8cO1qLgIu3gC1vXqUqS8.qFfV0fG7fX9eQx1mZ2jK3lM4nO5pP6q', 'provider', '../assets/images/logo.png', 1, 'active'),
(5, 'Rashida Begum', '+8801755667788', 'rashida.begum@homeease.bd', '$2b$10$w8cO1qLgIu3gC1vXqUqS8.qFfV0fG7fX9eQx1mZ2jK3lM4nO5pP6q', 'provider', '../assets/images/logo.png', 1, 'active');

-- 2. SERVICE CATEGORIES
INSERT INTO service_categories (id, name, slug, description, icon, pros_count, display_order) VALUES
(1, 'Appliance & Gadgets', 'appliance-gadgets', 'Microwave, AC, TV & Washing Machine repair', 'tv', 42, 1),
(2, 'Plumbing', 'plumbing', 'Leakage, Pipe Fitting & sanitary installations', 'wrench', 28, 2),
(3, 'Electrical', 'electrical', 'Short circuit, Fan, Switchboard & Wiring repair', 'zap', 35, 3),
(4, 'Cleaning & Pest', 'cleaning-pest', 'Deep home clean, disinfection & pest control', 'home', 51, 4),
(5, 'Home Maintenance', 'home-maintenance', 'Painting, Carpentry, Drill & Wall mount services', 'tool', 19, 5),
(6, 'Moving & Shifting', 'moving-shifting', 'Apartment relocation, Furniture packaging & transport', 'truck', 14, 6),
(7, 'Car Care & Repair', 'car-care', 'Water wash, Mechanic on-demand & battery jumpstart', 'car', 22, 7),
(8, 'Personal Care', 'personal-care', 'Salon, Spa & Grooming at home for Men & Women', 'heart', 37, 8);

-- 3. SERVICES
INSERT INTO services (id, category_id, name, description, base_price, estimated_duration_mins, warranty_days) VALUES
(1, 1, 'AC Filter Servicing', 'Complete air filter dust wash and jet spray cleaning for 1-2 ton AC', 1200.00, 45, 7),
(2, 1, 'AC Deep Servicing & Gas Refill', 'Master pressure wash, condenser flush & R410A gas refill', 2850.00, 90, 7),
(3, 2, 'Pipe Leakage Repair', 'Fix leaking pipes, joint sealing & bathroom fixture replacement', 800.00, 60, 7),
(4, 3, 'Ceiling Fan Installation & Wiring', 'Ceiling fan mounting, speed regulator & wire insulation', 650.00, 40, 7),
(5, 4, 'Complete Home Deep Cleaning', 'Full house vacuuming, floor scrubbing, bathroom tile sanitization', 1500.00, 180, 14);

-- 4. SERVICE PROVIDERS / TECHNICIANS
INSERT INTO service_providers (id, user_id, specialty, hub_location, experience_years, rating, total_reviews, vehicle_type, vehicle_number, is_verified, is_available) VALUES
(1, 2, 'Split & Inverter AC Specialist', 'Gulshan Hub', 3.5, 4.8, 142, 'Motorcycle', 'Dhaka Metro-Ha 33-1122', 1, 1),
(2, 3, 'Master HVAC Expert', 'Dhaka North Hub', 4.8, 4.9, 218, 'Hero Honda Splendor', 'Dhaka Metro-Ha 42-9912', 1, 1),
(3, 4, 'Master Sanitary & Pipe Technician', 'Banani Hub', 5.0, 4.7, 98, 'Motorcycle', 'Dhaka Metro-La 12-3456', 1, 1),
(4, 5, 'Residential Deep Clean Supervisor', 'Dhaka North Hub', 4.0, 4.7, 160, 'Public Transport', NULL, 1, 1);

-- 5. CUSTOMER ADDRESSES
INSERT INTO customer_addresses (id, user_id, label, address_line, area, city, latitude, longitude, is_default) VALUES
(1, 1, 'Home', 'House 42, Road 11, Banani', 'Banani', 'Dhaka', 23.7937, 90.4066, 1),
(2, 1, 'Office', 'Level 4, Bashundhara City', 'Panthapath', 'Dhaka', 23.7510, 90.3905, 0);

-- 6. BOOKINGS
INSERT INTO bookings (id, order_code, customer_id, technician_id, service_id, address_id, preferred_date, preferred_time_slot, priority, problem_description, status, eta_minutes, distance_km, otp_code, base_fare, priority_fee, discount_amount, total_amount) VALUES
(1, 'HE-8824-DH', 1, 2, 2, 1, '2026-09-08', 'morning', 'urgent', 'AC is blowing warm air and making a vibrating sound since yesterday afternoon.', 'on_the_way', 14, 2.4, '4829', 2850.00, 300.00, 300.00, 2850.00),
(2, 'HE-7911-DH', 1, 1, 1, 1, '2026-09-08', 'morning', 'normal', 'AC filter servicing and basic checkup.', 'on_the_way', 12, 1.8, '3192', 1200.00, 0.00, 0.00, 1200.00),
(3, 'HE-6523-DH', 1, 3, 3, 1, '2026-09-10', 'afternoon', 'normal', 'Kitchen sink leakage below cabinet.', 'accepted', NULL, NULL, '7140', 800.00, 0.00, 0.00, 800.00),
(4, 'HE-5102-DH', 1, NULL, 4, 1, '2026-09-03', 'morning', 'normal', 'Ceiling fan wiring installation in living room.', 'cancelled', NULL, NULL, '0000', 650.00, 0.00, 0.00, 650.00),
(5, 'HE-4390-DH', 1, 4, 5, 1, '2026-08-28', 'morning', 'normal', 'Deep home clean full apartment.', 'completed', NULL, NULL, '5511', 1500.00, 0.00, 0.00, 1500.00);

-- 7. BOOKING TIMELINE (for #HE-8824-DH)
INSERT INTO booking_timeline (booking_id, step_title, step_description, step_order, status, completed_time) VALUES
(1, 'Service Requested', 'Confirmed via HomeEase automated booking', 1, 'completed', '02:15 PM'),
(1, 'Technician Accepted', 'Kazi Rahim assigned & dispatched tool set', 2, 'completed', '02:22 PM'),
(1, 'On The Way', 'En-route on Hero Honda Splendor (Dhaka Metro-Ha 42-9912)', 3, 'current', 'Now'),
(1, 'Service In Progress', 'Pressure cleaning, condenser flush & R410A gas refill', 4, 'pending', 'Est. 02:45 PM'),
(1, 'Completed & Signed', 'Digital warranty card handover & ৳2,850 settlement', 5, 'pending', 'Est. 03:45 PM');

-- 8. PAYMENTS
INSERT INTO payments (id, booking_id, customer_id, payment_method, account_mask, transaction_id, amount, status, paid_at) VALUES
(1, 1, 1, 'bkash', '•••• 5678', 'TRX-BK-99824128', 2850.00, 'completed', CURRENT_TIMESTAMP),
(2, 5, 1, 'bkash', '•••• 5678', 'TRX-BK-77123901', 1500.00, 'completed', '2026-08-28 16:30:00');

-- 9. NOTIFICATIONS / ALERTS
INSERT INTO notifications (user_id, category, title, message, icon, accent_color, is_read, created_at) VALUES
(1, 'service', 'Rahim Uddin is 14 mins away', 'Your AC Filter Servicing technician is en-route to your location.', '🏍️', 'orange', 0, CURRENT_TIMESTAMP),
(1, 'service', 'Booking Confirmed #HE-8824', 'Your AC Deep Servicing is confirmed for Today 2:15 PM.', '✅', 'green', 0, CURRENT_TIMESTAMP),
(1, 'payment', 'Payment Received ৳2,850', 'AC Deep Servicing payment processed via bKash.', '💳', 'blue', 0, CURRENT_TIMESTAMP),
(1, 'service', 'Rate Your Experience', 'How was your service by Kazi Rahim? Tap to rate.', '⭐', 'yellow', 0, CURRENT_TIMESTAMP),
(1, 'service', 'Service Completed', 'AC Deep Servicing by Kazi Rahim marked complete. OTP verified.', '🔧', 'gray', 1, '2026-09-07 15:45:00'),
(1, 'service', 'Special Offer!', '20% off AC Servicing this week. Book now before Sep 15.', '📢', 'gray', 1, '2026-09-07 10:00:00'),
(1, 'service', 'New Message', 'Kazi Rahim: "I will arrive with R410A gas and tools."', '💬', 'gray', 1, '2026-09-06 14:10:00'),
(1, 'system', 'Account Verified', 'Your HomeEase account is fully verified. BD Secure active.', '✅', 'gray', 1, '2026-09-05 09:00:00');

-- 10. REVIEWS
INSERT INTO reviews (booking_id, customer_id, technician_id, rating, review_text) VALUES
(5, 1, 4, 5, 'Super clean service! Rashida and team arrived on time and did a fantastic job.');

-- 11. PROMOTIONS
INSERT INTO promotions (title, badge_tag, discount_percentage, description, valid_until, is_active) VALUES
('20% off AC Servicing & Deep Cleaning', 'SUMMER COOL DEAL', 20, 'Stay chilled in Dhaka heat with verified pros.', '2026-09-30', 1);
