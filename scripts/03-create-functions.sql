-- Function to update provider rating when a new review is added
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new average rating
  UPDATE provider_profiles
  SET 
    rating = (
      SELECT AVG(r.rating)
      FROM reviews r
      WHERE r.provider_id = NEW.provider_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews r
      WHERE r.provider_id = NEW.provider_id
    ),
    updated_at = NOW()
  WHERE user_id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update provider rating
DROP TRIGGER IF EXISTS update_provider_rating_trigger ON reviews;
CREATE TRIGGER update_provider_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_provider_rating();

-- Function to update conversation last_message_at when a new message is added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON messages;
CREATE TRIGGER update_conversation_timestamp_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Function to automatically create a notification when a booking status changes
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    -- Notification for client
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      is_read,
      action_url
    )
    VALUES (
      NEW.client_id,
      'booking_status_change',
      'Booking Status Updated',
      'Your booking status has changed to ' || NEW.status,
      FALSE,
      '/bookings/' || NEW.id
    );
    
    -- Notification for provider
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      is_read,
      action_url
    )
    VALUES (
      NEW.provider_id,
      'booking_status_change',
      'Booking Status Updated',
      'A booking status has changed to ' || NEW.status,
      FALSE,
      '/bookings/' || NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking status change notifications
DROP TRIGGER IF EXISTS booking_notification_trigger ON bookings;
CREATE TRIGGER booking_notification_trigger
AFTER UPDATE ON bookings
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION create_booking_notification();
