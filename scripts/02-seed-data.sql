-- Insert service categories with proper icons
INSERT INTO service_categories (id, name, description, icon) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'Cleaning', 'Home and office cleaning services', 'sparkles'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Electronics', 'Electronic device repair and installation', 'zap'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Painting', 'Interior and exterior painting services', 'paintbrush'),
  ('550e8400-e29b-41d4-a716-446655440013', 'Beauty', 'Hair styling, makeup, and beauty services', 'scissors'),
  ('550e8400-e29b-41d4-a716-446655440014', 'Automotive', 'Car repair and maintenance services', 'car'),
  ('550e8400-e29b-41d4-a716-446655440015', 'Plumbing', 'Plumbing installation and repair', 'wrench'),
  ('550e8400-e29b-41d4-a716-446655440016', 'Carpentry', 'Furniture making and wood work', 'hammer'),
  ('550e8400-e29b-41d4-a716-446655440017', 'Gardening', 'Garden maintenance and landscaping', 'leaf')
ON CONFLICT (id) DO NOTHING;

-- Insert admin user with hashed password
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Sarah', 'Mbeki', 'admin', true, '/placeholder.svg?height=100&width=100')
ON CONFLICT (email) DO NOTHING;

-- Insert sample users with profile pictures
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, avatar_url, is_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'marie@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Marie', 'Dubois', '+237699456789', 'provider', '/placeholder.svg?height=100&width=100', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'jean@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Jean', 'Kouam', '+237655987654', 'client', '/placeholder.svg?height=100&width=100', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'paul@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Paul', 'Ngozi', '+237677123456', 'provider', '/placeholder.svg?height=100&width=100', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'alice@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Alice', 'Kamga', '+237698765432', 'provider', '/placeholder.svg?height=100&width=100', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'david@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'David', 'Tchinda', '+237677888999', 'provider', '/placeholder.svg?height=100&width=100', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'grace@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Grace', 'Nkomo', '+237655444555', 'client', '/placeholder.svg?height=100&width=100', true)
ON CONFLICT (email) DO NOTHING;

-- Insert user profiles
INSERT INTO user_profiles (user_id, bio, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Professional cleaner with 5 years experience', '{"address": "Douala, Cameroon", "city": "Douala", "country": "Cameroon", "latitude": 4.0511, "longitude": 9.7679}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Looking for reliable home services', '{"address": "Yaoundé, Cameroon", "city": "Yaoundé", "country": "Cameroon", "latitude": 3.848, "longitude": 11.5021}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Certified electrician with trade license', '{"address": "Bamenda, Cameroon", "city": "Bamenda", "country": "Cameroon", "latitude": 5.9631, "longitude": 10.1591}'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Professional hairstylist and makeup artist', '{"address": "Yaoundé, Cameroon", "city": "Yaoundé", "country": "Cameroon", "latitude": 3.848, "longitude": 11.5021}'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Expert automotive technician', '{"address": "Douala, Cameroon", "city": "Douala", "country": "Cameroon", "latitude": 4.0511, "longitude": 9.7679}'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Business owner seeking quality services', '{"address": "Yaoundé, Cameroon", "city": "Yaoundé", "country": "Cameroon", "latitude": 3.848, "longitude": 11.5021}')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample services (only for verified providers with profile pictures)
INSERT INTO services (id, provider_id, category_id, title, description, price, images, availability, service_area, rating, review_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Professional Home Cleaning', 'Deep cleaning service for homes and apartments. Includes kitchen, bathroom, living areas, and bedrooms.', 15000, ARRAY['/placeholder.svg?height=300&width=400'], '{"monday": ["09:00", "17:00"], "tuesday": ["09:00", "17:00"], "wednesday": ["09:00", "17:00"], "thursday": ["09:00", "17:00"], "friday": ["09:00", "17:00"], "saturday": ["10:00", "16:00"]}', '{"address": "Douala, Cameroon", "radius": 15}', 4.8, 124),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 'Electrical Installation & Repair', 'Professional electrical services including wiring, outlet installation, and appliance repair.', 8000, ARRAY['/placeholder.svg?height=300&width=400'], '{"monday": ["08:00", "18:00"], "tuesday": ["08:00", "18:00"], "wednesday": ["08:00", "18:00"], "thursday": ["08:00", "18:00"], "friday": ["08:00", "18:00"], "saturday": ["09:00", "15:00"]}', '{"address": "Bamenda, Cameroon", "radius": 20}', 4.9, 89),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440013', 'Hair Styling & Makeup', 'Professional hair styling and makeup services for special events and everyday looks.', 12000, ARRAY['/placeholder.svg?height=300&width=400'], '{"tuesday": ["10:00", "18:00"], "wednesday": ["10:00", "18:00"], "thursday": ["10:00", "18:00"], "friday": ["10:00", "20:00"], "saturday": ["09:00", "19:00"], "sunday": ["12:00", "17:00"]}', '{"address": "Yaoundé, Cameroon", "radius": 10}', 4.7, 67),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', 'Car Repair & Maintenance', 'Complete automotive repair and maintenance services including oil changes, brake repair, and engine diagnostics.', 25000, ARRAY['/placeholder.svg?height=300&width=400'], '{"monday": ["07:00", "17:00"], "tuesday": ["07:00", "17:00"], "wednesday": ["07:00", "17:00"], "thursday": ["07:00", "17:00"], "friday": ["07:00", "17:00"], "saturday": ["08:00", "14:00"]}', '{"address": "Douala, Cameroon", "radius": 25}', 4.6, 156),
  ('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', 'Interior Painting', 'Professional interior painting services for homes and offices with quality materials.', 18000, ARRAY['/placeholder.svg?height=300&width=400'], '{"monday": ["08:00", "16:00"], "tuesday": ["08:00", "16:00"], "wednesday": ["08:00", "16:00"], "thursday": ["08:00", "16:00"], "friday": ["08:00", "16:00"]}', '{"address": "Douala, Cameroon", "radius": 20}', 4.5, 43)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, client_id, provider_id, service_id, status, scheduled_date, scheduled_time, address, notes, price) VALUES
  ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 'confirmed', CURRENT_DATE + INTERVAL '3 days', '10:00:00', 'Bastos, Yaoundé', 'Please bring eco-friendly cleaning products', 15000),
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440021', 'pending', CURRENT_DATE + INTERVAL '5 days', '14:00:00', 'Mendong, Yaoundé', 'Need to install new outlets in kitchen', 8000),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440022', 'completed', CURRENT_DATE - INTERVAL '2 days', '15:00:00', 'Bastos, Yaoundé', 'Wedding makeup and hair', 12000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample conversations
INSERT INTO conversations (id, participant_1, participant_2, booking_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030'),
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440031')
ON CONFLICT (participant_1, participant_2) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, content, is_read) VALUES
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440002', 'Hello Marie! I would like to book your cleaning service for this weekend.', true),
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 'Hello Jean! I would be happy to help. What time works best for you?', true),
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440002', 'Saturday morning around 10 AM would be perfect.', false),
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440006', 'Hi Paul, I need some electrical work done in my office. Are you available next week?', true),
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440003', 'Hello Grace! Yes, I am available. What kind of electrical work do you need?', false)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (booking_id, client_id, provider_id, service_id, rating, comment) VALUES
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440022', 5, 'Alice did an amazing job with my wedding makeup and hair! Highly recommended.')
ON CONFLICT DO NOTHING;

-- Insert KYC verifications for providers
INSERT INTO kyc_verifications (user_id, status, documents, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'approved', '[{"type": "national_id", "url": "/placeholder.svg", "verified": true}, {"type": "proof_of_address", "url": "/placeholder.svg", "verified": true}]', 'All documents verified successfully'),
  ('550e8400-e29b-41d4-a716-446655440003', 'approved', '[{"type": "national_id", "url": "/placeholder.svg", "verified": true}, {"type": "trade_license", "url": "/placeholder.svg", "verified": true}]', 'Electrician license verified'),
  ('550e8400-e29b-41d4-a716-446655440004', 'approved', '[{"type": "national_id", "url": "/placeholder.svg", "verified": true}, {"type": "certification", "url": "/placeholder.svg", "verified": true}]', 'Beauty certification verified'),
  ('550e8400-e29b-41d4-a716-446655440005', 'approved', '[{"type": "national_id", "url": "/placeholder.svg", "verified": true}, {"type": "trade_license", "url": "/placeholder.svg", "verified": true}]', 'Automotive certification verified')
ON CONFLICT (user_id) DO NOTHING;
