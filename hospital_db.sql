-- ============================================
-- Hospital Management System Database Schema
-- ============================================
-- This SQL file contains the complete database structure
-- for the Hospital Management System
-- ============================================

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS patients;

-- ============================================
-- Table: patients
-- Stores patient information and demographics
-- ============================================
CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 150),
    gender VARCHAR(20) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: doctors
-- Stores doctor information and availability
-- ============================================
CREATE TABLE doctors (
    id VARCHAR(36) PRIMARY KEY,
    doctor_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    availability VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: appointments
-- Manages patient-doctor appointments
-- ============================================
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    appointment_id VARCHAR(10) UNIQUE NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    doctor_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- ============================================
-- Table: bills
-- Manages billing and payment information
-- ============================================
CREATE TABLE bills (
    id VARCHAR(36) PRIMARY KEY,
    bill_id VARCHAR(10) UNIQUE NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    doctor_charges DECIMAL(10,2) DEFAULT 0.00 CHECK (doctor_charges >= 0),
    room_charges DECIMAL(10,2) DEFAULT 0.00 CHECK (room_charges >= 0),
    medicine_charges DECIMAL(10,2) DEFAULT 0.00 CHECK (medicine_charges >= 0),
    total_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (total_amount >= 0),
    payment_status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- ============================================
-- Table: rooms
-- Manages hospital rooms and bed assignments
-- ============================================
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(10) UNIQUE NOT NULL,
    room_type ENUM('General', 'ICU', 'Private') NOT NULL,
    availability_status ENUM('Available', 'Occupied') DEFAULT 'Available',
    assigned_patient_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

-- ============================================
-- Indexes for Better Query Performance
-- ============================================

-- Patients table indexes
CREATE INDEX idx_patient_name ON patients(name);
CREATE INDEX idx_patient_contact ON patients(contact);

-- Doctors table indexes
CREATE INDEX idx_doctor_name ON doctors(name);
CREATE INDEX idx_doctor_specialization ON doctors(specialization);

-- Appointments table indexes
CREATE INDEX idx_appointment_patient ON appointments(patient_id);
CREATE INDEX idx_appointment_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointment_status ON appointments(status);

-- Bills table indexes
CREATE INDEX idx_bill_patient ON bills(patient_id);
CREATE INDEX idx_bill_payment_status ON bills(payment_status);

-- Rooms table indexes
CREATE INDEX idx_room_type ON rooms(room_type);
CREATE INDEX idx_room_availability ON rooms(availability_status);
CREATE INDEX idx_room_assigned_patient ON rooms(assigned_patient_id);

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Insert sample patients
INSERT INTO patients (id, patient_id, name, age, gender, contact, address, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'PAT001', 'John Smith', 45, 'Male', '+1-555-0101', '123 Main St, Springfield', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'PAT002', 'Sarah Johnson', 32, 'Female', '+1-555-0102', '456 Oak Ave, Riverside', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'PAT003', 'Michael Brown', 58, 'Male', '+1-555-0103', '789 Pine Rd, Lakewood', NOW());

-- Insert sample doctors
INSERT INTO doctors (id, doctor_id, name, specialization, availability, phone, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'DOC001', 'Dr. Emily Carter', 'Cardiology', 'Mon-Fri 9AM-5PM', '+1-555-1001', NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'DOC002', 'Dr. James Wilson', 'Orthopedics', 'Mon-Fri 10AM-6PM', '+1-555-1002', NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'DOC003', 'Dr. Lisa Martinez', 'Pediatrics', 'Mon-Sat 8AM-4PM', '+1-555-1003', NOW());

-- Insert sample appointments
INSERT INTO appointments (id, appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason, status, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'APT001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', 'Regular checkup', 'Pending', NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'APT002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:30:00', 'Child vaccination', 'Pending', NOW());

-- Insert sample bill
INSERT INTO bills (id, bill_id, patient_id, doctor_charges, room_charges, medicine_charges, total_amount, payment_status, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'BILL001', '550e8400-e29b-41d4-a716-446655440003', 500.00, 1200.00, 350.00, 2050.00, 'Unpaid', NOW());

-- Insert sample rooms
INSERT INTO rooms (id, room_id, room_type, availability_status, assigned_patient_id, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'ROOM101', 'General', 'Available', NULL, NOW()),
('990e8400-e29b-41d4-a716-446655440002', 'ROOM102', 'General', 'Available', NULL, NOW()),
('990e8400-e29b-41d4-a716-446655440003', 'ROOM201', 'ICU', 'Available', NULL, NOW()),
('990e8400-e29b-41d4-a716-446655440004', 'ROOM301', 'Private', 'Occupied', '550e8400-e29b-41d4-a716-446655440003', NOW()),
('990e8400-e29b-41d4-a716-446655440005', 'ROOM302', 'Private', 'Available', NULL, NOW());

-- ============================================
-- Useful Queries for Common Operations
-- ============================================

-- Get all pending appointments with patient and doctor names
-- SELECT
--     a.appointment_id,
--     p.name AS patient_name,
--     d.name AS doctor_name,
--     a.appointment_date,
--     a.appointment_time,
--     a.reason
-- FROM appointments a
-- JOIN patients p ON a.patient_id = p.id
-- JOIN doctors d ON a.doctor_id = d.id
-- WHERE a.status = 'Pending'
-- ORDER BY a.appointment_date, a.appointment_time;

-- Get total revenue and unpaid bills
-- SELECT
--     COUNT(*) AS total_bills,
--     SUM(total_amount) AS total_revenue,
--     SUM(CASE WHEN payment_status = 'Paid' THEN total_amount ELSE 0 END) AS paid_revenue,
--     SUM(CASE WHEN payment_status = 'Unpaid' THEN total_amount ELSE 0 END) AS unpaid_revenue
-- FROM bills;

-- Get room occupancy statistics
-- SELECT
--     room_type,
--     COUNT(*) AS total_rooms,
--     SUM(CASE WHEN availability_status = 'Available' THEN 1 ELSE 0 END) AS available_rooms,
--     SUM(CASE WHEN availability_status = 'Occupied' THEN 1 ELSE 0 END) AS occupied_rooms
-- FROM rooms
-- GROUP BY room_type;

-- Get patient's complete billing history
-- SELECT
--     p.name AS patient_name,
--     p.patient_id,
--     b.bill_id,
--     b.total_amount,
--     b.payment_status,
--     b.created_at
-- FROM bills b
-- JOIN patients p ON b.patient_id = p.id
-- WHERE p.patient_id = 'PAT001'
-- ORDER BY b.created_at DESC;

-- Get doctor's appointment schedule
-- SELECT
--     d.name AS doctor_name,
--     p.name AS patient_name,
--     a.appointment_date,
--     a.appointment_time,
--     a.reason,
--     a.status
-- FROM appointments a
-- JOIN doctors d ON a.doctor_id = d.id
-- JOIN patients p ON a.patient_id = p.id
-- WHERE d.doctor_id = 'DOC001'
-- ORDER BY a.appointment_date, a.appointment_time;

-- ============================================
-- Database Schema Documentation Complete
-- ============================================
