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
INSERT INTO `doctor_speciality` (doctor_id, speciality_id, added_at) VALUES
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
(10, 'patient8', 'hash10', 'Patient', 3, TRUE, NOW()),
(11, 'patient9', 'hash11', 'Patient', 4, TRUE, NOW()),
(12, 'patient10', 'hash12', 'Patient', 1, TRUE, NOW());

-- Additional Doctor Users
INSERT INTO `user` (user_id, username, password_hash, role, branch_id, is_approved, created_at) VALUES
(13, 'doctor5', 'hash13', 'Doctor', 1, TRUE, NOW()),
(14, 'doctor6', 'hash14', 'Doctor', 2, TRUE, NOW()),
(15, 'doctor7', 'hash15', 'Doctor', 3, TRUE, NOW());

-- Additional Staff Users
INSERT INTO `user` (user_id, username, password_hash, role, branch_id, is_approved, created_at) VALUES
(16, 'nurse2', 'hash16', 'Nurse', 1, TRUE, NOW()),
(17, 'receptionist2', 'hash17', 'Receptionist', 2, TRUE, NOW()),
(18, 'billing2', 'hash18', 'Billing_Staff', 3, TRUE, NOW());

-- Additional Patients
INSERT INTO `patient` (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type) VALUES
(5, 'Sarah Williams', 'Female', '0773456789', '123456780V', '789 Pine St', '1992-03-15', 'B+'),
(6, 'Michael Brown', 'Male', '0774567890', '123456781V', '321 Elm St', '1988-07-22', 'AB+'),
(7, 'Lisa Anderson', 'Female', '0775678901', '123456782V', '654 Maple Ave', '1995-11-08', 'O-'),
(8, 'David Wilson', 'Male', '0776789012', '123456783V', '987 Cedar Rd', '1991-04-18', 'A-'),
(9, 'Jennifer Taylor', 'Female', '0777890123', '123456784V', '147 Birch Lane', '1987-09-03', 'B-'),
(10, 'Robert Garcia', 'Male', '0778901234', '123456785V', '258 Spruce Dr', '1993-12-12', 'AB-'),
(11, 'Emma Martinez', 'Female', '0779012345', '123456786V', '369 Oak Avenue', '1989-06-30', 'O+'),
(12, 'James Rodriguez', 'Male', '0770123456', '123456787V', '741 Willow Street', '1994-02-14', 'A+');

-- Additional Doctors
INSERT INTO `doctor` (doctor_id, name, fee_per_patient, basic_monthly_salary, gender) VALUES
(5, 'Dr. Sarah Connor', 1300.00, 58000.00, 'Female'),
(6, 'Dr. James Wilson', 950.00, 47000.00, 'Male'),
(7, 'Dr. Amanda Chen', 1150.00, 53000.00, 'Female');

-- Additional Staff
INSERT INTO `staff` (staff_id, name, type, monthly_salary, gender) VALUES
(5, 'Maria Gonzalez', 'Nurse', 32000.00, 'Female'),
(6, 'John Smith', 'Receptionist', 29000.00, 'Male'),
(7, 'Lisa Chang', 'Billing_Staff', 34000.00, 'Female');

-- Additional User Contacts
INSERT INTO `user_contact` (contact, contact_type, is_default, user_id) VALUES
('sarah.williams@email.com','Email',TRUE,5),
('michael.brown@email.com','Email',TRUE,6),
('lisa.anderson@email.com','Email',TRUE,7),
('david.wilson@email.com','Email',TRUE,8),
('jennifer.taylor@email.com','Email',TRUE,9),
('robert.garcia@email.com','Email',TRUE,10),
('emma.martinez@email.com','Email',TRUE,11),
('james.rodriguez@email.com','Email',TRUE,12),
('dr.connor@hospital.com','Email',TRUE,13),
('dr.wilson@hospital.com','Email',TRUE,14),
('dr.chen@hospital.com','Email',TRUE,15),
('0773456789','Phone_No',TRUE,5),
('0774567890','Phone_No',TRUE,6),
('0775678901','Phone_No',TRUE,7),
('0776789012','Phone_No',TRUE,8),
('0777890123','Phone_No',TRUE,9),
('0778901234','Phone_No',TRUE,10),
('0779012345','Phone_No',TRUE,11),
('0770123456','Phone_No',TRUE,12);

-- Additional Specialities
INSERT INTO `speciality` (speciality_id, speciality_name, description) VALUES
(5, 'Dermatology', 'Skin related conditions'),
(6, 'Gastroenterology', 'Digestive system disorders'),
(7, 'Ophthalmology', 'Eye care and vision'),
(8, 'Psychiatry', 'Mental health conditions');

-- Doctor Specialities for new doctors
INSERT INTO `doctor_speciality` (doctor_id, speciality_id, added_at) VALUES
(5, 1, NOW()),  -- Dr. Sarah Connor - Cardiology
(5, 5, NOW()),  -- Dr. Sarah Connor - Dermatology
(6, 3, NOW()),  -- Dr. James Wilson - Orthopedics
(7, 2, NOW()),  -- Dr. Amanda Chen - Neurology
(7, 8, NOW());  -- Dr. Amanda Chen - Psychiatry

-- Additional Insurance Plans
INSERT INTO `insurance` (insurance_id, insurance_type, insurance_period, claim_percentage, created_at) VALUES
(5, 'Premium Health', '3 Years', 0.95, NOW()),
(6, 'Basic Coverage', '6 Months', 0.60, NOW()),
(7, 'Family Plan', '2 Years', 0.85, NOW());

-- Additional Patient Insurance
INSERT INTO `patient_insurance` (patient_id, insurance_id, created_at, is_expired) VALUES
(5,1,NOW(),FALSE),
(6,3,NOW(),FALSE),
(7,5,NOW(),FALSE),
(8,2,NOW(),FALSE),
(9,7,NOW(),FALSE),
(10,4,NOW(),FALSE);

-- Additional Treatment Catalogue
INSERT INTO `treatment_catelogue` (service_code, name, fee, description, speciality_id) VALUES
(5, 'MRI Scan', 1500.00, 'Magnetic resonance imaging', 2),
(6, 'CT Scan', 1200.00, 'Computed tomography scan', 3),
(7, 'Ultrasound', 800.00, 'Ultrasound examination', 1),
(8, 'Blood Test', 250.00, 'Complete blood count', 1),
(9, 'Eye Examination', 400.00, 'Comprehensive eye check', 7),
(10, 'Skin Biopsy', 600.00, 'Tissue sample analysis', 5),
(11, 'Endoscopy', 1000.00, 'Internal examination', 6),
(12, 'Psychiatric Consultation', 800.00, 'Mental health assessment', 8);

-- Additional Appointments
INSERT INTO `appointment` (appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp) VALUES
-- October 2025 appointments
(3, 5, 1, 'Regular checkup', '2025-10-15', '09:00-09:30', 'Booked', NOW()),
(4, 6, 2, 'Severe headaches for 3 days', '2025-10-15', '10:00-10:30', 'Booked', NOW()),
(5, 7, 3, 'Knee pain after exercise', '2025-10-15', '11:00-11:30', 'Booked', NOW()),
(6, 8, 4, 'Child fever and cough', '2025-10-15', '14:00-14:30', 'Booked', NOW()),
(7, 9, 5, 'Chest discomfort', '2025-10-16', '09:00-09:30', 'Booked', NOW()),
(8, 10, 6, 'Back pain from work injury', '2025-10-16', '10:00-10:30', 'Booked', NOW()),
(9, 11, 7, 'Anxiety and stress', '2025-10-16', '11:00-11:30', 'Booked', NOW()),
(10, 12, 1, 'High blood pressure', '2025-10-16', '14:00-14:30', 'Booked', NOW()),

-- More appointments for different dates
(11, 5, 2, 'Follow-up consultation', '2025-10-17', '09:30-10:00', 'Booked', NOW()),
(12, 6, 3, 'Wrist fracture follow-up', '2025-10-17', '11:00-11:30', 'Completed', NOW()),
(13, 7, 4, 'Vaccination for child', '2025-10-17', '15:00-15:30', 'Booked', NOW()),
(14, 8, 5, 'Skin rash examination', '2025-10-18', '09:00-09:30', 'Booked', NOW()),
(15, 9, 6, 'Joint pain assessment', '2025-10-18', '10:00-10:30', 'Booked', NOW()),

-- Weekend and emergency appointments
(16, 10, 7, 'Mental health consultation', '2025-10-19', '10:00-10:30', 'Completed', NOW()),
(17, 11, 1, 'Emergency chest pain', '2025-10-19', '11:00-11:30', 'Completed', NOW()),
(18, 12, 2, 'Neurological symptoms', '2025-10-20', '09:00-09:30', 'Cancelled', NOW()),

-- Future appointments
(19, 5, 3, 'Annual physical exam', '2025-10-22', '09:00-09:30', 'Booked', NOW()),
(20, 6, 4, 'Child development check', '2025-10-22', '14:00-14:30', 'Booked', NOW()),
(21, 7, 5, 'Dermatology consultation', '2025-10-23', '10:00-10:30', 'Booked', NOW()),
(22, 8, 6, 'Physical therapy evaluation', '2025-10-23', '15:00-15:30', 'Booked', NOW()),
(23, 9, 7, 'Stress management session', '2025-10-24', '08:30-09:00', 'Booked', NOW()),

-- November appointments
(24, 10, 1, 'Cardiac stress test', '2025-11-01', '09:00-09:30', 'Booked', NOW()),
(25, 11, 2, 'Memory assessment', '2025-11-01', '10:30-11:00', 'Booked', NOW()),
(26, 12, 3, 'Bone density scan', '2025-11-02', '08:30-09:00', 'Booked', NOW()),

-- Past appointments (September)
(27, 5, 4, 'Routine checkup', '2025-09-25', '10:00-10:30', 'Completed', NOW()),
(28, 6, 5, 'Skin condition treatment', '2025-09-26', '14:00-14:30', 'Completed', NOW()),
(29, 7, 6, 'Orthopedic consultation', '2025-09-27', '11:00-11:30', 'Completed', NOW()),
(30, 8, 7, 'Counseling session', '2025-09-28', '09:00-09:30', 'Completed', NOW());

-- Additional Medical History
INSERT INTO `medical_history` (medical_history_id, appointment_id, visit_date, diagnosis, symptoms, allergies, notes, follow_up_date, created_at, updated_at) VALUES
(3, 3, '2025-10-15', 'Hypertension Stage 1', 'Elevated blood pressure, mild headache', 'None', 'Patient advised lifestyle changes and diet modification', '2025-11-15', NOW(), NOW()),
(4, 4, '2025-10-15', 'Tension Headache', 'Severe headache, light sensitivity', 'Aspirin', 'Stress-related headaches, recommend relaxation techniques', '2025-10-29', NOW(), NOW()),
(5, 5, '2025-10-15', 'Minor Knee Strain', 'Knee pain, slight swelling', 'None', 'Sports-related injury, RICE protocol recommended', '2025-10-22', NOW(), NOW()),
(6, 6, '2025-10-15', 'Upper Respiratory Infection', 'Fever, cough, congestion', 'Penicillin', 'Viral infection, supportive care recommended', '2025-10-22', NOW(), NOW()),
(7, 12, '2025-10-17', 'Healed Fracture', 'No pain, full mobility restored', 'None', 'Wrist fracture completely healed, cleared for normal activities', NULL, NOW(), NOW()),
(8, 16, '2025-10-19', 'Generalized Anxiety Disorder', 'Anxiety, sleep disturbance, worry', 'None', 'Mild anxiety symptoms, therapy and coping strategies discussed', '2025-11-19', NOW(), NOW()),
(9, 17, '2025-10-19', 'Acute Chest Pain - Non-cardiac', 'Sharp chest pain, shortness of breath', 'Iodine', 'Muscular chest pain, EKG normal', '2025-10-26', NOW(), NOW()),
(10, 27, '2025-09-25', 'Type 2 Diabetes Mellitus', 'Increased thirst, frequent urination', 'Metformin', 'Well-controlled diabetes, continue current medication', '2025-12-25', NOW(), NOW());

-- Additional Prescriptions
INSERT INTO `prescription` (appointment_id, consultation_note, prescription_items_details, prescribed_at, is_active) VALUES
(3, 'Monitor blood pressure daily', 'Lisinopril 10mg once daily, Lifestyle modifications', NOW(), TRUE),
(4, 'Avoid triggers, adequate rest', 'Sumatriptan 50mg as needed for headache', NOW(), TRUE),
(5, 'Rest and ice application', 'Ibuprofen 400mg twice daily for 5 days', NOW(), FALSE),
(6, 'Increase fluid intake, rest', 'Acetaminophen 500mg every 6 hours, Cough syrup', NOW(), FALSE),
(7, 'Continue physical therapy', 'No medications needed, cleared for activities', NOW(), FALSE),
(16, 'Practice relaxation techniques', 'Sertraline 25mg once daily, Counseling sessions', NOW(), TRUE),
(17, 'Follow up if symptoms worsen', 'Ibuprofen 200mg as needed for pain', NOW(), FALSE);

-- Additional Treatments
INSERT INTO `treatment` (service_code, appointment_id) VALUES
(8, 3),  -- Blood Test for appointment 3
(5, 4),  -- MRI Scan for appointment 4
(3, 5),  -- X-Ray for appointment 5
(8, 6),  -- Blood Test for appointment 6
(6, 7),  -- CT Scan for appointment 7
(7, 8),  -- Ultrasound for appointment 8
(12, 9), -- Psychiatric Consultation for appointment 9
(1, 10), -- ECG for appointment 10
(9, 11), -- Eye Examination for appointment 11
(10, 14), -- Skin Biopsy for appointment 14
(11, 22); -- Endoscopy for appointment 22

-- Additional Insurance Claims
INSERT INTO `insurance_claim` (claim_id, service_code, patient_id, approved_by, claimed_amount, claimed_at, insurance_id) VALUES
(3, 8, 5, 1, 200.00, NOW(), 1),
(4, 5, 6, 2, 1200.00, NOW(), 3),
(5, 3, 7, 1, 240.00, NOW(), 5),
(6, 7, 8, 2, 640.00, NOW(), 2),
(7, 12, 9, 1, 640.00, NOW(), 7),
(8, 1, 10, 2, 400.00, NOW(), 4);

-- Additional Billing Invoices
INSERT INTO `billing_invoice` (appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount, time_stamp) VALUES
(3, 0.00, 250.00, 3, 200.00, 50.00, NOW()),
(4, 100.00, 1500.00, 4, 1200.00, 300.00, NOW()),
(5, 50.00, 350.00, 5, 240.00, 110.00, NOW()),
(6, 0.00, 800.00, 6, 640.00, 160.00, NOW()),
(7, 200.00, 1000.00, 7, 640.00, 360.00, NOW()),
(8, 0.00, 500.00, 8, 400.00, 100.00, NOW());

-- Additional Billing Payments
INSERT INTO `billing_payment` (payment_id, invoice_id, branch_id, paid_amount, time_stamp, cashier_id) VALUES
(3, 3, 1, 50.00, NOW(), 1),
(4, 4, 2, 300.00, NOW(), 2),
(5, 5, 3, 110.00, NOW(), 1),
(6, 6, 1, 160.00, NOW(), 2),
(7, 7, 2, 360.00, NOW(), 1),
(8, 8, 3, 100.00, NOW(), 2);

-- Additional Log Entries
INSERT INTO `log` (log_id, user_id, user_role, action_id, table_name, record_id, time_Stamp, details) VALUES
(3, 5, 'Patient', 1, 'Appointment', 3, NOW(), 'Created new appointment'),
(4, 1, 'Admin_Staff', 2, 'Patient', 5, NOW(), 'Updated patient information'),
(5, 13, 'Doctor', 1, 'Prescription', 3, NOW(), 'Created new prescription'),
(6, 2, 'Admin_Staff', 1, 'Insurance_Claim', 3, NOW(), 'Processed insurance claim'),
(7, 6, 'Patient', 3, 'Appointment', 18, NOW(), 'Cancelled appointment'),
(8, 14, 'Doctor', 2, 'Medical_History', 7, NOW(), 'Updated medical history'),
(9, 1, 'Admin_Staff', 1, 'Billing_Invoice', 3, NOW(), 'Generated billing invoice'),
(10, 15, 'Doctor', 1, 'Treatment', 11, NOW(), 'Added treatment record');
USE `Project-MedSync`;

-- BRANCH
INSERT INTO `branch` (`branch_id`, `name`, `location`, `landline_no`)
VALUES
(1, 'Colombo', 'Colombo 07', '0112567890'),
(2, 'Kandy', 'Peradeniya Road', '0812345678'),
(3, 'Galle', 'Fort Road', '0912233445'),
(4, 'Jaffna', 'Stanley Road', '0214567890'),
(5, 'Matara', 'Beach Road', '0413344556');

-- USER
INSERT INTO `user` (`user_id`, `username`, `password_hash`, `role`, `branch_id`, `is_approved`)
VALUES
(1, 'super_admin', 'hash_super', 'Super_Admin', 1, TRUE),
(2, 'bm_kandy', 'hash_kandy', 'Branch_Manager', 2, TRUE),
(3, 'dr_perera', 'hash_perera', 'Doctor', 1, TRUE),
(4, 'nurse_amma', 'hash_nurse', 'Nurse', 3, TRUE),
(5, 'recept_01', 'hash_recept', 'Receptionist', 1, TRUE),
(6, 'bill_staff', 'hash_bill', 'Billing_Staff', 2, TRUE),
(7, 'agent_01', 'hash_agent', 'Insurance_Agent', 3, TRUE),
(8, 'patient_ravi', 'hash_ravi', 'Patient', 1, TRUE),
(9, 'patient_sara', 'hash_sara', 'Patient', 2, TRUE),
(10, 'patient_kamal', 'hash_kamal', 'Patient', 3, TRUE),
(11, 'patient_nimali', 'hash_nimali', 'Patient', 2, TRUE),
(12, 'patient_tharindu', 'hash_tharindu', 'Patient', 3, TRUE),
(13, 'bm_malathi', 'hash_malathi', 'Branch_Manager', 1, TRUE),
(14, 'bm_gayan', 'hash_gayan', 'Branch_Manager', 2, TRUE),
(15, 'bm_chathura', 'hash_chathura', 'Branch_Manager', 3, TRUE),
(16, 'bm_anoma', 'hash_anoma', 'Branch_Manager', 1, TRUE),
(17, 'admin_dinuka', 'hash_dinuka', 'Admin_Staff', 2, TRUE),
(18, 'dr_silva', 'hash_drsilva', 'Doctor', 1, TRUE),
(19, 'dr_fernando', 'hash_drfernando', 'Doctor', 2, TRUE),
(20, 'dr_wijesinghe', 'hash_drwije', 'Doctor', 3, TRUE),
(21, 'dr_jayasinghe', 'hash_drjaya', 'Doctor', 1, TRUE);

-- PATIENT
INSERT INTO `patient` (`patient_id`, `name`, `gender`, `emergency_contact_no`, `nic`, `address`, `date_of_birth`, `blood_type`)
VALUES
(8, 'Ravindu Perera', 'Male', '0771234567', '200012345V', 'Colombo', '2000-01-12', 'A+'),
(9, 'Sara Silva', 'Female', '0779876543', '200134567V', 'Kandy', '1999-05-23', 'B+'),
(10, 'Kamal Fernando', 'Male', '0765554443', '199812345V', 'Galle', '1998-11-10', 'O-'),
(11, 'Nimali Jayasuriya', 'Female', '0713322114', '200156789V', 'Matara', '2001-02-19', 'AB+'),
(12, 'Tharindu De Silva', 'Male', '0756677889', '199945612V', 'Jaffna', '1997-06-05', 'A-');

-- BRANCH MANAGER
INSERT INTO `branch_manager` (`manager_id`, `name`, `monthly_salary`, `gender`)
VALUES
(2, 'Kanishka Weerasinghe', 150000.00, 'Male'),
(13, 'Malathi Perera', 152000.00, 'Female'),
(14, 'Gayan Fernando', 148000.00, 'Male'),
(15, 'Chathura Silva', 155000.00, 'Male'),
(16, 'Anoma Jayasinghe', 160000.00, 'Female');

-- STAFF
INSERT INTO `staff` (`staff_id`, `name`, `type`, `monthly_salary`, `gender`)
VALUES
(4, 'Amma Nisansala', 'Nurse', 95000.00, 'Female'),
(5, 'Ruwini Fonseka', 'Receptionist', 80000.00, 'Female'),
(6, 'Ruwan Dissanayake', 'Billing_Staff', 85000.00, 'Male'),
(7, 'Rashmi Senanayake', 'Insurance_Agent', 90000.00, 'Female'),
(17, 'Dinuka Jayawardena', 'Admin_Staff', 92000.00, 'Male');

-- USER CONTACT
INSERT INTO `user_contact` (`contact`, `contact_type`, `is_default`, `user_id`)
VALUES
('superadmin@medsync.lk', 'Email', TRUE, 1),
('0112567890', 'Phone_No', TRUE, 1),
('bm.kandy@medsync.lk', 'Email', TRUE, 2),
('0751112223', 'Phone_No', TRUE, 3),
('ravi@gmail.com', 'Email', TRUE, 8);

-- SPECIALITY
INSERT INTO `speciality` (`speciality_id`, `speciality_name`, `description`)
VALUES
(1, 'Cardiology', 'Heart and blood vessel treatments'),
(2, 'Neurology', 'Brain and nervous system care'),
(3, 'Dermatology', 'Skin related treatments'),
(4, 'Pediatrics', 'Child healthcare'),
(5, 'Orthopedics', 'Bone and muscle treatments');

-- DOCTOR
INSERT INTO `doctor` (`doctor_id`, `name`, `fee_per_patient`, `basic_monthly_salary`, `gender`)
VALUES
(3, 'Dr. Perera', 2500.00, 175000.00, 'Male'),
(18, 'Dr. Silva', 3000.00, 180000.00, 'Male'),
(19, 'Dr. Fernando', 2200.00, 160000.00, 'Female'),
(20, 'Dr. Wijesinghe', 2700.00, 170000.00, 'Female'),
(21, 'Dr. Jayasinghe', 2600.00, 165000.00, 'Male');

-- DOCTOR SPECIALITY
INSERT INTO `doctor_speciality` (`doctor_id`, `specialiy_id`, `added_at`)
VALUES
(3, 1, '2025-01-10 10:00:00'),
(18, 2, '2025-01-11 09:30:00'),
(19, 3, '2025-02-01 08:45:00'),
(20, 4, '2025-02-05 12:00:00'),
(21, 5, '2025-02-10 11:15:00');

-- INSURANCE
INSERT INTO `insurance` (`insurance_id`, `insurance_type`, `insurance_period`, `claim_percentage`, `created_at`)
VALUES
(1, 'Health Basic', '1 Year', 0.70, '2025-01-01 00:00:00'),
(2, 'Health Plus', '2 Years', 0.80, '2025-02-01 00:00:00'),
(3, 'Premium Care', '3 Years', 0.90, '2025-03-01 00:00:00'),
(4, 'Family Health', '1 Year', 0.75, '2025-04-01 00:00:00'),
(5, 'Senior Care', '2 Years', 0.85, '2025-05-01 00:00:00');

-- TREATMENT CATALOGUE
INSERT INTO `treatment_catelogue` (`service_code`, `name`, `fee`, `description`, `speciality_id`)
VALUES
(101, 'ECG Scan', 1500.00, 'Electrocardiogram test', 1),
(102, 'MRI Scan', 8000.00, 'Brain MRI scanning', 2),
(103, 'Skin Therapy', 3000.00, 'Acne and scar treatment', 3),
(104, 'Child Checkup', 1200.00, 'Routine pediatric examination', 4),
(105, 'Fracture Treatment', 5000.00, 'Bone fracture repair', 5);

-- INSURANCE CLAIM
INSERT INTO `insurance_claim` (`claim_id`, `service_code`, `patient_id`, `approved_by`, `claimed_amount`, `claimed_at`, `insurance_id`)
VALUES
(1, 101, 8, 7, 1000.00, '2025-06-01 09:00:00', 1),
(2, 102, 9, 7, 6000.00, '2025-06-02 09:30:00', 2),
(3, 103, 10, 7, 2500.00, '2025-06-03 10:00:00', 3),
(4, 104, 11, 7, 900.00, '2025-06-04 10:30:00', 4),
(5, 105, 12, 7, 4000.00, '2025-06-05 11:00:00', 5);

-- APPOINTMENT
INSERT INTO `appointment` (`appointment_id`, `patient_id`, `doctor_id`, `patient_note`, `date`, `time_slot`, `status`, `time_stamp`)
VALUES
(1, 8, 3, 'Chest pain', '2025-07-01', '09:00-09:30', 'Completed', '2025-07-01 09:00:00'),
(2, 9, 18, 'Frequent headaches', '2025-07-02', '10:00-10:30', 'Completed', '2025-07-02 10:00:00'),
(3, 10, 19, 'Skin rash', '2025-07-03', '11:00-11:30', 'Completed', '2025-07-03 11:00:00'),
(4, 11, 20, 'Child checkup', '2025-07-04', '12:00-12:30', 'Completed', '2025-07-04 12:00:00'),
(5, 12, 21, 'Fracture pain', '2025-07-05', '13:00-13:30', 'Completed', '2025-07-05 13:00:00');

-- BILLING INVOICE
INSERT INTO `billing_invoice` (`appointment_id`, `additional_fee`, `total_fee`, `claim_id`, `net_amount`, `remaining_payment_amount`, `time_stamp`)
VALUES
(1, 200.00, 2700.00, 1, 1700.00, 0.00, '2025-07-01 09:40:00'),
(2, 300.00, 8300.00, 2, 2300.00, 0.00, '2025-07-02 10:40:00'),
(3, 100.00, 3100.00, 3, 600.00, 0.00, '2025-07-03 11:40:00'),
(4, 150.00, 1350.00, 4, 450.00, 0.00, '2025-07-04 12:40:00'),
(5, 400.00, 5400.00, 5, 1400.00, 0.00, '2025-07-05 13:40:00');

-- BILLING PAYMENT
INSERT INTO `billing_payment` (`payment_id`, `invoice_id`, `branch_id`, `paid_amount`, `time_stamp`, `cashier_id`)
VALUES
(1, 1, 1, 1700.00, '2025-07-01 10:00:00', 6),
(2, 2, 2, 2300.00, '2025-07-02 11:00:00', 6),
(3, 3, 3, 600.00, '2025-07-03 12:00:00', 6),
(4, 4, 4, 450.00, '2025-07-04 13:00:00', 6),
(5, 5, 5, 1400.00, '2025-07-05 14:00:00', 6);

-- PRESCRIPTION
INSERT INTO `prescription` (`appointment_id`, `consultation_note`, `prescription_items_details`, `prescribed_at`, `is_active`)
VALUES
(1, 'Heartburn detected', 'Omeprazole 20mg daily', '2025-07-01 09:30:00', TRUE),
(2, 'Migraine episodes', 'Paracetamol 500mg as needed', '2025-07-02 10:30:00', TRUE),
(3, 'Skin allergy', 'Hydrocortisone cream 1%', '2025-07-03 11:30:00', TRUE),
(4, 'Child vitamins', 'Vitamin syrup daily', '2025-07-04 12:30:00', TRUE),
(5, 'Bone recovery', 'Calcium supplement 1000mg', '2025-07-05 13:30:00', TRUE);

-- ACTION
INSERT INTO `action` (`action_id`, `name`)
VALUES
(1, 'INSERT'),
(2, 'UPDATE'),
(3, 'DELETE'),
(4, 'LOGIN'),
(5, 'VIEW');

-- MEDICAL HISTORY
INSERT INTO `medical_history` (`medical_history_id`, `appointment_id`, `visit_date`, `diagnosis`, `symptoms`, `allergies`, `notes`, `follow_up_date`, `created_at`, `updated_at`)
VALUES
(1, 1, '2025-07-01', 'Mild gastritis', 'Chest pain', 'None', 'Monitor diet', '2025-07-15', '2025-07-01 10:00:00', '2025-07-01 10:00:00'),
(2, 2, '2025-07-02', 'Migraine', 'Headache', 'None', 'Reduce stress', '2025-07-20', '2025-07-02 11:00:00', '2025-07-02 11:00:00'),
(3, 3, '2025-07-03', 'Dermatitis', 'Rash', 'Peanuts', 'Apply cream daily', '2025-07-18', '2025-07-03 12:00:00', '2025-07-03 12:00:00'),
(4, 4, '2025-07-04', 'Normal growth', 'N/A', 'None', 'Continue healthy diet', '2025-07-25', '2025-07-04 13:00:00', '2025-07-04 13:00:00'),
(5, 5, '2025-07-05', 'Fracture healing', 'Pain', 'None', 'Physiotherapy advised', '2025-07-20', '2025-07-05 14:00:00', '2025-07-05 14:00:00');

-- TREATMENT
INSERT INTO `treatment` (`service_code`, `appointment_id`)
VALUES
(101, 1),
(102, 2),
(103, 3),
(104, 4),
(105, 5);

-- LOG
INSERT INTO `log` (`log_id`, `user_id`, `user_role`, `action_id`, `table_name`, `record_id`, `time_stamp`, `details`)
VALUES
-- Admin activities
(1, 1, 'admin', 4, 'user', 1, '2025-05-15 09:00:00', 'Admin logged in successfully'),
(2, 1, 'admin', 1, 'branch', 6, '2025-05-15 09:10:00', 'Created new branch record'),
(3, 1, 'admin', 2, 'user', 4, '2025-05-15 09:30:00', 'Approved new technician account'),
(4, 1, 'admin', 5, 'system', 1, '2025-05-15 18:00:00', 'Admin logged out'),
-- Manager activities
(5, 2, 'manager', 4, 'user', 2, '2025-06-01 08:45:00', 'Manager logged in successfully'),
(6, 2, 'manager', 1, 'employee', 10, '2025-06-01 09:10:00', 'Added new employee to HR system'),
(7, 2, 'manager', 2, 'employee', 10, '2025-06-02 11:20:00', 'Updated employee salary details'),
(8, 2, 'manager', 3, 'employee', 9, '2025-06-03 15:05:00', 'Deleted inactive employee record'),
(9, 2, 'manager', 5, 'system', 2, '2025-06-03 17:30:00', 'Manager logged out'),
-- Clerk activities
(10, 3, 'clerk', 4, 'user', 3, '2025-06-05 08:00:00', 'Clerk logged in successfully'),
(11, 3, 'clerk', 1, 'invoice', 27, '2025-06-05 08:30:00', 'Created new invoice for order #1452'),
(12, 3, 'clerk', 2, 'invoice', 27, '2025-06-05 09:00:00', 'Updated invoice total due to discount'),
(13, 3, 'clerk', 5, 'system', 3, '2025-06-05 17:45:00', 'Clerk logged out'),
-- Technician and Auditor
(14, 4, 'technician', 3, 'device', 5, '2025-06-07 14:10:00', 'Deleted faulty sensor device entry'),
(15, 5, 'auditor', 4, 'audit_log', 3, '2025-06-10 09:30:00', 'Auditor logged in to review records');


-- PATIENT INSURANCE
INSERT INTO `patient_insurance` (`patient_id`, `insurance_id`, `created_at`, `is_expired`)
VALUES
(8, 1, '2025-01-01 00:00:00', FALSE),
(9, 2, '2025-02-01 00:00:00', FALSE),
(10, 3, '2025-03-01 00:00:00', FALSE),
(11, 4, '2025-04-01 00:00:00', FALSE),
(12, 5, '2025-05-01 00:00:00', FALSE);
