-- Active: 1755111596628@@127.0.0.1@3306@Project-MedSync
-- use `Project-MedSync`;
-- User model functions
DROP PROCEDURE IF EXISTS create_user;

DROP PROCEDURE IF EXISTS update_user;

DROP PROCEDURE IF EXISTS delete_user;

DROP PROCEDURE IF EXISTS get_user_by_id;

DROP PROCEDURE IF EXISTS get_user_by_username;

DROP PROCEDURE IF EXISTS get_all_users;

DROP PROCEDURE IF EXISTS get_all_active_users_count;

DROP PROCEDURE IF EXISTS get_all_deleted_users;

DROP PROCEDURE IF EXISTS get_all_deleted_users_count;

DROP PROCEDURE IF EXISTS restore_user;

-- Patient model functions
DROP PROCEDURE IF EXISTS create_patient;

DROP PROCEDURE IF EXISTS update_patient;

DROP PROCEDURE IF EXISTS discharge_patient;

DROP PROCEDURE IF EXISTS delete_patient;

DROP PROCEDURE IF EXISTS get_patient_by_id;

DROP PROCEDURE IF EXISTS get_patients_by_blood_type;

DROP PROCEDURE IF EXISTS get_patients_by_branch;

DROP PROCEDURE IF EXISTS get_all_patients;

DROP PROCEDURE IF EXISTS get_patient_count;

-- Staff model functions
DROP PROCEDURE IF EXISTS create_staff;

DROP PROCEDURE IF EXISTS update_staff;

DROP PROCEDURE IF EXISTS delete_staff;

DROP PROCEDURE IF EXISTS get_staff_by_id;

DROP PROCEDURE IF EXISTS get_staff_by_type;

DROP PROCEDURE IF EXISTS get_staff_by_type_and_branch;

DROP PROCEDURE IF EXISTS get_all_staff;

DROP PROCEDURE IF EXISTS get_staff_count;

DROP PROCEDURE IF EXISTS get_staff_by_branch_id;

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

DROP PROCEDURE IF EXISTS get_branch_for_pagination;

DROP PROCEDURE IF EXISTS get_all_branch_count;

-- User_Contact model functions
DROP PROCEDURE IF EXISTS create_user_contact;

DROP PROCEDURE IF EXISTS update_user_contact;

DROP PROCEDURE IF EXISTS delete_contact;

DROP PROCEDURE IF EXISTS get_contact_details_by_contact;

DROP PROCEDURE IF EXISTS get_default_contacts_by_userID;

DROP PROCEDURE IF EXISTS get_all_contacts;

-- Logs model functions
DROP PROCEDURE IF EXISTS create_log;

DROP PROCEDURE IF EXISTS get_all_logs;

DROP PROCEDURE IF EXISTS get_logs_count;

DELIMITER $$

-- User model functions
CREATE PROCEDURE create_user(
    IN p_username VARCHAR(20),
    IN p_password_hash VARCHAR(255),
    IN p_role ENUM('Super_Admin','Branch_Manager','Doctor','Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent','Patient'),
    IN p_branch_id INT,
    IN p_is_approved TINYINT(1)
)
BEGIN
    INSERT INTO `user` (username, password_hash, role, branch_id, is_approved)
    VALUES (p_username, p_password_hash, p_role, p_branch_id, p_is_approved);

    SELECT * 
    FROM `user`
    WHERE user_id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE update_user(
    IN p_id INT,
    IN p_username VARCHAR(20),
    IN p_password_hash VARCHAR(50),
    IN p_role ENUM('Super_Admin','Branch_Manager','Doctor','Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent','Patient'),
    IN p_branch_id INT,
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

CREATE PROCEDURE get_user_by_id(IN p_id INT)
BEGIN
    SELECT u.user_id, u.username, u.password_hash, u.role, b.branch_id, b.name as branch_name, u.is_approved, u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.user_id = p_id AND u.is_deleted = 0;
END$$

CREATE PROCEDURE get_user_by_username(IN p_username VARCHAR(20))
BEGIN
    SELECT u.user_id, u.username, u.password_hash, u.role, b.branch_id, b.name as branch_name, u.is_approved, u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.username = p_username AND u.is_deleted = 0;
END$$

CREATE PROCEDURE get_all_users(IN user_count INT, IN start_count INT, IN in_role VARCHAR(20), IN in_branch_id INT)
BEGIN
    SELECT 
        u.user_id, 
        u.username, 
        u.password_hash, 
        u.role, 
        b.branch_id, 
        b.name as branch_name, 
        u.is_approved, 
        u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.is_deleted = 0
        AND (in_role = 'All' OR u.role = in_role)
        AND (in_branch_id = -1 OR u.branch_id = in_branch_id)
    ORDER BY u.user_id
    LIMIT user_count OFFSET start_count;
END$$

CREATE PROCEDURE get_all_active_users_count(IN in_role VARCHAR(20), IN in_branch_id INT)
BEGIN
    SELECT COUNT(user_id) AS user_count
    FROM `user`
    WHERE is_deleted = 0
        AND (in_role = 'All' OR role = in_role)
        AND (in_branch_id = -1 OR branch_id = in_branch_id);
END$$

CREATE PROCEDURE get_all_deleted_users(IN user_count INT, IN start_count INT)
BEGIN
    SELECT u.user_id, u.username, u.password_hash, u.role, b.branch_id, b.name as branch_name, u.is_approved, u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.is_deleted = 1
    ORDER BY u.user_id
    LIMIT user_count OFFSET start_count;
END$$

CREATE PROCEDURE get_all_deleted_users_count()
BEGIN
    SELECT COUNT(user_id) AS user_count
    FROM `user`
    WHERE is_deleted = 1;
END$$

CREATE PROCEDURE delete_user(IN p_id INT)
BEGIN
    UPDATE `user` 
    set is_deleted = 1 
    WHERE user_id = p_id; 
END$$

CREATE PROCEDURE restore_user(IN p_id INT)
BEGIN
    UPDATE `user` 
    set is_deleted = 0 
    WHERE user_id = p_id; 
END$$

-- Patient model functions
CREATE PROCEDURE create_patient(
    IN p_patient_id INT,
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

CREATE PROCEDURE update_patient(
    IN p_patient_id INT,
    IN p_name VARCHAR(50),
    IN p_gender ENUM('Male','Female'),
    IN p_emergency_contact_no VARCHAR(10),
    IN p_nic VARCHAR(12),
    IN p_address VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_blood_type VARCHAR(5),
    IN p_is_ex TINYINT
)
BEGIN
    UPDATE `patient`
    SET name = p_name,
        gender = p_gender,
        emergency_contact_no = p_emergency_contact_no,
        nic = p_nic,
        address = p_address,
        date_of_birth = p_date_of_birth,
        blood_type = p_blood_type,
        is_ex_patient = p_is_ex
    WHERE patient_id = p_patient_id;
END$$

CREATE PROCEDURE discharge_patient(IN p_id INT)
BEGIN
    UPDATE `patient`
    SET is_ex_patient = 1
    WHERE patient_id = p_id;
END$$

CREATE PROCEDURE get_patient_by_id(IN p_id INT)
BEGIN
    SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
    FROM `patient`
    WHERE patient_id = p_id;
END$$

-- CREATE PROCEDURE get_patients_by_blood_type(IN p_blood VARCHAR(5), IN patient_count INT, IN count_start INT)
-- BEGIN
--     SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
--     FROM `patient`
--     WHERE blood_type = p_blood
--     ORDER BY patient_id
--     LIMIT patient_count OFFSET count_start;
-- END$$

-- CREATE PROCEDURE get_patients_by_branch(IN p_branch_id INT, IN patient_count INT, IN count_start INT, IN p_is_ex TINYINT)
-- BEGIN
--     SELECT p.patient_id, p.name, p.gender, p.emergency_contact_no, p.nic, p.address, p.date_of_birth, p.blood_type
--     FROM `patient` p
--     JOIN `user` u ON p.patient_id = u.user_id
--     WHERE u.branch_id = p_branch_id AND p.is_ex_patient = p_is_ex
--     ORDER BY patient_id
--     LIMIT patient_count OFFSET count_start;
-- END$$

CREATE PROCEDURE get_all_patients(
    IN patient_count INT, 
    IN count_start INT, 
    IN p_is_ex TINYINT, 
    IN p_branch_id INT, 
    IN p_blood VARCHAR(5),
    IN p_gender VARCHAR(6)
)
BEGIN
    SELECT 
        p.patient_id, 
        p.name, 
        p.gender, 
        p.emergency_contact_no, 
        p.nic, 
        p.address, 
        p.date_of_birth, 
        p.blood_type, 
        u.branch_id, 
        b.name as branch_name
    FROM `patient` p
    JOIN `user` u ON p.patient_id = u.user_id
    JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE p.is_ex_patient = p_is_ex
        AND (p_branch_id = -1 or u.branch_id = p_branch_id)
        AND (p_blood = 'All' or p.blood_type = p_blood)
        AND (p_gender = 'All' or p.gender = p_gender)
    ORDER BY patient_id
    LIMIT patient_count OFFSET count_start;
END$$

CREATE PROCEDURE get_patient_count(
    IN p_is_ex TINYINT, 
    IN p_branch_id INT, 
    IN p_blood VARCHAR(5),
    IN p_gender VARCHAR(6)
)
BEGIN
    SELECT COUNT(p.patient_id) AS patient_count
    FROM `patient` p
    JOIN `user` u ON p.patient_id = u.user_id
    WHERE p.is_ex_patient = p_is_ex
        AND (p_branch_id = -1 or u.branch_id = p_branch_id)
        AND (p_blood = 'All' or p.blood_type = p_blood)
        AND (p_gender = 'All' or p.gender = p_gender);
END$$

CREATE PROCEDURE delete_patient(IN p_id INT)
BEGIN
    DELETE FROM `patient` WHERE patient_id = p_id;
END$$

-- staff model functions
CREATE PROCEDURE create_staff(
    IN p_staff_id INT,
    IN p_name VARCHAR(50),
    IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
    IN p_gender ENUM('Male','Female'),
    IN p_monthly_salary DECIMAL(8,2)
)
BEGIN
    INSERT INTO `staff` (staff_id, name, type, gender, monthly_salary)
    VALUES (p_staff_id, p_name, p_type, p_gender, p_monthly_salary);
END$$

CREATE PROCEDURE update_staff(
    IN p_staff_id INT,
    IN p_name VARCHAR(50),
    IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
    IN p_branch_id INT,
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

    UPDATE `user`
    SET branch_id = p_branch_id
    WHERE user_id = p_staff_id;
END$$

CREATE PROCEDURE get_staff_by_id(IN p_id INT)
BEGIN
    SELECT staff_id, name, type, gender, monthly_salary
    FROM `staff`
    WHERE staff_id = p_id;
END$$

-- CREATE PROCEDURE get_staff_by_type(IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'))
-- BEGIN
--     SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary, u.branch_id, u.name as branch_name
--     FROM `staff` s
--     JOIN `user` u ON s.staff_id = u.user_id
--     WHERE s.`type` = p_type;
-- END$$

-- CREATE PROCEDURE get_staff_by_branch_id(IN p_branch_id INT)
-- BEGIN
--     SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
--     FROM `staff` s
--     JOIN `user` u ON s.staff_id = u.user_id
--     WHERE u.branch_id = p_branch_id;
-- END$$

-- CREATE PROCEDURE get_staff_by_type_and_branch(
--     IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
--     IN p_branch_id INT
-- )
-- BEGIN
--     SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
--     FROM `staff` s
--     JOIN `user` u ON s.staff_id = u.user_id
--     WHERE u.branch_id = p_branch_id AND s.`type` = p_type;
-- END$$

CREATE PROCEDURE get_all_staff(IN staff_count INT, IN count_start INT, IN p_role VARCHAR(20), IN p_branch_id INT)
BEGIN
    SELECT s.staff_id, s.name, s.type, u.branch_id, b.name AS branch_name, s.gender, s.monthly_salary
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    LEFT JOIN `branch` b ON b.branch_id = u.branch_id
    WHERE (p_role = 'All' OR s.type = p_role)
      AND (p_branch_id = -1 OR u.branch_id = p_branch_id)
    ORDER BY s.staff_id
    LIMIT staff_count OFFSET count_start;
END$$

CREATE PROCEDURE get_staff_count(IN p_role VARCHAR(20), IN p_branch_id INT)
BEGIN
    SELECT COUNT(s.staff_id) AS staff_count
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    WHERE (p_role = 'All' OR s.type = p_role)
      AND (p_branch_id = -1 OR u.branch_id = p_branch_id);
END$$

CREATE PROCEDURE delete_staff(IN p_id INT)
BEGIN
    DELETE FROM `staff` WHERE staff_id = p_id;
END$$

-- branch manager model functions
CREATE PROCEDURE create_branch_manager(
    IN p_manager_id INT,
    IN p_name VARCHAR(50),
    IN p_monthly_salary DECIMAL(8,2),
    IN p_gender ENUM('Male','Female')
)
BEGIN
    INSERT INTO `branch_manager` (manager_id, name, monthly_salary, gender)
    VALUES (p_manager_id, p_name, p_monthly_salary, p_gender);
END$$

CREATE PROCEDURE update_branch_manager(
    IN p_manager_id INT,
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

CREATE PROCEDURE get_branch_manager_by_id(IN p_id INT)
BEGIN
    SELECT manager_id, name, monthly_salary, gender
    FROM `branch_manager`
    WHERE manager_id = p_id;
END$$

CREATE PROCEDURE get_branch_manager_by_branch_id(IN p_branch_id INT)
BEGIN
    SELECT b.manager_id, b.name, b.monthly_salary, b.gender
    FROM `branch_manager` b
    JOIN `user` u ON u.user_id = b.manager_id
    WHERE u.branch_id = p_branch_id;
END$$

CREATE PROCEDURE get_all_branch_manager(IN staff_count INT, IN count_start INT)
BEGIN
    SELECT b.manager_id, b.name, b.monthly_salary, b.gender
    FROM `branch_manager` b
    JOIN `user` u ON u.user_id = b.manager_id
    ORDER BY b.manager_id
    LIMIT staff_count OFFSET count_start;
END$$

CREATE PROCEDURE delete_branch_manager(IN p_id INT)
BEGIN
    DELETE FROM `branch_manager` WHERE manager_id = p_id;
END$$

-- branch model functions
CREATE PROCEDURE create_branch(
    IN p_name VARCHAR(15),
    IN p_location VARCHAR(100),
    IN p_landline_no VARCHAR(12)
)
BEGIN
    INSERT INTO `branch` (name, location, landline_no)
    VALUES (p_name, p_location, p_landline_no);
END$$

CREATE PROCEDURE update_branch(
    IN p_branch_id INT,
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

CREATE PROCEDURE get_branch_by_id(IN p_branch_id INT)
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    WHERE branch_id = p_branch_id;
END$$

CREATE PROCEDURE get_branch_for_pagination(IN branch_count INT, IN count_start INT)
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    ORDER BY branch_id
    LIMIT branch_count OFFSET count_start;
END$$

CREATE PROCEDURE get_all_branch()
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    ORDER BY branch_id;
END$$

CREATE PROCEDURE get_all_branch_count()
BEGIN
    SELECT COUNT(branch_id) AS branch_count
    FROM `branch`;
END$$

CREATE PROCEDURE delete_branch(IN p_id INT)
BEGIN
    DELETE FROM `branch` WHERE branch_id = p_id;
END$$

-- user contact model functions
CREATE PROCEDURE create_user_contact(
    IN p_contact VARCHAR(50),
    IN p_contact_type ENUM('Email','Phone_No'),
    IN p_is_default TINYINT(1),
    IN p_user_id INT
)
BEGIN
    INSERT INTO `user_contact` (contact, contact_type, is_default, user_id)
    VALUES (p_contact, p_contact_type, p_is_default, p_user_id);
END$$

CREATE PROCEDURE update_user_contact(
    IN p_contact VARCHAR(50),
    IN p_contact_type ENUM('Email','Phone_No'),
    IN p_is_default TINYINT(1),
    IN p_user_id INT
)
BEGIN
    UPDATE `user_contact`
    SET contact_type = p_contact_type,
        is_default = p_is_default,
        user_id = p_user_id
    WHERE contact = p_contact;
END$$

CREATE PROCEDURE get_contact_details_by_contact(IN p_contact VARCHAR(50))
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    WHERE contact = p_contact;
END$$

CREATE PROCEDURE get_default_contacts_by_userID(IN p_userID INT)
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    WHERE user_id = p_userID AND is_default = 1;
END$$

CREATE PROCEDURE get_all_contacts()
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    ORDER BY user_id,contact_type,is_default;
END$$

CREATE PROCEDURE delete_contact(IN p_contact VARCHAR(50))
BEGIN
    DELETE FROM `user_contact` WHERE contact = p_contact;
END$$

-- Log model functions
CREATE PROCEDURE create_log(
    IN p_user_id INT,
    IN p_user_role VARCHAR(15),
    IN p_action_id INT,
    IN p_table_name VARCHAR(255),
    IN p_record_id INT,
    IN p_details VARCHAR(255)
)
BEGIN
    INSERT INTO `log` (user_id, user_role, action_id, table_name, record_id, details)
    VALUES (p_user_id, p_user_role, p_action_id, p_table_name, p_record_id, p_details);
END$$

CREATE PROCEDURE get_all_logs(
    IN log_count INT, 
    IN log_offset INT
)
BEGIN
    SELECT l.log_id, l.user_id, l.user_role, a.name, l.table_name, l.record_id, l.details
    FROM `log` l
    LEFT JOIN `action` a
    ON l.action_id = a.action_id
    ORDER BY l.log_id
    LIMIT log_count OFFSET log_offset;
END$$

CREATE PROCEDURE get_logs_count()
BEGIN
    SELECT COUNT(log_id) AS log_count
    FROM `log`;
END$$

DELIMITER;