-- Insert demo users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, avatar_url, is_verified, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@houseman.cm', 'HousemanAdmin2024!', 'Sarah', 'Mbeki', '+237 677 123 456', 'admin', '/placeholder.svg?height=100&width=100', TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000002', 'client@houseman.cm', 'ClientDemo123!', 'Jean', 'Kouam', '+237 655 987 654', 'client', '/placeholder.svg?height=100&width=100', FALSE, TRUE),
  ('00000000-0000-0000-0000-000000000003', 'provider@houseman.cm', 'ProviderDemo123!', 'Marie', 'Dubois', '+237 699 456 789', 'provider', '/placeholder.svg?height=100&width=100', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert user profiles
INSERT INTO user_profiles (user_id, language, theme)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'en', 'system'),
  ('00000000-0000-0000-0000-000000000002', 'fr', 'light'),
  ('00000000-0000-0000-0000-000000000003', 'en', 'dark')
ON CONFLICT (user_id) DO NOTHING;

-- Insert service categories
INSERT INTO service_categories (id, name, description, icon)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Cleaning', 'Home and office cleaning services', 'spray-can'),
  ('00000000-0000-0000-0000-000000000002', 'Plumbing', 'Plumbing installation and repair', 'droplet'),
  ('00000000-0000-0000-0000-000000000003', 'Electrical', 'Electrical installation and repair', 'zap'),
  ('00000000-0000-0000-0000-000000000004', 'Gardening', 'Garden maintenance and landscaping', 'flower'),
  ('00000000-0000-0000-0000-000000000005', 'Painting', 'Interior and exterior painting', 'paint-bucket'),
  ('00000000-0000-0000-0000-000000000006', 'Moving', 'Moving and relocation services', 'truck')
ON CONFLICT (id) DO NOTHING;

-- Insert provider profile
INSERT INTO provider_profiles (user_id, bio, experience_years, kyc_status, rating, review_count)
VALUES
  ('00000000-0000-0000-0000-000000000003', 'Professional cleaner with over 5 years of experience in residential and commercial cleaning.', 5, 'approved', 4.8, 124)
ON CONFLICT (user_id) DO NOTHING;

-- Insert services
INSERT INTO services (id, provider_id, category_id, title, description, price, currency)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Professional Home Cleaning', 'Complete home cleaning service including dusting, vacuuming, mopping, and bathroom cleaning.', 15000, 'XAF'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Office Cleaning', 'Professional cleaning service for offices and commercial spaces.', 25000, 'XAF')
ON CONFLICT (id) DO NOTHING;

-- Insert service images
INSERT INTO service_images (service_id, image_url, is_primary)
VALUES
  ('00000000-0000-0000-0000-000000000001', '/placeholder.svg?height=300&width=400', TRUE),
  ('00000000-0000-0000-0000-000000000002', '/placeholder.svg?height=300&width=400', TRUE)
ON CONFLICT DO NOTHING;

-- Create a conversation between client and provider
INSERT INTO conversations (id, user1_id, user2_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert messages
INSERT INTO messages (conversation_id, sender_id, content, is_read)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hello, I am interested in your cleaning service. Are you available next week?', TRUE),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Hello! Yes, I am available next week. What day would work best for you?', FALSE)
ON CONFLICT DO NOTHING;

-- Insert a booking
INSERT INTO bookings (client_id, provider_id, service_id, status, booking_date, notes)
VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'confirmed', NOW() + INTERVAL '3 days', 'Please bring eco-friendly cleaning products.')
ON CONFLICT DO NOTHING;

-- Insert notifications
INSERT INTO notifications (user_id, type, title, message, is_read)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'booking_confirmation', 'Booking Confirmed', 'Your cleaning service has been confirmed for ' || (NOW() + INTERVAL '3 days')::text, FALSE),
  ('00000000-0000-0000-0000-000000000003', 'new_booking', 'New Booking', 'You have a new cleaning service booking for ' || (NOW() + INTERVAL '3 days')::text, FALSE)
ON CONFLICT DO NOTHING;
