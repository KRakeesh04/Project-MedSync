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
(4, 'Dr. Emily Davis', 1100.00, 52000.00, 'Female');

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

-- ===========================
-- ADDITIONAL SAMPLE DATA
-- ===========================

-- Additional Users for Patients
INSERT INTO `user` (user_id, username, password_hash, role, branch_id, is_approved, created_at) VALUES
(5, 'patient3', 'hash5', 'Patient', 1, TRUE, NOW()),
(6, 'patient4', 'hash6', 'Patient', 2, TRUE, NOW()),
(7, 'patient5', 'hash7', 'Patient', 3, TRUE, NOW()),
(8, 'patient6', 'hash8', 'Patient', 1, TRUE, NOW()),
(9, 'patient7', 'hash9', 'Patient', 2, TRUE, NOW()),
(10, 'patient8', 'hash10', 'Patient', 3, TRUE, NOW());

-- Additional Patients
INSERT INTO `patient` (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type) VALUES
(5, 'Sarah Williams', 'Female', '0773456789', '123456780V', '789 Pine St', '1992-03-15', 'B+'),
(6, 'Michael Brown', 'Male', '0774567890', '123456781V', '321 Elm St', '1988-07-22', 'AB+'),
(7, 'Lisa Anderson', 'Female', '0775678901', '123456782V', '654 Maple Ave', '1995-11-08', 'O-'),
(8, 'David Wilson', 'Male', '0776789012', '123456783V', '987 Cedar Rd', '1991-04-18', 'A-'),
(9, 'Jennifer Taylor', 'Female', '0777890123', '123456784V', '147 Birch Lane', '1987-09-03', 'B-'),
(10, 'Robert Garcia', 'Male', '0778901234', '123456785V', '258 Spruce Dr', '1993-12-12', 'AB-');

-- Additional User Contacts
INSERT INTO `user_contact` (contact, contact_type, is_default, user_id) VALUES
('sarah.williams@email.com','Email',TRUE,5),
('michael.brown@email.com','Email',TRUE,6),
('lisa.anderson@email.com','Email',TRUE,7),
('david.wilson@email.com','Email',TRUE,8),
('jennifer.taylor@email.com','Email',TRUE,9),
('robert.garcia@email.com','Email',TRUE,10),
('0773456789','Phone_No',TRUE,5),
('0774567890','Phone_No',TRUE,6),
('0775678901','Phone_No',TRUE,7),
('0776789012','Phone_No',TRUE,8),
('0777890123','Phone_No',TRUE,9),
('0778901234','Phone_No',TRUE,10);

-- Additional Doctors (need user entries first)
INSERT INTO `user` (user_id, username, password_hash, role, branch_id, is_approved, created_at) VALUES
(11, 'doctor5', 'hash11', 'Doctor', 1, TRUE, NOW()),
(12, 'doctor6', 'hash12', 'Doctor', 2, TRUE, NOW());

INSERT INTO `doctor` (doctor_id, name, fee_per_patient, basic_monthly_salary, gender) VALUES
(5, 'Dr. Sarah Connor', 1300.00, 58000.00, 'Female'),
(6, 'Dr. James Wilson', 950.00, 47000.00, 'Male');

-- Doctor Specialities for new doctors
INSERT INTO `doctor_speciality` (doctor_id, specialiy_id, added_at) VALUES
(5, 1, NOW()),  -- Dr. Sarah Connor - Cardiology
(6, 3, NOW());  -- Dr. James Wilson - Orthopedics

-- ===========================
-- ADDITIONAL APPOINTMENT DATA
-- ===========================

INSERT INTO `appointment` (appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp) VALUES
-- October 2025 appointments
(3, 5, 1, 'Regular checkup', '2025-10-15', '09:00-09:30', 'Booked', NOW()),
(4, 6, 2, 'Severe headaches for 3 days', '2025-10-15', '10:00-10:30', 'Booked', NOW()),
(5, 7, 3, 'Knee pain after exercise', '2025-10-15', '11:00-11:30', 'Booked', NOW()),
(6, 8, 4, 'Child fever and cough', '2025-10-15', '14:00-14:30', 'Booked', NOW()),
(7, 9, 5, 'Chest discomfort', '2025-10-16', '09:00-09:30', 'Booked', NOW()),
(8, 10, 6, 'Back pain from work injury', '2025-10-16', '10:00-10:30', 'Booked', NOW()),

-- More appointments for different dates
(9, 3, 1, 'Follow-up consultation', '2025-10-17', '09:30-10:00', 'Booked', NOW()),
(10, 4, 3, 'Wrist fracture follow-up', '2025-10-17', '11:00-11:30', 'Completed', NOW()),
(11, 5, 2, 'Migraine consultation', '2025-10-17', '15:00-15:30', 'Booked', NOW()),
(12, 6, 4, 'Vaccination for child', '2025-10-18', '09:00-09:30', 'Booked', NOW()),

-- Weekend appointments
(13, 7, 1, 'Emergency chest pain', '2025-10-19', '10:00-10:30', 'Completed', NOW()),
(14, 8, 5, 'Heart palpitations', '2025-10-19', '11:00-11:30', 'Booked', NOW()),
(15, 9, 6, 'Sports injury - ankle', '2025-10-20', '09:00-09:30', 'Cancelled', NOW()),

-- Future appointments
(16, 10, 1, 'Annual physical exam', '2025-10-22', '09:00-09:30', 'Booked', NOW()),
(17, 3, 2, 'Neurological evaluation', '2025-10-22', '14:00-14:30', 'Booked', NOW()),
(18, 4, 3, 'Physical therapy consultation', '2025-10-23', '10:00-10:30', 'Booked', NOW()),
(19, 5, 4, 'Child behavioral assessment', '2025-10-23', '15:00-15:30', 'Booked', NOW()),
(20, 6, 5, 'Cardiac stress test', '2025-10-24', '08:30-09:00', 'Booked', NOW()),

-- More varied appointments with different statuses
(21, 7, 6, 'Joint replacement consultation', '2025-10-25', '09:00-09:30', 'Booked', NOW()),
(22, 8, 1, 'Cholesterol check', '2025-10-25', '11:00-11:30', 'Booked', NOW()),
(23, 9, 2, 'Memory issues consultation', '2025-10-26', '10:00-10:30', 'Booked', NOW()),
(24, 10, 3, 'Arthritis pain management', '2025-10-26', '14:00-14:30', 'No-show', NOW()),
(25, 3, 4, 'Growth monitoring', '2025-10-28', '09:00-09:30', 'Booked', NOW()),

-- November appointments
(26, 4, 5, 'Post-surgery follow-up', '2025-11-01', '09:00-09:30', 'Booked', NOW()),
(27, 5, 6, 'Rehabilitation assessment', '2025-11-01', '10:30-11:00', 'Booked', NOW()),
(28, 6, 1, 'Blood pressure monitoring', '2025-11-02', '08:30-09:00', 'Booked', NOW()),
(29, 7, 2, 'Seizure evaluation', '2025-11-02', '15:00-15:30', 'Booked', NOW()),
(30, 8, 3, 'Bone density scan', '2025-11-03', '10:00-10:30', 'Booked', NOW()),

-- Emergency and urgent appointments
(31, 9, 4, 'High fever - urgent', '2025-10-12', '08:00-08:30', 'Completed', NOW()),
(32, 10, 5, 'Chest pain - emergency', '2025-10-13', '16:00-16:30', 'Completed', NOW()),
(33, 3, 6, 'Accident injury check', '2025-10-14', '12:00-12:30', 'Completed', NOW()),

-- Past appointments (September)
(34, 4, 1, 'Routine checkup', '2025-09-25', '10:00-10:30', 'Completed', NOW()),
(35, 5, 2, 'Headache treatment', '2025-09-26', '14:00-14:30', 'Completed', NOW()),
(36, 6, 3, 'Knee examination', '2025-09-27', '11:00-11:30', 'Completed', NOW()),
(37, 7, 4, 'Child wellness check', '2025-09-28', '09:00-09:30', 'Completed', NOW()),
(38, 8, 5, 'Heart consultation', '2025-09-30', '15:00-15:30', 'Completed', NOW());
