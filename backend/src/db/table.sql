-- Active: 1755111596628@@127.0.0.1@3306@Project-MedSync
-- USE `Project-MedSync`;

-- child → parent drop order
DROP TABLE IF EXISTS `billing_payment`;
DROP TABLE IF EXISTS `billing_invoice`;
DROP TABLE IF EXISTS `prescription`;
DROP TABLE IF EXISTS `treatment`;
DROP TABLE IF EXISTS `medical_history`;
DROP TABLE IF EXISTS `insurance_claim`;
DROP TABLE IF EXISTS `patient_insurance`;
DROP TABLE IF EXISTS `doctor_speciality`;
DROP TABLE IF EXISTS `appointment`;
DROP TABLE IF EXISTS `patient`;
DROP TABLE IF EXISTS `doctor`;
DROP TABLE IF EXISTS `branch_manager`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `user_contact`;
DROP TABLE IF EXISTS `log`;
DROP TABLE IF EXISTS `action`;
DROP TABLE IF EXISTS `treatment_catelogue`;
DROP TABLE IF EXISTS `speciality`;
DROP TABLE IF EXISTS `insurance`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `branch`;



CREATE TABLE `branch` (
    `branch_id` INT AUTO_INCREMENT,
    `name` VARCHAR(15) NOT NULL UNIQUE,
    `location` VARCHAR(100) NOT NULL,
    `landline_no` VARCHAR(12) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`branch_id`)
);


CREATE TABLE `user` (
    `user_id` INT AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT  NULL,
    `role` ENUM(
        'Super_Admin', 
        'Branch_Manager', 
        'Doctor', 
        'Admin_Staff', 
        'Nurse', 
        'Receptionist', 
        'Billing_Staff', 
        'Insurance_Agent', 
        'Patient'
    ) NOT NULL,
    `branch_id` INT NULL,
    `is_approved` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN DEFAULT False,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`branch_id`) 
      REFERENCES `branch`(`branch_id`)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);


CREATE Table `patient` (
    `patient_id` INT NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `gender` ENUM('Male','Female') NOT NULL,
    `emergency_contact_no` VARCHAR(10) NOT NULL,
    `nic` VARCHAR(12) NULL,
    `address` VARCHAR(100) NULL,
    `date_of_birth` DATE,
    `blood_type` VARCHAR(5) NULL,    -- A+, A-, AB-, O+,....
    `is_ex_patient` BOOLEAN DEFAULT false,
    PRIMARY KEY(`patient_id`),
    Foreign Key (`patient_id`) 
      REFERENCES `user`(`user_id`)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);


CREATE TABLE `branch_manager` (
    `manager_id` INT NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `monthly_salary` DECIMAL(8,2) NOT NULL,
    `gender` ENUM('Male','Female') NOT NULL,
    PRIMARY KEY (`manager_id`),
    FOREIGN KEY (`manager_id`) 
      REFERENCES `user`(`user_id`)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);


CREATE TABLE `staff` (
    `staff_id` INT NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `type` ENUM(
        'Admin_Staff',
        'Nurse',
        'Receptionist',
        'Billing_Staff',
        'Insurance_Agent'
    ) NOT NULL,
    `monthly_salary` DECIMAL(8,2) NOT NULL,
    `gender` ENUM('Male','Female') NOT NULL,
    PRIMARY KEY (`staff_id`),
    FOREIGN KEY (`staff_id`) 
      REFERENCES `user`(`user_id`)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);


CREATE TABLE `user_contact` (
    `contact` VARCHAR(50) NOT NULL,
    `contact_type` ENUM('Email','Phone_No') NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    `user_id` INT NOT NULL,
    PRIMARY KEY (`contact`),
    FOREIGN KEY (`user_id`) 
      REFERENCES `user`(`user_id`)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

CREATE TABLE `speciality` (
  `speciality_id` int AUTO_INCREMENT,
  `speciality_name` varchar(20),
  `description` varchar(255),
  PRIMARY KEY (`speciality_id`)
);

CREATE TABLE `doctor` (
  `doctor_id` int,
  `name` varchar(50),
  `fee_per_patient` numeric(8,2),
  `basic_monthly_salary` numeric(8,2),
  `gender` varchar(6),
  PRIMARY KEY (`doctor_id`)
);

CREATE TABLE `doctor_speciality` (
  `doctor_id` int,
  `speciality_id` int,
  `added_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doctor_id`, `speciality_id`),
  FOREIGN KEY (`speciality_id`) 
      REFERENCES `speciality`(`speciality_id`),
  FOREIGN KEY (`doctor_id`)
      REFERENCES `doctor`(`doctor_id`)
);

CREATE TABLE `insurance` (
  `insurance_id` int AUTO_INCREMENT,
  `insurance_type` varchar(20),
  `insurance_period` varchar(20),
  `claim_percentage` numeric(2,2),
  `created_at` timestamp,
  PRIMARY KEY (`insurance_id`)
);

CREATE TABLE `treatment_catelogue` (
  `service_code` int AUTO_INCREMENT,
  `name` varchar(50),
  `fee` numeric(8,2),
  `description` varchar(255),
  `speciality_id` int,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_code`),
  FOREIGN KEY (`speciality_id`)
      REFERENCES `speciality`(`speciality_id`)
);

CREATE TABLE `insurance_claim` (
  `claim_id` int,
  `service_code` int,
  `patient_id` int,
  `approved_by` int,
  `claimed_amount` numeric(8,2),
  `claimed_at` timestamp,
  `insurance_id` int,
  PRIMARY KEY (`claim_id`),
  FOREIGN KEY (`insurance_id`)
      REFERENCES `insurance`(`insurance_id`),
  FOREIGN KEY (`approved_by`)
      REFERENCES `staff`(`staff_id`),
  FOREIGN KEY (`patient_id`)
      REFERENCES `patient`(`patient_id`),
  FOREIGN KEY (`service_code`)
      REFERENCES `treatment_catelogue`(`service_code`)
);

CREATE TABLE `appointment` (
  `appointment_id` int,
  `patient_id` int,
  `doctor_id` int,
  `patient_note` varchar(255),
  `date` date,
  `time_slot` varchar(13),
  `status` varchar(10),
  `time_stamp` timestamp,
  PRIMARY KEY (`appointment_id`),
  FOREIGN KEY (`patient_id`)
      REFERENCES `patient`(`patient_id`),
  FOREIGN KEY (`doctor_id`)
      REFERENCES `doctor`(`doctor_id`)
);

CREATE TABLE `billing_invoice` (
  `appointment_id` int,
  `additional_fee` numeric(8,2),
  `total_fee` numeric(8,2),
  `claim_id` int,
  `net_amount` numeric(8,2),
  `remaining_payment_amount` numeric(8,2),
  `time_stamp` timestamp,
  PRIMARY KEY (`appointment_id`),
  Foreign Key (`appointment_id`) 
    REFERENCES `appointment`(`appointment_id`)
);

CREATE TABLE `billing_payment` (
  `payment_id` INT AUTO_INCREMENT,
  `invoice_id` INT,
  `branch_id` INT,
  `paid_amount` NUMERIC(8,2),
  `time_stamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `cashier_id` INT,
  PRIMARY KEY (`payment_id`),
  FOREIGN KEY (`branch_id`) REFERENCES `branch`(`branch_id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `billing_invoice`(`appointment_id`),
  FOREIGN KEY (`cashier_id`) REFERENCES `staff`(`staff_id`)
) AUTO_INCREMENT = 1;


CREATE TABLE `prescription` (
  `appointment_id` int,
  `consultation_note` varchar(255),
  `prescription_items_details` varchar(255),
  `prescribed_at` timestamp,
  `is_active` bool,
  PRIMARY KEY (`appointment_id`),
  Foreign Key (`appointment_id`) 
    REFERENCES `appointment`(`appointment_id`)
);

CREATE TABLE `action` (
  `action_id` int,
  `name` varchar(15),
  PRIMARY KEY (`action_id`)
);

CREATE TABLE `medical_history` (
  `medical_history_id` int,
  `appointment_id` int,
  `visit_date` date,
  `diagnosis` varchar(255),
  `symptoms` varchar(255),
  `allergies` varchar(255),
  `notes` varchar(255),
  `follow_up_date` date,
  `created_at` timestamp,
  `updated_at` timestamp,
  PRIMARY KEY (`medical_history_id`),
  FOREIGN KEY (`appointment_id`)
      REFERENCES `appointment`(`appointment_id`)
);

CREATE TABLE `treatment` (
  `service_code` int,
  `appointment_id` int,
  PRIMARY KEY (`service_code`, `appointment_id`),
  FOREIGN KEY (`appointment_id`)
      REFERENCES `appointment`(`appointment_id`),
  FOREIGN KEY (`service_code`)
      REFERENCES `treatment_catelogue`(`service_code`)
);

CREATE TABLE `log` (
  `log_id` int,
  `user_id` int,
  `user_role` varchar(15),
  `action_id` int,
  `table_name` varchar(255),
  `record_id` int,
  `time_stamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  `details` varchar(255),
  PRIMARY KEY (`log_id`),
  FOREIGN KEY (`action_id`)
      REFERENCES `action`(`action_id`),
  FOREIGN KEY (`user_id`)
      REFERENCES `user`(`user_id`)
);

CREATE TABLE `patient_insurance` (
  `patient_id` int,
  `insurance_id` int,
  `created_at` timestamp,
  `is_expired` bool,
  PRIMARY KEY (`patient_id`, `insurance_id`),
  FOREIGN KEY (`patient_id`)
      REFERENCES `patient`(`patient_id`),
  FOREIGN KEY (`insurance_id`)
      REFERENCES `insurance`(`insurance_id`)
);


-- Branch-wise appointment summary per day
CREATE OR REPLACE VIEW branch_daily_appointment_summary AS
SELECT 
    b.branch_id,
    b.name AS branch_name,
    DATE_FORMAT(a.date, '%Y-%m-%d') AS appointment_date,
    a.status,
    COUNT(a.appointment_id) AS total_appointments
FROM appointment a
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN user u ON d.doctor_id = u.user_id
JOIN branch b ON u.branch_id = b.branch_id
GROUP BY b.branch_id, b.name, a.date, a.status
ORDER BY b.branch_id, a.date;


-- Doctor-wise revenue report
CREATE OR REPLACE VIEW doctor_revenue_report AS
SELECT 
    d.doctor_id,
    d.name AS doctor_name,
    SUM(bi.net_amount) AS total_revenue
FROM appointment a
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN billing_invoice bi ON bi.appointment_id = a.appointment_id
GROUP BY d.doctor_id, d.name
ORDER BY total_revenue DESC;


-- Patients with outstanding balances
CREATE OR REPLACE VIEW patients_with_outstanding_balance AS
SELECT 
    p.patient_id,
    p.name AS patient_name,
    bi.net_amount,
    bi.remaining_payment_amount
FROM billing_invoice bi
JOIN appointment a ON bi.appointment_id = a.appointment_id
JOIN patient p ON a.patient_id = p.patient_id
WHERE bi.remaining_payment_amount > 0
ORDER BY bi.remaining_payment_amount DESC;


-- Number of treatments per category (for given date range)
CREATE OR REPLACE VIEW treatments_per_category AS
SELECT 
    s.speciality_name,
    tc.name AS treatment_name,
    COUNT(t.appointment_id) AS total_treatments
FROM treatment t
JOIN treatment_catelogue tc ON t.service_code = tc.service_code
JOIN speciality s ON tc.speciality_id = s.speciality_id
JOIN appointment a ON t.appointment_id = a.appointment_id
GROUP BY s.speciality_name, tc.name
ORDER BY s.speciality_name, tc.name;


-- Insurance coverage vs out-of-pocket payments
CREATE OR REPLACE VIEW insurance_vs_out_of_pocket_report AS
SELECT 
    b.name AS branch_name,
    SUM(CASE WHEN bi.claim_id IS NOT NULL THEN bi.net_amount ELSE 0 END) AS insurance_covered_amount,
    SUM(CASE WHEN bi.claim_id IS NULL THEN bi.net_amount ELSE 0 END) AS out_of_pocket_amount
FROM billing_invoice bi
JOIN appointment a ON bi.appointment_id = a.appointment_id
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN user u ON d.doctor_id = u.user_id
JOIN branch b ON u.branch_id = b.branch_id
GROUP BY b.branch_id, b.name
ORDER BY b.name;
