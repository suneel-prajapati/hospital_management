export interface Patient {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  doctor_id: string;
  name: string;
  specialization: string;
  availability: string;
  phone: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface Bill {
  id: string;
  bill_id: string;
  patient_id: string;
  doctor_charges: number;
  room_charges: number;
  medicine_charges: number;
  total_amount: number;
  payment_status: 'Paid' | 'Unpaid';
  created_at: string;
}

export interface Room {
  id: string;
  room_id: string;
  room_type: 'General' | 'ICU' | 'Private';
  availability_status: 'Available' | 'Occupied';
  assigned_patient_id: string | null;
  created_at: string;
}
