-- Insert service categories
INSERT INTO service_categories (id, name, description, icon) VALUES
  (uuid_generate_v4(), 'Cleaning', 'Home and office cleaning services', 'sparkles'),
  (uuid_generate_v4(), 'Electronics', 'Electronic device repair and installation', 'zap'),
  (uuid_generate_v4(), 'Painting', 'Interior and exterior painting services', 'paintbrush'),
  (uuid_generate_v4(), 'Beauty', 'Hair styling, makeup, and beauty services', 'scissors'),
  (uuid_generate_v4(), 'Automotive', 'Car repair and maintenance services', 'car'),
  (uuid_generate_v4(), 'Plumbing', 'Plumbing installation and repair', 'wrench'),
  (uuid_generate_v4(), 'Carpentry', 'Furniture making and wood work', 'hammer'),
  (uuid_generate_v4(), 'Gardening', 'Garden maintenance and landscaping', 'leaf');

-- Insert admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Sarah', 'Mbeki', 'admin', true);

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, avatar_url, is_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'marie@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Marie', 'Dubois', '+237699456789', 'provider', '/placeholder.svg?height=100&width=100', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'jean@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Jean', 'Kouam', '+237655987654', 'client', '/placeholder.svg?height=100&width=100', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'paul@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Paul', 'Ngozi', '+237677123456', 'provider', '/placeholder.svg?height=100&width=100', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'alice@houseman.cm', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Alice', 'Kamga', '+237698765432', 'provider', '/placeholder.svg?height=100&width=100', false);

-- Insert user profiles
INSERT INTO user_profiles (user_id, bio, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Professional cleaner with 5 years experience', '{"address": "Douala, Cameroon", "city": "Douala", "country": "Cameroon", "latitude": 4.0511, "longitude": 9.7679}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Looking for reliable home services', '{"address": "Yaoundé, Cameroon", "city": "Yaoundé", "country": "Cameroon", "latitude": 3.848, "longitude": 11.5021}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Certified electrician with trade license', '{"address": "Bamenda, Cameroon", "city": "Bamenda", "country": "Cameroon", "latitude": 5.9631, "longitude": 10.1591}'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Professional hairstylist and makeup artist', '{"address": "Yaoundé, Cameroon", "city": "Yaoundé", "country": "Cameroon", "latitude": 3.848, "longitude": 11.5021}');

-- Insert sample services (only for verified providers with profile pictures)
INSERT INTO services (id, provider_id, category_id, title, description, price, images, availability, service_area, rating, review_count) VALUES
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM service_categories WHERE name = 'Cleaning'), 'Professional Home Cleaning', 'Deep cleaning service for homes and apartments. Includes kitchen, bathroom, living areas, and bedrooms.', 15000, ARRAY['/placeholder.svg?height=300&width=400'], '{"monday": ["09:00", "17:00"], "tuesday": ["09:00", "17:00"], "wednesday": ["09:00", "17:00"], "thursday": ["09:00", "17:00"], "friday": ["09:00", "17:00"], "saturday": ["10:00", "16:00"]}', '{"address": "Douala, Cameroon", "radius": 15}', 4.8, 124),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM service_categories WHERE name = 'Electronics'), 'Electrical Installation & Repair', 'Professional electrical services including wiring, outlet installation, and appliance repair.', 8000, ARRAY['/placeholder.svg?height=300&width=400'], '{"monday": ["08:00", "18:00"], "tuesday": ["08:00", "18:00"], "wednesday": ["08:00", "18:00"], "thursday": ["08:00", "18:00"], "friday": ["08:00", "18:00"], "saturday": ["09:00", "15:00"]}', '{"address": "Bamenda, Cameroon", "radius": 20}', 4.9, 89);
