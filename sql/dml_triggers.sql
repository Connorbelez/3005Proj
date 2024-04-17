
CREATE OR REPLACE FUNCTION update_bookings_on_class_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO bookings (class_id, room_id, start_time, end_time)
        VALUES (NEW.class_id, NEW.room_id, NEW.start_time, NEW.end_time);
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE bookings
        SET room_id = NEW.room_id,
            start_time = NEW.start_time,
            end_time = NEW.end_time
        WHERE class_id = NEW.class_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_class_change
AFTER INSERT OR UPDATE ON classes
FOR EACH ROW
EXECUTE PROCEDURE update_bookings_on_class_change();


CREATE OR REPLACE FUNCTION add_billing_for_group_class()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO billing (member_id, service_type, amount, payment_date, status)
    VALUES (NEW.member_id, 'groupClass', 20.00, CURRENT_DATE, 'paid');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_group_class_registration
AFTER INSERT ON class_registrations
FOR EACH ROW
EXECUTE FUNCTION add_billing_for_group_class();


CREATE OR REPLACE FUNCTION add_billing_for_personal_training()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO billing (member_id, service_type, amount, payment_date, status)
    VALUES (NEW.member_id, 'personal training', 50.00, CURRENT_DATE, 'paid');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_personal_training_registration
AFTER INSERT ON personal_training_sessions
FOR EACH ROW
EXECUTE FUNCTION add_billing_for_personal_training();


