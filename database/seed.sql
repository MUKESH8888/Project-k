-- ============================================================
-- KALYANAM SHOPPING MALL - Seed Data
-- Matches the original in-memory mock data in lib/db.js
-- ============================================================

-- -----------------------------------------------------------
-- USERS
-- -----------------------------------------------------------
INSERT INTO users (id, name, email, password, phone, role, created_at, updated_at) VALUES
('usr_1', 'Sunitha Rao', 'sunitha@kalyanammall.com', 'sunitha123', '+91 98491 23456', 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('admin_1', 'Sri Ramalingam', 'admin@kalyanammall.com', 'admin123', '+91 98490 00000', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- -----------------------------------------------------------
-- USER ADDRESSES
-- -----------------------------------------------------------
INSERT INTO user_addresses (id, user_id, name, type, address, phone, is_primary, created_at) VALUES
('addr1', 'usr_1', 'Sunitha Rao', 'Home', 'Flat 402, Sri Krishna Nilayam, Road No. 10, Banjara Hills, Hyderabad, Telangana - 500034', '+91 98491 23456', TRUE, CURRENT_TIMESTAMP),
('addr2', 'usr_1', 'Raghavendra Rao (Father''s Residence)', 'Family', 'Door 3-6-288, Himayatnagar Main Road, Near Liberty Circle, Hyderabad, Telangana - 500029', '+91 98491 00000', FALSE, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------
-- PRODUCTS (subset of the original mock catalog)
-- -----------------------------------------------------------
INSERT INTO products (id, sku, department, category, occasion, color_family, zari_type, title, telugu, href, image, price, original_price, discount, stock, rating, reviews_count, colors, delivery_note, created_at, updated_at) VALUES
('prod_1', 'KLM-W-001', 'women', 'Kanchipuram Pattu', 'Bridal Muhurtham', 'red', 'Pure Gold & Silver Zari', 'Swarna Kanchi Pure Silk Saree - Sindhoori Vermilion Red with Korvai Gold Border', 'సిందూర ఎరుపు కkinchi పట్టు చೀರ', '/product/swarna-kanchi-pure-silk-saree', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 42500, 50000, '15% OFF', 4, 4.9, 128, '["#8E1624", "#520B16", "#D49E35"]', 'Free Insured Delivery Across Telangana & India', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_2', 'KLM-W-002', 'women', 'Bridal Pattu', 'Bridal Muhurtham', 'pink', 'Pure Gold & Silver Zari', 'Rani Pink Royal Bridal Brocade Kanchipuram Pattu with Peacock Zari', 'రాణీ గులాబీ రాయల్ పెళ్లి పట్టు', '/product/swarna-kanchi-pure-silk-saree', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 58000, 65000, '10% OFF', 2, 5.0, 94, '["#B81D52", "#751E2B"]', 'Tested Silver & Gold Zari', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_8', 'KLM-M-004', 'men', 'Kurta Sets', 'Reception Grandeur', 'wine', 'Tested Silver Zari', 'Jacquard Silk Groom Kurta & Churidar Set with Embroidered Stole', 'జాక్వార్డ్ సిల్క్ కుర్తా పైజామా సెట్', '/product/swarna-kanchi-pure-silk-saree', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 12900, 15500, '16% OFF', 8, 4.7, 46, '["#800020", "#C5A04B"]', 'Festive & Muhurtham Ready', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_m5', 'KLM-M-005', 'men', 'Pattu Panche & Dhotis', 'Puja & Traditional rituals', 'gold', 'Pure Gold & Silver Zari', 'Telangana Heritage Khadi Silk Pattu Dhoti Set with Temple Zari Border', 'తెలంగాణ చేనేత పట్టు ధోతీ సెట్', '/product/swarna-kanchi-pure-silk-saree', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', 14200, 16800, '15% OFF', 5, 4.9, 43, '["#FFF8F6", "#C5A04B"]', 'Handwoven in Telangana Looms', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_k5', 'KLM-K-005', 'kids', 'Girls Pattu Pavada', 'Bridal Muhurtham', 'red', 'Pure Gold & Silver Zari', 'Auspicious Crimson Red & Gold Zari Pure Silk Pattu Pavada Set for Girls', 'ఎరుపు పట్టు పావడ సెట్', '/product/swarna-kanchi-pure-silk-saree', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80', 7500, 8800, '14% OFF', 5, 4.9, 35, '["#8E1624", "#C5A04B"]', 'Pure Mulberry Silk with Tested Zari', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_k6', 'KLM-K-006', 'kids', 'Boys Kurta Sets', 'Puja & Traditional rituals', 'yellow', 'Tested Silver Zari', 'Turmeric Yellow Silk Kurta with Gold Zari Border Traditional Kanduva', 'పసుపు పట్టు కుర్తా & కండువా', '/product/swarna-kanchi-pure-silk-saree', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80', 5900, 6900, '14% OFF', 8, 4.8, 28, '["#E5A912", "#FFF8F6"]', 'Breathable Natural Silk Blend', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------
-- ORDERS
-- -----------------------------------------------------------
INSERT INTO orders (id, customer_name, customer_email, customer_phone, total_amount, status, payment_method, shipping_address, order_date, created_at, updated_at) VALUES
('KLM-20261018-001', 'Lakshmi Devi', 'lakshmi@example.com', '+91 98765 43210', 28500, 'Confirmed', 'UPI Instant Transfer', 'Plot 45, Jubilee Hills, Hyderabad - 500033', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KLM-20261018-002', 'Priya Reddy', 'priya.reddy@example.com', '+91 97018 12345', 32000, 'Processing', 'Credit Card', 'Door 12-4, Benz Circle, Vijayawada - 520010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KLM-20261017-015', 'Radha Krishna Varma', 'radha.krishna@example.com', '+91 94401 98765', 45000, 'Dispatched', 'Net Banking', 'Sector 5, MVP Colony, Visakhapatnam - 530017', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('KLM-20261017-014', 'Sita Ramamurthy', 'sita.ram@example.com', '+91 98492 55555', 21000, 'Delivered', 'UPI Instant Transfer', 'Flat 101, Himayatnagar, Hyderabad - 500029', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------
-- ORDER ITEMS
-- -----------------------------------------------------------
INSERT INTO order_items (id, order_id, product_id, title, price, quantity, shade, created_at) VALUES
('oi_1', 'KLM-20261018-001', NULL, 'Red Kanchipuram Pattu Saree', 28500, 1, 'Sindhoori Red', CURRENT_TIMESTAMP),
('oi_2', 'KLM-20261018-002', NULL, 'Royal Blue Banarasi Saree', 32000, 1, 'Midnight Blue', CURRENT_TIMESTAMP),
('oi_3', 'KLM-20261017-015', NULL, 'Bridal Gold Kanchipuram Set', 45000, 1, 'Temple Gold', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('oi_4', 'KLM-20261017-014', NULL, 'Green Gadwal Temple Border', 21000, 1, 'Mayilkan Green', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------
-- APPOINTMENTS
-- -----------------------------------------------------------
INSERT INTO appointments (id, time, appointment_date, slot, customer_name, customer_phone, weaves, status, language, stylist, created_at, updated_at) VALUES
('apt_1', '10:00 AM', CURRENT_DATE, '11:00 AM - 12:00 PM', 'Bhavani Devi', '+91 98765 11111', '["Kanchipuram", "Muhurtham Red"]', 'Booked', 'Telugu', 'Master Saree Stylist Sri Ramalingam', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('apt_2', '11:30 AM', CURRENT_DATE, '07:00 PM - 08:00 PM (US Friendly)', 'Kavitha Rao (NRI - California)', '+1 408 555 0192', '["Wedding Collection", "Banarasi"]', 'Booked', 'English / Telugu', 'Senior Stylist Smt. Hemalatha', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('apt_3', '02:00 PM', CURRENT_DATE - INTERVAL '1 day', '02:00 PM - 03:00 PM', 'Swathi Reddy', '+91 91234 88888', '["Banarasi Silk", "Gadwal"]', 'Completed', 'Telugu', 'Senior Stylist Smt. Hemalatha', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- END OF SEED DATA
-- ============================================================