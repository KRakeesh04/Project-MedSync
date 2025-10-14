-- User model functions
DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS update_user;
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS get_user_by_id;
DROP PROCEDURE IF EXISTS get_user_by_username;
DROP PROCEDURE IF EXISTS get_all_users;

-- Patient model functions
DROP PROCEDURE IF EXISTS create_patient;
DROP PROCEDURE IF EXISTS update_patient;
DROP PROCEDURE IF EXISTS delete_patient;
DROP PROCEDURE IF EXISTS get_patient_by_id;
DROP PROCEDURE IF EXISTS get_patients_by_blood_type;
DROP PROCEDURE IF EXISTS get_patients_by_branch;
DROP PROCEDURE IF EXISTS get_all_patients;
-- Staff model functions
DROP PROCEDURE IF EXISTS create_staff;
DROP PROCEDURE IF EXISTS update_staff;
DROP PROCEDURE IF EXISTS delete_staff;
DROP PROCEDURE IF EXISTS get_staff_by_id;
DROP PROCEDURE IF EXISTS get_staffs_by_type;
DROP PROCEDURE IF EXISTS get_staffs_by_type_and_branch;
DROP PROCEDURE IF EXISTS get_all_staffs;
DROP PROCEDURE IF EXISTS get_staffs_by_branch_id;
-- Branch Manager model functions
DROP PROCEDURE IF EXISTS create_branch_manager;
DROP PROCEDURE IF EXISTS update_branch_manager;
DROP PROCEDURE IF EXISTS delete_branch_manager;
DROP PROCEDURE IF EXISTS get_branch_manager_by_id;
DROP PROCEDURE IF EXISTS get_branch_manager_by_branch_id;
DROP PROCEDURE IF EXISTS get_all_branch_manager;
-- Branch model functions
DROP PROCEDURE IF EXISTS create_branch;
DROP PROCEDURE IF EXISTS update_branch;
DROP PROCEDURE IF EXISTS delete_branch;
DROP PROCEDURE IF EXISTS get_branch_by_id;
DROP PROCEDURE IF EXISTS get_all_branch;
-- User_Contact model functions
DROP PROCEDURE IF EXISTS create_user_contact;
DROP PROCEDURE IF EXISTS update_user_contact;
DROP PROCEDURE IF EXISTS delete_contact;
DROP PROCEDURE IF EXISTS get_contact_details_by_contact;
DROP PROCEDURE IF EXISTS get_default_contacts_by_userID;
DROP PROCEDURE IF EXISTS get_all_contacts;

-- speciality model functions
DROP PROCEDURE IF EXISTS create_speciality;
DROP PROCEDURE IF EXISTS update_speciality;
DROP PROCEDURE IF EXISTS delete_speciality;
DROP PROCEDURE IF EXISTS get_speciality_by_id;
DROP PROCEDURE IF EXISTS get_all_specialities;

-- billing_invoice model functions
DROP PROCEDURE IF EXISTS create_billing_invoice;
DROP PROCEDURE IF EXISTS update_billing_invoice_bypayment;
DROP PROCEDURE IF EXISTS delete_billing_invoice;
DROP PROCEDURE IF EXISTS get_billing_invoice_by_id;
DROP PROCEDURE IF EXISTS get_all_billing_invoices;


-- billing_payment model functions
DROP PROCEDURE IF EXISTS create_billing_payment;
DROP PROCEDURE IF EXISTS update_billing_payment;
DROP PROCEDURE IF EXISTS delete_billing_payment;
DROP PROCEDURE IF EXISTS get_billing_payment_by_id;
DROP PROCEDURE IF EXISTS get_billing_payments_by_invoice_id;
DROP PROCEDURE IF EXISTS get_all_billing_payments;



DELIMITER $$

-- User model functions
-- Create a user 
CREATE PROCEDURE create_user(
    IN p_username VARCHAR(20),
    IN p_password_hash VARCHAR(50),
    IN p_role ENUM('Super_Admin','Branch_Manager','Doctor','Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent','Patient'),
    IN p_branch_id BIGINT,
    IN p_is_approved TINYINT(1)
)
BEGIN
    INSERT INTO `user` (username, password_hash, role, branch_id, is_approved)
    VALUES (p_username, p_password_hash, p_role, p_branch_id, p_is_approved);
END$$

-- Update a user
CREATE PROCEDURE update_user(
    IN p_id BIGINT,
    IN p_username VARCHAR(20),
    IN p_password_hash VARCHAR(50),
    IN p_role ENUM('Super_Admin','Branch_Manager','Doctor','Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent','Patient'),
    IN p_branch_id BIGINT,
    IN p_is_approved TINYINT(1)
)
BEGIN
    UPDATE `user`
    SET username = p_username,
        password_hash = p_password_hash,
        role = p_role,
        branch_id = p_branch_id,
        is_approved = p_is_approved
    WHERE user_id = p_id;
END$$

-- Get a user by ID 
CREATE PROCEDURE get_user_by_id(IN p_id BIGINT)
BEGIN
    SELECT user_id, username, password_hash, role, branch_id, is_approved, created_at
    FROM `user`
    WHERE user_id = p_id;
END$$

-- Get a user by username 
CREATE PROCEDURE get_user_by_username(IN p_username VARCHAR(20))
BEGIN
    SELECT user_id, username, password_hash, role, branch_id, is_approved, created_at
    FROM `user`
    WHERE username = p_username;
END$$

-- Get all user 
CREATE PROCEDURE get_all_users(IN user_count INT, IN start_count INT)
BEGIN
    SELECT user_id, username, password_hash, role, branch_id, is_approved, created_at
    FROM `user`
    ORDER BY user_id
    LIMIT user_count OFFSET start_count;
END$$

-- Delete a user 
CREATE PROCEDURE delete_user(IN p_id BIGINT)
BEGIN
    DELETE FROM `user` WHERE user_id = p_id;
END$$

-- Patient model functions
-- Create a patient 
CREATE PROCEDURE create_patient(
    IN p_patient_id BIGINT,
    IN p_name VARCHAR(50),
    IN p_gender ENUM('Male','Female'),
    IN p_emergency_contact_no VARCHAR(10),
    IN p_nic VARCHAR(12),
    IN p_address VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_blood_type VARCHAR(5)
)
BEGIN
    INSERT INTO `patient` (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type)
    VALUES (p_patient_id, p_name, p_gender, p_emergency_contact_no, p_nic, p_address, p_date_of_birth, p_blood_type);
END$$

-- Update a patient
CREATE PROCEDURE update_patient(
    IN p_patient_id BIGINT,
    IN p_name VARCHAR(50),
    IN p_gender ENUM('Male','Female'),
    IN p_emergency_contact_no VARCHAR(10),
    IN p_nic VARCHAR(12),
    IN p_address VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_blood_type VARCHAR(5)
)
BEGIN
    UPDATE `patient`
    SET name = p_name,
        gender = p_gender,
        emergency_contact_no = p_emergency_contact_no,
        nic = p_nic,
        address = p_address,
        date_of_birth = p_date_of_birth,
        blood_type = p_blood_type
    WHERE patient_id = p_patient_id;
END$$

-- Get a patient by ID 
CREATE PROCEDURE get_patient_by_id(IN p_id BIGINT)
BEGIN
    SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
    FROM `patient`
    WHERE patient_id = p_id;
END$$

-- Get a patients by blood group
CREATE PROCEDURE get_patients_by_blood_type(IN p_blood VARCHAR(5), IN patient_count INT, IN count_start INT)
BEGIN
    SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
    FROM `patient`
    WHERE blood_type = p_blood
    ORDER BY patient_id
    LIMIT patient_count OFFSET count_start;
END$$

-- Get a patients by branch id
CREATE PROCEDURE get_patients_by_branch(IN p_branch_id BIGINT, IN patient_count INT, IN count_start INT)
BEGIN
    SELECT p.patient_id, p.name, p.gender, p.emergency_contact_no, p.nic, p.address, p.date_of_birth, p.blood_type
    FROM `patient` p
    JOIN `user` u ON p.patient_id = u.user_id
    WHERE u.branch_id = p_branch_id
    ORDER BY patient_id
    LIMIT patient_count OFFSET count_start;
END$$

-- Get all patient 
CREATE PROCEDURE get_all_patients(IN patient_count INT, IN count_start INT)
BEGIN
    SELECT p.patient_id, p.name, p.gender, p.emergency_contact_no, p.nic, p.address, p.date_of_birth, p.blood_type, u.branch_id
    FROM `patient` p
    JOIN `user` u ON p.patient_id = u.user_id
    ORDER BY patient_id
    LIMIT patient_count OFFSET count_start;
END$$

-- Delete a patient 
CREATE PROCEDURE delete_patient(IN p_id BIGINT)
BEGIN
    DELETE FROM `patient` WHERE patient_id = p_id;
END$$


-- staff model functions
-- Create a staff 
CREATE PROCEDURE create_staff(
    IN p_staff_id BIGINT,
    IN p_name VARCHAR(50),
    IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
    IN p_gender ENUM('Male','Female'),
    IN p_monthly_salary DECIMAL(8,2)
)
BEGIN
    INSERT INTO `staff` (staff_id, name, type, gender, monthly_salary)
    VALUES (p_staff_id, p_name, p_type, p_gender, p_monthly_salary);
END$$

-- update a staff 
CREATE PROCEDURE update_staff(
    IN p_staff_id BIGINT,
    IN p_name VARCHAR(50),
    IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
    IN p_gender ENUM('Male','Female'),
    IN p_monthly_salary DECIMAL(8,2)
)
BEGIN
    UPDATE `staff`
    SET name = p_name,
        type = p_type,
        gender = p_gender,
        monthly_salary = p_monthly_salary
    WHERE staff_id = p_staff_id;
END$$


-- Get a staff by ID 
CREATE PROCEDURE get_staff_by_id(IN p_id BIGINT)
BEGIN
    SELECT staff_id, name, type, gender, monthly_salary
    FROM `staff`
    WHERE staff_id = p_id;
END$$

-- Get all staffs by type 
CREATE PROCEDURE get_staffs_by_type(IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'))
BEGIN
    SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary, u.branch_id, u.name as branch_name
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    WHERE s.`type` = p_type;
END$$

-- Get all staffs by branch id 
CREATE PROCEDURE get_staffs_by_branch_id(IN p_branch_id BIGINT)
BEGIN
    SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    WHERE u.branch_id = p_branch_id;
END$$

-- Get all staffs by type and branch id
CREATE PROCEDURE get_staffs_by_type_and_branch(IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'), IN p_branch_id BIGINT)
BEGIN
    SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    WHERE u.branch_id = p_branch_id AND s.`type` = p_type;
END$$

-- Get all staffs
CREATE PROCEDURE get_all_staffs(IN staff_count INT, IN count_start INT)
BEGIN
    SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary, u.branch_id
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    ORDER BY s.staff_id
    LIMIT staff_count OFFSET count_start;
END$$

-- Delete a staff 
CREATE PROCEDURE delete_staff(IN p_id BIGINT)
BEGIN
    DELETE FROM `staff` WHERE staff_id = p_id;
END$$


-- branch manager model functions
-- Create a branch manager 
CREATE PROCEDURE create_branch_manager(
    IN p_manager_id BIGINT,
    IN p_name VARCHAR(50),
    IN p_monthly_salary DECIMAL(8,2),
    IN p_gender ENUM('Male','Female')
)
BEGIN
    INSERT INTO `branch_manager` (manager_id, name, monthly_salary, gender)
    VALUES (p_manager_id, p_name, p_monthly_salary, p_gender);
END$$

-- update a branch manager 
CREATE PROCEDURE update_branch_manager(
    IN p_manager_id BIGINT,
    IN p_name VARCHAR(50),
    IN p_monthly_salary DECIMAL(8,2),
    IN p_gender ENUM('Male','Female')
)
BEGIN
    UPDATE `branch_manager`
    SET name = p_name,
        monthly_salary = p_monthly_salary,
        gender = p_gender
    WHERE manager_id = p_manager_id;
END$$

-- Get a branch manager by ID 
CREATE PROCEDURE get_branch_manager_by_id(IN p_id BIGINT)
BEGIN
    SELECT manager_id, name, monthly_salary, gender
    FROM `branch_manager`
    WHERE manager_id = p_id;
END$$

-- Get a branch manager by branch ID 
CREATE PROCEDURE get_branch_manager_by_branch_id(IN p_branch_id BIGINT)
BEGIN
    SELECT b.manager_id, b.name, b.monthly_salary, b.gender
    FROM `branch_manager` b
    JOIN `user` u ON u.user_id = b.manager_id
    WHERE u.branch_id = p_branch_id;
END$$

-- Get all branch manager 
CREATE PROCEDURE get_all_branch_manager(IN staff_count INT, IN count_start INT)
BEGIN
    SELECT b.manager_id, b.name, b.monthly_salary, b.gender
    FROM `branch_manager` b
    JOIN `user` u ON u.user_id = b.manager_id
    ORDER BY b.manager_id
    LIMIT staff_count OFFSET count_start;
END$$

-- Delete a branch manager 
CREATE PROCEDURE delete_branch_manager(IN p_id BIGINT)
BEGIN
    DELETE FROM `branch_manager` WHERE manager_id = p_id;
END$$


-- branch model functions
-- Create a branch  
CREATE PROCEDURE create_branch(
    IN p_name VARCHAR(15),
    IN p_location VARCHAR(100),
    IN p_landline_no VARCHAR(12)
)
BEGIN
    INSERT INTO `branch` (name, location, landline_no)
    VALUES (p_name, p_location, p_landline_no);
END$$

-- update a branch 
CREATE PROCEDURE update_branch(
    IN p_branch_id BIGINT,
    IN p_name VARCHAR(15),
    IN p_location VARCHAR(100),
    IN p_landline_no VARCHAR(12)
)
BEGIN
    UPDATE `branch`
    SET name = p_name,
        location = p_location,
        landline_no = p_landline_no
    WHERE branch_id = p_branch_id;
END$$

-- Get a branch by ID 
CREATE PROCEDURE get_branch_by_id(IN p_branch_id BIGINT)
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    WHERE branch_id = p_branch_id;
END$$

-- Get all branch 
CREATE PROCEDURE get_all_branch()
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    ORDER BY branch_id;
END$$

-- Delete a branch 
CREATE PROCEDURE delete_branch(IN p_id BIGINT)
BEGIN
    DELETE FROM `branch` WHERE branch_id = p_id;
END$$

-- user contact model functions
-- 1. Create a user contact  
CREATE PROCEDURE create_user_contact(
    IN p_contact VARCHAR(50),
    IN p_contact_type ENUM('Email','Phone_No'),
    IN p_is_default TINYINT(1),
    IN p_user_id BIGINT
)
BEGIN
    INSERT INTO `user_contact` (contact, contact_type, is_default, user_id)
    VALUES (p_contact, p_contact_type, p_is_default, p_user_id);
END$$


-- update a user contact 
CREATE PROCEDURE update_user_contact(
    IN p_contact VARCHAR(50),
    IN p_contact_type ENUM('Email','Phone_No'),
    IN p_is_default TINYINT(1),
    IN p_user_id BIGINT
)
BEGIN
    UPDATE `user_contact`
    SET contact_type = p_contact_type,
        is_default = p_is_default,
        user_id = p_user_id
    WHERE contact = p_contact;
END$$

-- Get a user contact by contact
CREATE PROCEDURE get_contact_details_by_contact(IN p_contact VARCHAR(50))
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    WHERE contact = p_contact;
END$$

-- Get default user contact by user id
CREATE PROCEDURE get_default_contacts_by_userID(IN p_userID BIGINT)
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    WHERE user_id = p_userID AND is_default = 1;
END$$

-- Get all user contact 
CREATE PROCEDURE get_all_contacts()
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    ORDER BY user_id,contact_type,is_default;
END$$

-- Delete a user contact 
CREATE PROCEDURE delete_contact(IN p_contact VARCHAR(50))
BEGIN
    DELETE FROM `user_contact` WHERE contact = p_contact;
END$$


-- billing_invoice model functions
-- CREATE PROCEDURE to insert a new billing invoice

DELIMITER $$

CREATE PROCEDURE create_billing_invoice(
    IN p_appointment_id INT,
    IN p_additional_fee DECIMAL(10,2),
    IN p_total_fee DECIMAL(10,2),
    IN p_claim_id INT,
    IN p_net_amount DECIMAL(10,2),
    IN p_remaining_payment_amount DECIMAL(10,2)
)
BEGIN
    -- Error handler: rollback if something fails
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    INSERT INTO billing_invoice 
        (appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount, time_stamp)
    VALUES
        (p_appointment_id, p_additional_fee, p_total_fee, p_claim_id, p_net_amount, p_remaining_payment_amount, NOW());

    COMMIT;
END$$

DELIMITER ;



-- CREATE PROCEDURE to update an existing billing invoice

CREATE PROCEDURE update_billing_invoice_bypayment(
    IN p_invoice_id INT,
    IN p_payment DECIMAL(10,2),
   
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    UPDATE billing_invoice
    SET 
        remaining_payment_amount = remaining_payment_amount-p_payment,
        time_stamp = NOW()
    WHERE id = p_invoice_id;

    COMMIT;

    SELECT * FROM billing_invoice WHERE id = p_invoice_id;
END$$


-- CREATE PROCEDURE to delete a billing invoice

CREATE PROCEDURE delete_billing_invoice(IN p_invoice_id INT)
BEGIN
    DELETE FROM `billing_invoice` WHERE id = p_invoice_id;
END$$


-- CREATE PROCEDURE to get a billing invoice by ID

CREATE PROCEDURE delete_billing_invoice(IN p_invoice_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    DELETE FROM billing_invoice WHERE id = p_invoice_id;

    COMMIT;
END$$

-- CREATE PROCEDURE to get all billing invoices

CREATE PROCEDURE get_all_billing_invoices()
BEGIN
    SELECT * FROM `billing_invoice`;
END$$

-- billing_payment model functions

-- CREATE PROCEDURE to insert a new billing payment

CREATE PROCEDURE create_billing_payment(
    IN p_payment_id INT,
    IN p_invoice_id INT,
    IN p_branch_id INT,
    IN p_paid_amount NUMERIC(8,2),
    IN p_cashier_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    INSERT INTO billing_payment
        (payment_id, invoice_id, branch_id, paid_amount, cashier_id, time_stamp)
    VALUES
        (p_payment_id, p_invoice_id, p_branch_id, p_paid_amount, p_cashier_id, NOW());

    COMMIT;

    SELECT * FROM billing_payment WHERE payment_id = p_payment_id;
END$$

-- CREATE PROCEDURE to update an existing billing payment
CREATE PROCEDURE update_billing_payment(
    IN p_payment_id INT,
    IN p_paid_amount NUMERIC(8,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    UPDATE billing_payment
    SET paid_amount = p_paid_amount,
        time_stamp = NOW()
    WHERE payment_id = p_payment_id;

    COMMIT;

    SELECT * FROM billing_payment WHERE payment_id = p_payment_id;
END$$


-- CREATE PROCEDURE to delete a billing payment

CREATE PROCEDURE delete_billing_payment(IN p_payment_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    DELETE FROM billing_payment WHERE payment_id = p_payment_id;

    COMMIT;
END$$


-- CREATE PROCEDURE to get a billing payment by payment_id

CREATE PROCEDURE get_billing_payment_by_id(IN p_payment_id INT)
BEGIN
    SELECT * FROM `billing_payment` WHERE payment_id = p_payment_id;
END$$


-- CREATE PROCEDURE to get payments by invoice_id

CREATE PROCEDURE get_billing_payments_by_invoice_id(IN p_invoice_id INT)
BEGIN
    SELECT * FROM `billing_payment` WHERE invoice_id = p_invoice_id;
END$$


-- CREATE PROCEDURE to get all billing payments
CREATE PROCEDURE get_all_billing_payments()
BEGIN
    SELECT * FROM `billing_payment`;
END$$

-- speciality model functions
-- CREATE PROCEDURE to insert a new speciality

CREATE PROCEDURE create_speciality(
    IN p_speciality_id INT,
    IN p_speciality_name VARCHAR(20),
    IN p_description VARCHAR(255)
)
BEGIN
    INSERT INTO `speciality` (speciality_id, speciality_name, description)
    VALUES (p_speciality_id, p_speciality_name, p_description);
END$$


-- CREATE PROCEDURE to update an existing speciality

CREATE PROCEDURE update_speciality(
    IN p_speciality_id INT,
    IN p_speciality_name VARCHAR(20),
    IN p_description VARCHAR(255)
)
BEGIN
    UPDATE `speciality`
    SET speciality_name = p_speciality_name,
        description = p_description
    WHERE speciality_id = p_speciality_id;
END$$


-- CREATE PROCEDURE to delete a speciality

CREATE PROCEDURE delete_speciality(IN p_speciality_id INT)
BEGIN
    DELETE FROM `speciality` WHERE speciality_id = p_speciality_id;
END$$


-- CREATE PROCEDURE to get a speciality by ID

CREATE PROCEDURE get_speciality_by_id(IN p_speciality_id INT)
BEGIN
    SELECT * FROM `speciality` WHERE speciality_id = p_speciality_id;
END$$


-- CREATE PROCEDURE to get all specialities

CREATE PROCEDURE get_all_specialities()
BEGIN
    SELECT * FROM `speciality`;
END$$
DELIMITER ;