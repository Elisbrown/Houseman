-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kyc_verifications_updated_at ON kyc_verifications;
CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON kyc_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update service rating when a review is added
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE services 
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE service_id = NEW.service_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE service_id = NEW.service_id)
    WHERE id = NEW.service_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for service rating updates
DROP TRIGGER IF EXISTS update_service_rating_trigger ON reviews;
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
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON messages;
CREATE TRIGGER update_conversation_last_message_trigger 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_last_message();

-- Function to ensure unique conversations (regardless of participant order)
CREATE OR REPLACE FUNCTION ensure_unique_conversation()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if conversation already exists with participants in reverse order
    IF EXISTS (
        SELECT 1 FROM conversations 
        WHERE participant_1 = NEW.participant_2 
        AND participant_2 = NEW.participant_1
    ) THEN
        RAISE EXCEPTION 'Conversation already exists between these participants';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for unique conversations
DROP TRIGGER IF EXISTS ensure_unique_conversation_trigger ON conversations;
CREATE TRIGGER ensure_unique_conversation_trigger 
    BEFORE INSERT ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION ensure_unique_conversation();
