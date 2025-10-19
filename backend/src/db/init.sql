-- Active: 1755111596628@@127.0.0.1@3306@Project-MedSync
-- BRANCHES
INSERT INTO `branch` (branch_id, name, location, landline_no, created_at) VALUES
(1, 'Colombo', 'Colombo 07', '0112567890', NOW()),
(2, 'Kandy', 'Peradeniya Road', '0812345678', NOW()),
(3, 'Galle', 'Fort Road', '0912233445', NOW()),
(4, 'Jaffna', 'Stanley Road', '0214567890', NOW()),
(5, 'Matara', 'Beach Road', '0413344556', NOW()),
(6, 'Negombo', 'Seaside Ave', '0312233445', NOW()),
(7, 'Kurunegala', 'Hill Road', '0373344556', NOW()),
(8, 'Anuradhapura', 'Historic Rd', '0253344556', NOW());


-- USERS (admins, managers, staff, doctors-as-users, patients-as-users)
INSERT INTO `user`(user_id, username, password_hash, role, branch_id, is_approved, created_at) VALUES
(1, 'super_admin', '$2b$10$gMXv0.zIImOvgJmqFe2TmuSf.d1tqvlJLUXm2FsBYTxLafsxXALn.', 'Super_Admin', 1, TRUE, NOW()),
(2, 'bm_kandy', 'hash_kandy', 'Branch_Manager', 2, TRUE, NOW()),
(3, 'bm_galle', 'hash_galle', 'Branch_Manager', 3, TRUE, NOW()),
(4, 'bm_jaffna', 'hash_jaffna', 'Branch_Manager', 4, TRUE, NOW()),
(5, 'admin_dinuka', 'hash_admin', 'Admin_Staff', 1, TRUE, NOW()),
(6, 'nurse_amma', 'hash_nurse', 'Nurse', 1, TRUE, NOW()),
(7, 'recept01', 'hash_recept', 'Receptionist', 1, TRUE, NOW()),
(8, 'bill_staff1', 'hash_bill1', 'Billing_Staff', 2, TRUE, NOW()),
(9, 'agent01', 'hash_agent', 'Insurance_Agent', 3, TRUE, NOW()),
(10, 'doc_user1', 'hash_docu1', 'Doctor', 1, TRUE, NOW()),
(11, 'patient_001', 'hash_p001', 'Patient', 1, TRUE, NOW()),
(12, 'patient_002', 'hash_p002', 'Patient', 1, TRUE, NOW()),
(13, 'patient_003', 'hash_p003', 'Patient', 2, TRUE, NOW()),
(14, 'patient_004', 'hash_p004', 'Patient', 2, TRUE, NOW()),
(15, 'patient_005', 'hash_p005', 'Patient', 3, TRUE, NOW()),
(16, 'patient_006', 'hash_p006', 'Patient', 3, TRUE, NOW()),
(17, 'patient_007', 'hash_p007', 'Patient', 4, TRUE, NOW()),
(18, 'patient_008', 'hash_p008', 'Patient', 4, TRUE, NOW()),
(19, 'patient_009', 'hash_p009', 'Patient', 5, TRUE, NOW()),
(20, 'patient_010', 'hash_p010', 'Patient', 5, TRUE, NOW()),
(21, 'patient_011', 'hash_p011', 'Patient', 6, TRUE, NOW()),
(22, 'patient_012', 'hash_p012', 'Patient', 6, TRUE, NOW()),
(23, 'patient_013', 'hash_p013', 'Patient', 7, TRUE, NOW()),
(24, 'patient_014', 'hash_p014', 'Patient', 7, TRUE, NOW()),
(25, 'patient_015', 'hash_p015', 'Patient', 8, TRUE, NOW()),
(26, 'patient_016', 'hash_p016', 'Patient', 8, TRUE, NOW()),
(27, 'patient_017', 'hash_p017', 'Patient', 1, TRUE, NOW()),
(28, 'patient_018', 'hash_p018', 'Patient', 2, TRUE, NOW()),
(29, 'patient_019', 'hash_p019', 'Patient', 3, TRUE, NOW()),
(30, 'patient_020', 'hash_p020', 'Patient', 4, TRUE, NOW()),
(31, 'patient_021', 'hash_p021', 'Patient', 1, TRUE, NOW()),
(32, 'patient_022', 'hash_p022', 'Patient', 2, TRUE, NOW()),
(33, 'patient_023', 'hash_p023', 'Patient', 3, TRUE, NOW()),
(34, 'patient_024', 'hash_p024', 'Patient', 4, TRUE, NOW()),
(35, 'patient_025', 'hash_p025', 'Patient', 5, TRUE, NOW()),
(36, 'patient_026', 'hash_p026', 'Patient', 5, TRUE, NOW()),
(37, 'patient_027', 'hash_p027', 'Patient', 6, TRUE, NOW()),
(38, 'patient_028', 'hash_p028', 'Patient', 6, TRUE, NOW()),
(39, 'patient_029', 'hash_p029', 'Patient', 7, TRUE, NOW()),
(40, 'patient_030', 'hash_p030', 'Patient', 7, TRUE, NOW()),
(41, 'patient_031', 'hash_p031', 'Patient', 8, TRUE, NOW()),
(42, 'patient_032', 'hash_p032', 'Patient', 8, TRUE, NOW()),
(43, 'patient_033', 'hash_p033', 'Patient', 1, TRUE, NOW()),
(44, 'patient_034', 'hash_p034', 'Patient', 2, TRUE, NOW()),
(45, 'patient_035', 'hash_p035', 'Patient', 3, TRUE, NOW()),
(46, 'patient_036', 'hash_p036', 'Patient', 4, TRUE, NOW()),
(47, 'patient_037', 'hash_p037', 'Patient', 5, TRUE, NOW()),
(48, 'patient_038', 'hash_p038', 'Patient', 6, TRUE, NOW()),
(49, 'patient_039', 'hash_p039', 'Patient', 7, TRUE, NOW()),
(50, 'patient_040', 'hash_p040', 'Patient', 8, TRUE, NOW()),
(51, 'admin_chaminda', 'hash_admin2', 'Admin_Staff', 2, TRUE, NOW()),
(52, 'nurse_sunethra', 'hash_nurse2', 'Nurse', 2, TRUE, NOW()),
(53, 'recept_rohan', 'hash_recept2', 'Receptionist', 2, TRUE, NOW()),
(54, 'bill_mala', 'hash_bill2', 'Billing_Staff', 2, TRUE, NOW()),
(55, 'agent_kasun', 'hash_agent2', 'Insurance_Agent', 3, TRUE, NOW()),
(56, 'agent02', 'hash_agent2', 'Insurance_Agent', 2, TRUE, NOW());

-- STAFF (staff_id references user.user_id)
INSERT INTO `staff` (staff_id, name, type, monthly_salary, gender) VALUES
(5, 'Dinuka Jayawardena', 'Admin_Staff', 92000.00, 'Male'),
(6, 'Nishani Perera', 'Nurse', 65000.00, 'Female'),
(7, 'Saman Fernando', 'Receptionist', 45000.00, 'Male'),
(8, 'Kumar Silva', 'Billing_Staff', 48000.00, 'Male'),
(9, 'Asha Rajapaksa', 'Insurance_Agent', 50000.00, 'Female'),
(51, 'Chaminda Lakmal', 'Admin_Staff', 70000.00, 'Male'),
(52, 'Sunethra Jayasuriya', 'Nurse', 62000.00, 'Female'),
(53, 'Rohan Perera', 'Receptionist', 42000.00, 'Male'),
(54, 'Mala Wijesinghe', 'Billing_Staff', 47000.00, 'Female'),
(55, 'Kasun Kumara', 'Insurance_Agent', 53000.00, 'Male'),
(56, 'Niroshan Perera', 'Insurance_Agent', 52000.00, 'Male');

INSERT INTO `patient` (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type, is_ex_patient) VALUES
(11, 'Nimal Perera', 'Male', '0711234567', '199005120123', 'No. 12, Kandy Rd, Kandy', '1990-05-12', 'A+', FALSE),
(12, 'Samantha Silva', 'Female', '0712345678', '198811030456', 'No. 5, Galle St, Kandy', '1988-11-03', 'B+', FALSE),
(13, 'Kamal Fernando', 'Male', '0723456789', '199507210789', 'No. 22, Main Rd, Galle', '1995-07-21', 'O+', FALSE),
(14, 'Priya Rajapaksa', 'Female', '0724567890', '199202150234', 'No. 7, Beach Rd, Galle', '1992-02-15', 'AB-', FALSE),
(15, 'Ajith Kumara', 'Male', '0735678901', '198512100567', 'No. 11, Lake Rd, Matara', '1985-12-10', 'A-', FALSE),
(16, 'Nadeesha Wickramasinghe', 'Female', '0736789012', '199109300890', 'No. 9, Hill St, Matara', '1991-09-30', 'O-', FALSE),
(17, 'Ruwan Jayasuriya', 'Male', '0747890123', '198704050123', 'No. 14, Jaffna Rd, Jaffna', '1987-04-05', 'B-', FALSE),
(18, 'Amali Perera', 'Female', '0748901234', '199308190456', 'No. 18, Market St, Jaffna', '1993-08-19', 'AB+', FALSE),
(19, 'Sunil Silva', 'Male', '0759012345', '198901250789', 'No. 3, Colombo Rd, Negombo', '1989-01-25', 'A+', FALSE),
(20, 'Shanika Fernando', 'Female', '0750123456', '199403120234', 'No. 21, River St, Negombo', '1994-03-12', 'B+', FALSE),
(21, 'Ranjith Perera', 'Male', '0761234567', '198607140567', 'No. 17, Main St, Kurunegala', '1986-07-14', 'O+', FALSE),
(22, 'Chandani Jayawardena', 'Female', '0762345678', '199011230890', 'No. 12, Lake St, Kurunegala', '1990-11-23', 'AB-', FALSE),
(23, 'Pradeep Kumara', 'Male', '0773456789', '198806080123', 'No. 4, Beach Rd, Anuradhapura', '1988-06-08', 'A-', FALSE),
(24, 'Nirmala Silva', 'Female', '0774567890', '199209180456', 'No. 6, Temple Rd, Anuradhapura', '1992-09-18', 'O-', FALSE),
(25, 'Keshan Fernando', 'Male', '0785678901', '199112050789', 'No. 13, Garden Rd, Trincomalee', '1991-12-05', 'B+', FALSE),
(26, 'Tharushi Perera', 'Female', '0786789012', '199305200234', 'No. 9, River Rd, Trincomalee', '1993-05-20', 'AB+', FALSE),
(27, 'Chaminda Rajapaksa', 'Male', '0797890123', '198910020567', 'No. 15, Lake Rd, Kandy', '1989-10-02', 'A+', FALSE),
(28, 'Dilani Fernando', 'Female', '0798901234', '199501110890', 'No. 7, Hill Rd, Galle', '1995-01-11', 'O+', FALSE),
(29, 'Roshan Kumara', 'Male', '0719012345', '198708160123', 'No. 2, Beach Rd, Matara', '1987-08-16', 'B-', FALSE),
(30, 'Gayani Silva', 'Female', '0710123456', '199412120456', 'No. 8, Market St, Jaffna', '1994-12-24', 'AB-', FALSE),
(31, 'Prasad Perera', 'Male', '0721234567', '199006190789', 'No. 11, Main Rd, Kandy', '1990-06-19', 'O+', FALSE),
(32, 'Nadeesha Kumara', 'Female', '0722345678', '199209300234', 'No. 6, Lake St, Galle', '1992-09-30', 'A+', FALSE),
(33, 'Mahesh Fernando', 'Male', '0733456789', '198804250567', 'No. 3, Beach Rd, Matara', '1988-04-25', 'B+', FALSE),
(34, 'Asangi Perera', 'Female', '0734567890', '199311170890', 'No. 12, Hill St, Jaffna', '1993-11-17', 'AB+', FALSE),
(35, 'Ravindu Silva', 'Male', '0745678901', '199102020123', 'No. 19, Lake Rd, Negombo', '1991-02-02', 'O-', FALSE),
(36, 'Praveena Fernando', 'Female', '0746789012', '199007220456', 'No. 7, River Rd, Negombo', '1990-07-22', 'A-', FALSE),
(37, 'Saman Kumara', 'Male', '0757890123', '198612080789', 'No. 14, Main St, Kurunegala', '1986-12-08', 'B+', FALSE),
(38, 'Himali Perera', 'Female', '0758901234', '199203300234', 'No. 18, Lake St, Kurunegala', '1992-03-30', 'O+', FALSE),
(39, 'Roshan Perera', 'Male', '0769012345', '198905050567', 'No. 5, Beach Rd, Anuradhapura', '1989-05-05', 'AB-', FALSE),
(40, 'Sanduni Silva', 'Female', '0760123456', '199308120890', 'No. 9, Temple St, Anuradhapura', '1993-08-12', 'A+', FALSE),
(41, 'Kamal Perera', 'Male', '0771234567', '199009190123', 'No. 11, Garden Rd, Trincomalee', '1990-09-19', 'B-', FALSE),
(42, 'Nimali Kumari', 'Female', '0772345678', '199201230456', 'No. 7, River Rd, Trincomalee', '1992-01-23', 'AB+', FALSE),
(43, 'Ruwan Jayasena', 'Male', '0783456789', '198806050789', 'No. 12, Kandy Rd, Kandy', '1988-06-05', 'O+', FALSE),
(44, 'Dilani Kumari', 'Female', '0784567890', '199402140234', 'No. 5, Galle St, Galle', '1994-02-14', 'A+', FALSE),
(45, 'Kasun Perera', 'Male', '0795678901', '199107300567', 'No. 22, Main Rd, Matara', '1991-07-30', 'B+', FALSE),
(46, 'Thilini Silva', 'Female', '0796789012', '199309100890', 'No. 9, Hill Rd, Jaffna', '1993-09-10', 'O-', FALSE),
(47, 'Nimal Kumara', 'Male', '0717890123', '198912210123', 'No. 14, Beach Rd, Negombo', '1989-12-21', 'AB-', FALSE),
(48, 'Sanduni Perera', 'Female', '0718901234', '199203050456', 'No. 18, River Rd, Negombo', '1992-03-05', 'A+', FALSE),
(49, 'Rohan Kumara', 'Male', '0729012345', '199010100789', 'No. 3, Main St, Kurunegala', '1990-10-10', 'B+', FALSE),
(50, 'Himali Silva', 'Female', '0720123456', '199406230234', 'No. 6, Lake St, Kurunegala', '1994-06-23', 'O+', FALSE);


-- BRANCH MANAGERS (manager_id references user.user_id)
INSERT INTO `branch_manager` (manager_id, name, monthly_salary, gender) VALUES
(2, 'Kanishka Weerasinghe', 150000.00, 'Male'),
(3, 'Malathi Perera', 152000.00, 'Female'),
(4, 'Gayan Fernando', 148000.00, 'Male'),
(16, 'Chathura Silva', 155000.00, 'Male'),
(17, 'Anoma Jayasinghe', 160000.00, 'Female');


-- USER_CONTACT (references user)
INSERT INTO `user_contact` (contact, contact_type, is_default, user_id) VALUES
('superadmin@medsync.lk','Email',TRUE,1),
('0112567890','Phone_No',TRUE,1),
('bm.kandy@medsync.lk','Email',TRUE,2),
('bm.galle@medsync.lk','Email',TRUE,3),
('admin.dinuka@medsync.lk','Email',TRUE,5),
('0777001001','Phone_No',TRUE,11),
('0777001002','Phone_No',TRUE,12),
('patient001@example.com','Email',TRUE,11),
('patient002@example.com','Email',TRUE,12),
('nurse_amma@medsync.lk','Email',TRUE,6);


-- SPECIALITY
INSERT INTO `speciality` (speciality_id, speciality_name, description) VALUES
(1, 'Cardiology', 'Heart and blood vessel treatments'),
(2, 'Neurology', 'Brain and nervous system care'),
(3, 'Dermatology', 'Skin related treatments'),
(4, 'Pediatrics', 'Child healthcare'),
(5, 'Orthopedics', 'Bone and muscle treatments'),
(6, 'Ophthalmology', 'Eye care and vision'),
(7, 'Gastroenterology', 'Digestive system disorders'),
(8, 'Psychiatry', 'Mental health conditions'),
(9, 'ENT', 'Ear Nose Throat'),
(10, 'General Medicine', 'General adult medicine');


-- DOCTORS (doctor table is independent of user)
INSERT INTO `doctor` (doctor_id, name, fee_per_patient, basic_monthly_salary, gender) VALUES
(1, 'Dr. Perera', 2500.00, 175000.00, 'Male'),
(2, 'Dr. Silva', 3000.00, 180000.00, 'Male'),
(3, 'Dr. Fernando', 2200.00, 160000.00, 'Female'),
(4, 'Dr. Wijesinghe', 2700.00, 170000.00, 'Female'),
(5, 'Dr. Jayasinghe', 2600.00, 165000.00, 'Male'),
(6, 'Dr. Sarah Connor', 1300.00, 58000.00, 'Female'),
(7, 'Dr. James Wilson', 950.00, 47000.00, 'Male'),
(8, 'Dr. Amanda Chen', 1150.00, 53000.00, 'Female'),
(9, 'Dr. John Doe', 1000.00, 50000.00, 'Male'),
(10, 'Dr. Jane Smith', 1200.00, 55000.00, 'Female'),
(11, 'Dr. Mike Johnson', 900.00, 48000.00, 'Male'),
(12, 'Dr. Emily Davis', 1100.00, 52000.00, 'Female'),
(13, 'Dr. K. Rodrigo', 2000.00, 120000.00, 'Male'),
(14, 'Dr. N. Perera', 1800.00, 115000.00, 'Female'),
(15, 'Dr. S. Jayasena', 1600.00, 110000.00, 'Male'),
(16, 'Dr. H. Silva', 1400.00, 90000.00, 'Female'),
(17, 'Dr. L. Fernando', 1700.00, 105000.00, 'Male'),
(18, 'Dr. A. Kumara', 1500.00, 85000.00, 'Female'),
(19, 'Dr. B. Jayawardena', 1550.00, 88000.00, 'Male'),
(20, 'Dr. C. Dias', 1450.00, 82000.00, 'Female');


-- DOCTOR_SPECIALITY
INSERT INTO `doctor_speciality` (doctor_id, speciality_id, added_at) VALUES
(1, 1, NOW()),
(2, 2, NOW()),
(3, 3, NOW()),
(4, 4, NOW()),
(5, 5, NOW()),
(6, 1, NOW()),
(6, 5, NOW()),
(7, 5, NOW()),
(8, 2, NOW()),
(9, 1, NOW()),
(10, 2, NOW()),
(11, 5, NOW()),
(12, 4, NOW()),
(13, 10, NOW()),
(14, 7, NOW()),
(15, 9, NOW()),
(16, 3, NOW()),
(17, 6, NOW()),
(18, 8, NOW()),
(19, 10, NOW()),
(20, 1, NOW());


-- INSURANCE PLANS
INSERT INTO `insurance` (insurance_id, insurance_type, insurance_period, claim_percentage, created_at) VALUES
(1, 'Health Basic', '1 Year', 0.70, NOW()),
(2, 'Health Plus', '2 Years', 0.80, NOW()),
(3, 'Premium Care', '3 Years', 0.90, NOW()),
(4, 'Family Health', '1 Year', 0.75, NOW()),
(5, 'Senior Care', '2 Years', 0.85, NOW()),
(6, 'Dental Basic', '1 Year', 0.60, NOW()),
(7, 'Vision Care', '1 Year', 0.65, NOW());


-- TREATMENT CATALOGUE (service_code)
INSERT INTO `treatment_catelogue` (service_code, name, fee, description, speciality_id, created_at) VALUES
(1, 'ECG Scan', 1500.00, 'Electrocardiogram test', 1, NOW()),
(2, 'MRI Brain', 8000.00, 'Brain MRI scan', 2, NOW()),
(3, 'Skin Therapy', 3000.00, 'Acne/scar treatment', 3, NOW()),
(4, 'Child Checkup', 1200.00, 'Routine pediatric check', 4, NOW()),
(5, 'Fracture Treatment', 5000.00, 'Bone fracture repair', 5, NOW()),
(6, 'Eye Exam', 400.00, 'Routine eye exam', 6, NOW()),
(7, 'Endoscopy', 1000.00, 'GI endoscopy', 7, NOW()),
(8, 'Psych Consult', 800.00, 'Psychiatry consultation', 8, NOW()),
(9, 'ENT Check', 700.00, 'ENT examination', 9, NOW()),
(10, 'General Consult', 1000.00, 'General medicine consultation', 10, NOW()),
(11, 'Blood Test', 250.00, 'CBC and panels', 10, NOW()),
(12, 'CT Scan', 1200.00, 'CT imaging', 2, NOW()),
(13, 'Ultrasound', 800.00, 'Ultrasound scan', 5, NOW()),
(14, 'Skin Biopsy', 600.00, 'Tissue sample', 3, NOW()),
(15, 'Vaccination', 200.00, 'Routine vaccine', 4, NOW()),
(16, 'Stress Test', 1800.00, 'Cardiac stress test', 1, NOW()),
(17, 'Bone Density', 900.00, 'DEXA scan', 5, NOW()),
(18, 'Allergy Test', 350.00, 'Allergy panel', 3, NOW()),
(19, 'Counselling', 700.00, 'Therapy session', 8, NOW()),
(20, 'Diabetes Panel', 900.00, 'Diabetes bloodwork', 10, NOW());


-- PATIENT_INSURANCE (patient_id references user.user_id)
INSERT INTO `patient_insurance` (patient_id, insurance_id, created_at, is_expired) VALUES
(11, 1, NOW() - INTERVAL 120 DAY, FALSE),
(12, 2, NOW() - INTERVAL 90 DAY, FALSE),
(13, 3, NOW() - INTERVAL 400 DAY, TRUE),
(14, 2, NOW() - INTERVAL 30 DAY, FALSE),
(15, 4, NOW() - INTERVAL 10 DAY, FALSE),
(16, 5, NOW() - INTERVAL 200 DAY, FALSE),
(17, 6, NOW() - INTERVAL 50 DAY, FALSE),
(18, 7, NOW() - INTERVAL 20 DAY, FALSE),
(19, 1, NOW() - INTERVAL 60 DAY, FALSE),
(20, 2, NOW() - INTERVAL 5 DAY, FALSE),
(21, 3, NOW() - INTERVAL 15 DAY, FALSE),
(22, 4, NOW() - INTERVAL 180 DAY, FALSE),
(23, 5, NOW() - INTERVAL 240 DAY, FALSE),
(24, 6, NOW() - INTERVAL 10 DAY, FALSE),
(25, 1, NOW() - INTERVAL 300 DAY, TRUE),
(26, 2, NOW() - INTERVAL 25 DAY, FALSE),
(27, 3, NOW() - INTERVAL 12 DAY, FALSE),
(28, 4, NOW() - INTERVAL 80 DAY, FALSE),
(29, 5, NOW() - INTERVAL 33 DAY, FALSE),
(30, 6, NOW() - INTERVAL 7 DAY, FALSE);


-- APPOINTMENTS (many, dates relative to CURDATE())
INSERT INTO `appointment` (appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp) VALUES
(1, 11, 1, 'Chest pain and palpitations', CURDATE() - INTERVAL 60 DAY, '09:00-09:30', 'Completed', NOW() - INTERVAL 60 DAY),
(2, 12, 2, 'Frequent headaches', CURDATE() - INTERVAL 55 DAY, '10:00-10:30', 'Completed', NOW() - INTERVAL 55 DAY),
(3, 13, 3, 'Skin rash', CURDATE() - INTERVAL 50 DAY, '11:00-11:30', 'Completed', NOW() - INTERVAL 50 DAY),
(4, 14, 4, 'Child vaccination', CURDATE() - INTERVAL 45 DAY, '12:00-12:30', 'Completed', NOW() - INTERVAL 45 DAY),
(5, 15, 5, 'Fracture pain', CURDATE() - INTERVAL 40 DAY, '13:00-13:30', 'Completed', NOW() - INTERVAL 40 DAY),
(6, 16, 6, 'Routine cardiology follow up', CURDATE() - INTERVAL 30 DAY, '09:00-09:30', 'Completed', NOW() - INTERVAL 30 DAY),
(7, 17, 7, 'Knee pain', CURDATE() - INTERVAL 25 DAY, '11:00-11:30', 'Completed', NOW() - INTERVAL 25 DAY),
(8, 18, 8, 'Anxiety session', CURDATE() - INTERVAL 20 DAY, '10:00-10:30', 'Completed', NOW() - INTERVAL 20 DAY),
(9, 19, 9, 'Ear pain', CURDATE() - INTERVAL 15 DAY, '14:00-14:30', 'Completed', NOW() - INTERVAL 15 DAY),
(10, 20, 10, 'General checkup', CURDATE() - INTERVAL 10 DAY, '15:00-15:30', 'Completed', NOW() - INTERVAL 10 DAY),

(11, 21, 11, 'Skin follow up', CURDATE() - INTERVAL 8 DAY, '09:00-09:30', 'Completed', NOW() - INTERVAL 8 DAY),
(12, 22, 12, 'Pediatric development check', CURDATE() - INTERVAL 6 DAY, '10:00-10:30', 'Completed', NOW() - INTERVAL 6 DAY),
(13, 23, 13, 'General fever', CURDATE() - INTERVAL 4 DAY, '11:00-11:30', 'Completed', NOW() - INTERVAL 4 DAY),
(14, 24, 14, 'Stomach pain', CURDATE() - INTERVAL 2 DAY, '12:00-12:30', 'Completed', NOW() - INTERVAL 2 DAY),
(15, 25, 15, 'Eye irritation', CURDATE() - INTERVAL 1 DAY, '13:00-13:30', 'Completed', NOW() - INTERVAL 1 DAY),

(16, 26, 16, 'Psych follow-up', CURDATE(), '09:00-09:30', 'Completed', NOW()),
(17, 27, 17, 'Blood pressure check', CURDATE() + INTERVAL 1 DAY, '10:00-10:30', 'Booked', NOW()),
(18, 28, 18, 'Allergy consultation', CURDATE() + INTERVAL 2 DAY, '11:00-11:30', 'Booked', NOW()),
(19, 29, 19, 'Physiotherapy referral', CURDATE() + INTERVAL 3 DAY, '12:00-12:30', 'Booked', NOW()),
(20, 30, 20, 'Diabetes review', CURDATE() + INTERVAL 5 DAY, '14:00-14:30', 'Booked', NOW()),

(21, 31, 1, 'Follow-up ECG', CURDATE() + INTERVAL 7 DAY, '09:00-09:30', 'Booked', NOW()),
(22, 32, 2, 'Migraine review', CURDATE() + INTERVAL 8 DAY, '10:00-10:30', 'Booked', NOW()),
(23, 33, 3, 'Dermatology consult', CURDATE() + INTERVAL 9 DAY, '11:00-11:30', 'Booked', NOW()),
(24, 34, 4, 'Child immunization', CURDATE() + INTERVAL 10 DAY, '12:00-12:30', 'Booked', NOW()),
(25, 35, 5, 'Fracture x-ray', CURDATE() + INTERVAL 12 DAY, '13:00-13:30', 'Booked', NOW()),

(26, 36, 6, 'Cardio follow-up', CURDATE() + INTERVAL 14 DAY, '09:00-09:30', 'Booked', NOW()),
(27, 37, 7, 'Knee check', CURDATE() + INTERVAL 15 DAY, '11:00-11:30', 'Booked', NOW()),
(28, 38, 8, 'Psych intake', CURDATE() + INTERVAL 16 DAY, '10:00-10:30', 'Booked', NOW()),
(29, 39, 9, 'ENT check', CURDATE() + INTERVAL 18 DAY, '14:00-14:30', 'Booked', NOW()),
(30, 40, 10, 'General review', CURDATE() + INTERVAL 20 DAY, '15:00-15:30', 'Booked', NOW()),

(31, 41, 11, 'Skin treatment', CURDATE() + INTERVAL 22 DAY, '09:00-09:30', 'Booked', NOW()),
(32, 42, 12, 'Pediatric follow up', CURDATE() + INTERVAL 24 DAY, '10:00-10:30', 'Booked', NOW()),
(33, 43, 13, 'New patient consult', CURDATE() + INTERVAL 26 DAY, '11:00-11:30', 'Booked', NOW()),
(34, 44, 14, 'GI symptoms', CURDATE() + INTERVAL 28 DAY, '12:00-12:30', 'Booked', NOW()),
(35, 45, 15, 'Eye surgery consult', CURDATE() + INTERVAL 30 DAY, '13:00-13:30', 'Booked', NOW()),

(36, 46, 16, 'Therapy session', CURDATE() + INTERVAL 35 DAY, '09:00-09:30', 'Booked', NOW()),
(37, 47, 17, 'BP check', CURDATE() + INTERVAL 40 DAY, '10:00-10:30', 'Booked', NOW()),
(38, 48, 18, 'Allergy tests', CURDATE() + INTERVAL 45 DAY, '11:00-11:30', 'Booked', NOW()),
(39, 49, 19, 'Orthopedic review', CURDATE() + INTERVAL 50 DAY, '12:00-12:30', 'Booked', NOW()),
(40, 50, 20, 'Diabetes education', CURDATE() + INTERVAL 60 DAY, '14:00-14:30', 'Booked', NOW());


-- PRESCRIPTIONS (linked to appointments)
INSERT INTO `prescription` (appointment_id, consultation_note, prescription_items_details, prescribed_at, is_active) VALUES
(1, 'Rest and monitor', 'Aspirin 75mg once daily', NOW() - INTERVAL 60 DAY, TRUE),
(2, 'Migraine control', 'Sumatriptan 50mg, as needed', NOW() - INTERVAL 55 DAY, TRUE),
(3, 'Topical cream', 'Hydrocortisone 1% cream', NOW() - INTERVAL 50 DAY, TRUE),
(4, 'Vaccine given', 'MMR vaccine', NOW() - INTERVAL 45 DAY, TRUE),
(5, 'Analgesics', 'Ibuprofen 400mg TDS', NOW() - INTERVAL 40 DAY, FALSE),
(6, 'BP meds', 'Lisinopril 10mg once daily', NOW() - INTERVAL 30 DAY, TRUE),
(7, 'NSAID', 'Naproxen 250mg', NOW() - INTERVAL 25 DAY, FALSE),
(8, 'SSRI', 'Sertraline 25mg', NOW() - INTERVAL 20 DAY, TRUE),
(9, 'Ear drops', 'Ofloxacin drops', NOW() - INTERVAL 15 DAY, TRUE),
(10, 'General vitamins', 'Multivitamin daily', NOW() - INTERVAL 10 DAY, TRUE),
(11, 'Derm follow up', 'Topical antibiotic', NOW() - INTERVAL 8 DAY, TRUE),
(12, 'Peds vitamins', 'Paediatric syrup', NOW() - INTERVAL 6 DAY, TRUE),
(13, 'Fever care', 'Paracetamol 500mg PRN', NOW() - INTERVAL 4 DAY, TRUE),
(14, 'GI support', 'Omeprazole 20mg', NOW() - INTERVAL 2 DAY, TRUE),
(15, 'Eye drops', 'Artificial tears', NOW() - INTERVAL 1 DAY, TRUE),
(16, 'Therapy meds', 'No meds - therapy only', NOW(), TRUE);


-- MEDICAL_HISTORY
INSERT INTO `medical_history` (medical_history_id, appointment_id, visit_date, diagnosis, symptoms, allergies, notes, follow_up_date, created_at, updated_at) VALUES
(1, 1, CURDATE() - INTERVAL 60 DAY, 'Stable angina', 'Chest discomfort', 'None', 'Advised exercise and meds', CURDATE() - INTERVAL 30 DAY, NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 60 DAY),
(2, 2, CURDATE() - INTERVAL 55 DAY, 'Migraine', 'Headache, photophobia', 'None', 'Trigger avoidance', CURDATE() - INTERVAL 25 DAY, NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 55 DAY),
(3, 3, CURDATE() - INTERVAL 50 DAY, 'Contact dermatitis', 'Rash', 'Peanuts', 'Stop exposure', CURDATE() - INTERVAL 20 DAY, NOW() - INTERVAL 50 DAY, NOW() - INTERVAL 50 DAY),
(4, 4, CURDATE() - INTERVAL 45 DAY, 'Vaccination given', 'N/A', 'None', 'Next vaccine due in 6 months', NULL, NOW() - INTERVAL 45 DAY, NOW() - INTERVAL 45 DAY),
(5, 5, CURDATE() - INTERVAL 40 DAY, 'Fracture healing', 'Pain, swelling', 'None', 'Physio advised', CURDATE() - INTERVAL 10 DAY, NOW() - INTERVAL 40 DAY, NOW() - INTERVAL 40 DAY),
(6, 6, CURDATE() - INTERVAL 30 DAY, 'Post-op follow up', 'Mild fatigue', 'None', 'Continue meds', CURDATE() + INTERVAL 20 DAY, NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY),
(7, 7, CURDATE() - INTERVAL 25 DAY, 'Meniscus strain', 'Knee pain', 'None', 'RICE recommended', CURDATE() - INTERVAL 5 DAY, NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 25 DAY),
(8, 8, CURDATE() - INTERVAL 20 DAY, 'Anxiety disorder', 'Worry, poor sleep', 'None', 'Referred for therapy', CURDATE() + INTERVAL 30 DAY, NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 20 DAY),
(9, 9, CURDATE() - INTERVAL 15 DAY, 'Otitis media', 'Ear pain, discharge', 'None', 'Antibiotic course', NULL, NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 15 DAY),
(10, 10, CURDATE() - INTERVAL 10 DAY, 'General check', 'Routine screening', 'None', 'Healthy', CURDATE() + INTERVAL 365 DAY, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY);


-- TREATMENTS (service_code references treatment_catelogue)
INSERT INTO `treatment` (service_code, appointment_id) VALUES
(1, 1),
(12, 2),
(14, 3),
(15, 4),
(5, 5),
(16, 6),
(17, 7),
(19, 8),
(9, 9),
(10, 10),
(11, 11),
(4, 12),
(20, 13),
(7, 14),
(6, 15),
(19, 16);


-- INSURANCE_CLAIM (approved_by references staff.staff_id)
INSERT INTO `insurance_claim` (claim_id, service_code, patient_id, approved_by, claimed_amount, claimed_at, insurance_id) VALUES
(1, 1, 11, 9, 1000.00, NOW() - INTERVAL 58 DAY, 1),  -- approved by Asha Rajapaksa
(2, 12, 12, 56, 6000.00, NOW() - INTERVAL 52 DAY, 2), -- approved by Kasun Kumara
(3, 14, 13, 56, 240.00, NOW() - INTERVAL 48 DAY, 3), -- approved by Niroshan Perera (new agent)
(4, 15, 14, 9, 90.00, NOW() - INTERVAL 44 DAY, 4),   -- approved by Asha Rajapaksa
(5, 5, 15, 56, 4000.00, NOW() - INTERVAL 38 DAY, 5), -- approved by Kasun Kumara
(6, 11, 21, 9, 200.00, NOW() - INTERVAL 6 DAY, 1),   -- approved by Asha Rajapaksa
(7, 19, 26, 56, 640.00, NOW() - INTERVAL 1 DAY, 3);  -- approved by Niroshan Perera (new agent)


-- BILLING_INVOICE (appointment_id is PK and FK to appointment)
INSERT INTO `billing_invoice` (appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount, time_stamp) VALUES
(1, 200.00, 2700.00, 1, 1700.00, 1000.00, NOW() - INTERVAL 58 DAY),
(2, 100.00, 6100.00, 2, 3500.00, 2600.00, NOW() - INTERVAL 52 DAY),
(3, 50.00, 290.00, 3, 240.00, 50.00, NOW() - INTERVAL 48 DAY),
(4, 0.00, 90.00, 4, 90.00, 0.00, NOW() - INTERVAL 44 DAY),
(5, 150.00, 4150.00, 5, 4000.00, 150.00, NOW() - INTERVAL 38 DAY),
(11, 0.00, 250.00, 6, 200.00, 50.00, NOW() - INTERVAL 6 DAY),
(16, 0.00, 700.00, 7, 640.00, 60.00, NOW() - INTERVAL 1 DAY);


-- BILLING_PAYMENT (cashier_id references staff.staff_id)
INSERT INTO `billing_payment` (invoice_id, branch_id, paid_amount, time_stamp, cashier_id) VALUES
( 1, 1, 1700.00, NOW() - INTERVAL 57 DAY, 8),
( 2, 2, 3500.00, NOW() - INTERVAL 51 DAY, 54),
( 3, 3, 240.00, NOW() - INTERVAL 47 DAY, 8),
( 4, 4, 90.00, NOW() - INTERVAL 43 DAY, 54),
( 5, 5, 4000.00, NOW() - INTERVAL 37 DAY, 54),
( 11, 1, 200.00, NOW() - INTERVAL 5 DAY, 8),
( 16, 2, 640.00, NOW() - INTERVAL 1 DAY, 54);


-- ACTION
INSERT INTO `action` (action_id, name) VALUES
(1, 'CREATE'),
(2, 'UPDATE'),
(3, 'DELETE'),
(4, 'LOGIN'),
(5, 'VIEW'),
(6, 'APPROVE'),
(7, 'CANCEL');


-- LOGS
-- user_role column is free-text; pick values matching roles in your user table where sensible
INSERT INTO `log` (log_id, user_id, user_role, action_id, table_name, record_id, time_stamp, details) VALUES
(1, 1, 'Super_Admin', 4, 'user', 1, NOW() - INTERVAL 200 DAY, 'Super admin logged in'),
(2, 2, 'Branch_Manager', 1, 'branch', 2, NOW() - INTERVAL 199 DAY, 'Created branch record'),
(3, 5, 'Admin_Staff', 1, 'user', 11, NOW() - INTERVAL 120 DAY, 'Created patient account'),
(4, 8, 'Billing_Staff', 6, 'insurance_claim', 1, NOW() - INTERVAL 58 DAY, 'Approved claim #1'),
(5, 14, 'Billing_Staff', 6, 'insurance_claim', 2, NOW() - INTERVAL 52 DAY, 'Approved claim #2'),
(6, 6, 'Nurse', 1, 'medical_history', 1, NOW() - INTERVAL 60 DAY, 'Recorded vitals'),
(7, 7, 'Receptionist', 1, 'appointment', 1, NOW() - INTERVAL 61 DAY, 'Created appointment'),
(8, 9, 'Insurance_Agent', 5, 'insurance', 1, NOW() - INTERVAL 190 DAY, 'Viewed insurance plan'),
(9, 11, 'Admin_Staff', 2, 'user', 12, NOW() - INTERVAL 80 DAY, 'Updated patient info'),
(10, 14, 'Billing_Staff', 1, 'billing_invoice', 1, NOW() - INTERVAL 57 DAY, 'Generated invoice #1'),
(11, 8, 'Billing_Staff', 1, 'billing_payment', 1, NOW() - INTERVAL 56 DAY, 'Recorded payment for invoice 1'),
(12, 16, 'Branch_Manager', 3, 'staff', 11, NOW() - INTERVAL 70 DAY, 'Removed staff record (archived)'),
(13, 6, 'Nurse', 2, 'medical_history', 2, NOW() - INTERVAL 55 DAY, 'Updated diagnosis'),
(14, 5, 'Admin_Staff', 1, 'doctor', 1, NOW() - INTERVAL 160 DAY, 'Added doctor record'),
(15, 1, 'Super_Admin', 5, 'system', 0, NOW() - INTERVAL 1 DAY, 'System backup performed');


-- ADDITIONAL BULK APPOINTMENTS/PRESCRIPTIONS/TREATMENTS
-- 10 more quick appointments across different patients and doctors
INSERT INTO `appointment` (appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status, time_stamp) VALUES
(41, 11, 2, 'Annual review', CURDATE() - INTERVAL 14 DAY, '09:00-09:30', 'Completed', NOW() - INTERVAL 14 DAY),
(42, 12, 3, 'Skin patch test', CURDATE() - INTERVAL 12 DAY, '10:00-10:30', 'Completed', NOW() - INTERVAL 12 DAY),
(43, 13, 4, 'Vaccination follow-up', CURDATE() - INTERVAL 10 DAY, '11:00-11:30', 'Completed', NOW() - INTERVAL 10 DAY),
(44, 14, 5, 'XRAY review', CURDATE() - INTERVAL 7 DAY, '12:00-12:30', 'Completed', NOW() - INTERVAL 7 DAY),
(45, 15, 6, 'Cardio check', CURDATE() - INTERVAL 3 DAY, '13:00-13:30', 'Completed', NOW() - INTERVAL 3 DAY),
(46, 16, 7, 'Orthopedic review', CURDATE() - INTERVAL 2 DAY, '14:00-14:30', 'Completed', NOW() - INTERVAL 2 DAY),
(47, 17, 8, 'Therapy session', CURDATE() - INTERVAL 1 DAY, '15:00-15:30', 'Completed', NOW() - INTERVAL 1 DAY),
(48, 18, 9, 'ENT follow up', CURDATE(), '09:00-09:30', 'Completed', NOW()),
(49, 19, 10, 'General consult', CURDATE() + INTERVAL 2 DAY, '10:00-10:30', 'Booked', NOW()),
(50, 20, 1, 'Pre-op assessment', CURDATE() + INTERVAL 4 DAY, '11:00-11:30', 'Booked', NOW());

INSERT INTO `prescription` (appointment_id, consultation_note, prescription_items_details, prescribed_at, is_active) VALUES
(41, 'Continue current meds', 'Statin 20mg', NOW() - INTERVAL 14 DAY, TRUE),
(42, 'Allergy Rx', 'Antihistamine once daily', NOW() - INTERVAL 12 DAY, TRUE),
(43, 'Vaccine booster', 'Booster dose administered', NOW() - INTERVAL 10 DAY, TRUE),
(44, 'Pain meds', 'Acetaminophen 500mg', NOW() - INTERVAL 7 DAY, FALSE),
(45, 'Cardio Rx', 'Beta-blocker 50mg', NOW() - INTERVAL 3 DAY, TRUE);

INSERT INTO `treatment` (service_code, appointment_id) VALUES
(2, 41),
(18, 42),
(15, 43),
(3, 44),
(16, 45);

-- MORE INSURANCE CLAIMS & INVOICES for additional appointments
INSERT INTO `insurance_claim` (claim_id, service_code, patient_id, approved_by, claimed_amount, claimed_at, insurance_id) VALUES
(8, 2, 11, 56, 5000.00, NOW() - INTERVAL 13 DAY, 2),
(9, 18, 12, 9, 350.00, NOW() - INTERVAL 11 DAY, 6);

INSERT INTO `billing_invoice` (appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount, time_stamp) VALUES
(41, 0.00, 5000.00, 8, 3500.00, 1500.00, NOW() - INTERVAL 13 DAY),
(42, 0.00, 400.00, 9, 300.00, 100.00, NOW() - INTERVAL 11 DAY);

INSERT INTO `billing_payment` (payment_id, invoice_id, branch_id, paid_amount, time_stamp, cashier_id) VALUES
(8, 41, 1, 3500.00, NOW() - INTERVAL 12 DAY, 54),
(9, 42, 1, 300.00, NOW() - INTERVAL 10 DAY, 8);


-- FINAL PATIENT_INSURANCE ADDS to boost dataset
INSERT INTO `patient_insurance` (patient_id, insurance_id, created_at, is_expired) VALUES
(31, 2, NOW() - INTERVAL 120 DAY, FALSE),
(32, 3, NOW() - INTERVAL 60 DAY, FALSE),
(33, 4, NOW() - INTERVAL 200 DAY, TRUE),
(34, 5, NOW() - INTERVAL 30 DAY, FALSE),
(35, 2, NOW() - INTERVAL 10 DAY, FALSE);
