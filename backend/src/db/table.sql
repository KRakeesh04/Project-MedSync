USE `Project-MedSync`;

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
  `speciality_id` int,
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
  `specialiy_id` int,
  `added_at` timestamp,
  PRIMARY KEY (`doctor_id`, `specialiy_id`),
  FOREIGN KEY (`specialiy_id`) 
      REFERENCES `speciality`(`speciality_id`),
  FOREIGN KEY (`doctor_id`)
      REFERENCES `doctor`(`doctor_id`)
);

CREATE TABLE `insurance` (
  `insurance_id` int,
  `insurance_type` varchar(20),
  `insurance_period` varchar(20),
  `claim_percentage` numeric(2,2),
  `created_at` timestamp,
  PRIMARY KEY (`insurance_id`)
);

CREATE TABLE `treatment_catelogue` (
  `service_code` int,
  `name` varchar(50),
  `fee` numeric(8,2),
  `description` varchar(255),
  `speciality_id` int,
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
  `payment_id` int,
  `invoice_id` int,
  `branch_id` int,
  `paid_amount` numeric(8,2),
  `time_stamp` timestamp,
  `cashier_id` int,
  PRIMARY KEY (`payment_id`),
  FOREIGN KEY (`branch_id`)
      REFERENCES `branch`(`branch_id`),
  FOREIGN KEY (`invoice_id`)
      REFERENCES `billing_invoice`(`appointment_id`),
  FOREIGN KEY (`cashier_id`)
      REFERENCES `staff`(`staff_id`)
);

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
  `time_Stamp` timestamp,
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

