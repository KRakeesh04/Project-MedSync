DELIMITER $$

CREATE TRIGGER bi_user_contact_one_default
BEFORE INSERT ON user_contact
FOR EACH ROW
BEGIN
  IF NEW.is_default THEN
    UPDATE user_contact
      SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND is_default = TRUE;
  END IF;
END$$

CREATE TRIGGER bu_user_contact_one_default
BEFORE UPDATE ON user_contact
FOR EACH ROW
BEGIN
  IF NEW.is_default AND (OLD.is_default <> NEW.is_default OR OLD.user_id <> NEW.user_id) THEN
    UPDATE user_contact
      SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND is_default = TRUE
      AND contact <> NEW.contact;
  END IF;
END$$

CREATE TRIGGER bi_appointment_no_overlap
BEFORE INSERT ON appointment
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1 FROM appointment a
    WHERE a.doctor_id = NEW.doctor_id
      AND a.date = NEW.date
      AND a.time_slot = NEW.time_slot
      AND a.status <> 'Cancelled'
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Doctor already booked for this date/time_slot';
  END IF;
END$$

CREATE TRIGGER bu_appointment_no_overlap
BEFORE UPDATE ON appointment
FOR EACH ROW
BEGIN
  IF (NEW.doctor_id <> OLD.doctor_id
      OR NEW.date <> OLD.date
      OR NEW.time_slot <> OLD.time_slot
      OR NEW.status <> OLD.status)
     AND EXISTS (
       SELECT 1 FROM appointment a
       WHERE a.doctor_id = NEW.doctor_id
         AND a.date = NEW.date
         AND a.time_slot = NEW.time_slot
         AND a.appointment_id <> OLD.appointment_id
         AND a.status <> 'Cancelled'
     )
  THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Doctor already booked for this date/time_slot';
  END IF;
END$$

CREATE TRIGGER bu_medical_history_touch
BEFORE UPDATE ON medical_history
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

DELIMITER;