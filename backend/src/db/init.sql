-- ===========================
-- 1. Branch
-- ===========================
INSERT INTO `branch` (branch_id, name, location, landline_no, created_at) VALUES
(1, 'Main', 'City Center', '0111234567', NOW()),
(2, 'West', 'West Town', '0112345678', NOW()),
(3, 'East', 'East Side', '0113456789', NOW()),
(4, 'North', 'North Area', '0114567890', NOW());

-- ===========================
-- 2. User
-- ===========================
INSERT INTO `user` (user_id, username, password_hash, role, branch_id, is_approved, created_at) VALUES
(1, 'admin1', 'hash1', 'Admin_Staff', 1, TRUE, NOW()),
(2, 'admin2', 'hash2', 'Admin_Staff', 2, TRUE, NOW()),
(3, 'user1', 'hash3', 'Patient', 3, TRUE, NOW()),
(4, 'user2', 'hash4', 'Patient', 4, TRUE, NOW());

-- ===========================
-- 3. Staff
-- ===========================
INSERT INTO `staff` (staff_id, name, type, monthly_salary, gender) VALUES
(1, 'Alice Nurse', 'Nurse', 30000.00, 'Female'),
(2, 'Bob Admin', 'Admin_Staff', 35000.00, 'Male'),
(3, 'Charlie Reception', 'Receptionist', 28000.00, 'Male'),
(4, 'Diana Lab', 'Billing_Staff', 32000.00, 'Female');

-- ===========================
-- 4. Branch_Manager
-- ===========================
INSERT INTO `branch_manager` (manager_id, name, monthly_salary, gender) VALUES
(1, 'Manager 1', 60000.00, 'Male'),
(2, 'Manager 2', 62000.00, 'Female'),
(3, 'Manager 3', 58000.00, 'Male'),
(4, 'Manager 4', 61000.00, 'Female');

-- ===========================
-- 5. Patient
-- ===========================
INSERT INTO `patient` (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type) VALUES
(3, 'Alice Patient', 'Female', '0771234567', '123456789V', '123 Main St', '1990-01-01', 'O+'),
(4, 'Bob Patient', 'Male', '0772345678', '987654321V', '456 Oak St', '1985-05-12', 'A+');

-- ===========================
-- 6. User_Contact
-- ===========================
INSERT INTO `user_contact` (contact, contact_type, is_default, user_id) VALUES
('user1@email.com','Email',TRUE,3),
('user2@email.com','Email',TRUE,4),
('0771234567','Phone_No',TRUE,3),
('0772345678','Phone_No',TRUE,4);

-- ===========================
-- 7. Speciality
-- ===========================
INSERT INTO `speciality` (speciality_id, speciality_name, description) VALUES
(1, 'Cardiology', 'Heart related'),
(2, 'Neurology', 'Brain related'),
(3, 'Orthopedics', 'Bone related'),
(4, 'Pediatrics', 'Child care');

-- ===========================
-- 8. Doctor
-- ===========================
INSERT INTO `doctor` (doctor_id, name, fee_per_patient, basic_monthly_salary, gender) VALUES
(1, 'Dr. John Doe', 1000.00, 50000.00, 'Male'),
(2, 'Dr. Jane Smith', 1200.00, 55000.00, 'Female'),
(3, 'Dr. Mike Johnson', 900.00, 48000.00, 'Male'),
(4, 'Dr. Emily Davis', 1100.00, 52000.00, 'Female'),
(5, 'Dr. Hasaranga Dinujaya', 1100.00, 52000.00, 'Male');

-- ===========================
-- 9. Doctor_Speciality
-- ===========================
INSERT INTO `doctor_speciality` (doctor_id, specialiy_id, added_at) VALUES
(1, 1, NOW()),
(2, 2, NOW()),
(3, 3, NOW()),
(4, 4, NOW());

-- ===========================
-- 10. Insurance
-- ===========================
INSERT INTO `insurance` (insurance_id, insurance_type, insurance_period, claim_percentage, created_at) VALUES
(1, 'Health', '1 Year', 0.80, NOW()),
(2, 'Life', '2 Years', 0.90, NOW()),
(3, 'Dental', '1 Year', 0.75, NOW()),
(4, 'Vision', '1 Year', 0.70, NOW());

-- ===========================
-- 11. Patient_Insurance
-- ===========================
INSERT INTO `patient_insurance` (patient_id, insurance_id, created_at, is_expired) VALUES
(3,1,NOW(),FALSE),
(4,2,NOW(),FALSE);

-- ===========================
-- 12. Treatment_Catelogue
-- ===========================
INSERT INTO `treatment_catelogue` (service_code, name, fee, description, speciality_id) VALUES
(1, 'ECG', 500.00, 'Heart test', 1),
(2, 'EEG', 600.00, 'Brain test', 2),
(3, 'X-Ray', 300.00, 'Bone imaging', 3),
(4, 'Vaccination', 200.00, 'Child vaccine', 4);

-- ===========================
-- 13. Appointment
-- ===========================
INSERT INTO `appointment` (appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp) VALUES
(1, 3, 1, 'Chest pain', '2025-09-18', '09:00-09:30', 'Booked', NOW()),
(2, 4, 2, 'Headache', '2025-09-19', '10:00-10:30', 'Booked', NOW());

-- ===========================
-- 14. Prescription
-- ===========================
INSERT INTO `prescription` (appointment_id, consultation_note, prescription_items_details, prescribed_at, is_active) VALUES
(1, 'Take rest', 'Paracetamol 500mg', NOW(), TRUE),
(2, 'Hydrate', 'Ibuprofen 200mg', NOW(), TRUE);

-- ===========================
-- 15. Medical_History
-- ===========================
INSERT INTO `medical_history` (medical_history_id, appointment_id, visit_date, diagnosis, symptoms, allergies, notes, follow_up_date, created_at, updated_at) VALUES
(1, 1, '2025-09-18', 'Diagnosis 1', 'Symptoms 1', 'None', 'Notes 1', '2025-09-25', NOW(), NOW()),
(2, 2, '2025-09-19', 'Diagnosis 2', 'Symptoms 2', 'Peanuts', 'Notes 2', '2025-09-26', NOW(), NOW());

-- ===========================
-- 16. Treatment
-- ===========================
INSERT INTO `treatment` (service_code, appointment_id) VALUES
(1, 1),
(2, 2);

-- ===========================
-- 17. Insurance_Claim
-- ===========================
INSERT INTO `insurance_claim` (claim_id, service_code, patient_id, approved_by, claimed_amount, claimed_at, insurance_id) VALUES
(1, 1, 3, 1, 400.00, NOW(), 1),
(2, 2, 4, 2, 500.00, NOW(), 2);

-- ===========================
-- 18. Billing_Invoice
-- ===========================
INSERT INTO `billing_invoice` (appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount, time_stamp) VALUES
(1, 50.00, 550.00, 1, 500.00, 50.00, NOW()),
(2, 60.00, 560.00, 2, 500.00, 60.00, NOW());

-- ===========================
-- 19. Billing_Payment
-- ===========================
INSERT INTO `billing_payment` (payment_id, invoice_id, branch_id, paid_amount, time_stamp, cashier_id) VALUES
(1, 1, 1, 500.00, NOW(), 1),
(2, 2, 2, 500.00, NOW(), 2);

-- ===========================
-- 20. Action
-- ===========================
INSERT INTO `action` (action_id, name) VALUES
(1, 'CREATE'),
(2, 'UPDATE'),
(3, 'DELETE'),
(4, 'VIEW');

-- ===========================
-- 21. Log
-- ===========================
INSERT INTO `log` (log_id, user_id, user_role, action_id, table_name, record_id, time_Stamp, details) VALUES
(1,1,'Admin_Staff',1,'Patient',1,NOW(),'Created record'),
(2,2,'Admin_Staff',2,'Doctor',2,NOW(),'Updated record');
