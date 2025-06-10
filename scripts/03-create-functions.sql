-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON kyc_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update service rating when a review is added
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE services 
    SET 
        rating = (SELECT AVG(rating) FROM reviews WHERE service_id = NEW.service_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE service_id = NEW.service_id)
    WHERE id = NEW.service_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for service rating updates
CREATE TRIGGER update_service_rating_trigger 
    AFTER INSERT ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_service_rating();

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for conversation updates
CREATE TRIGGER update_conversation_last_message_trigger 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_last_message();
