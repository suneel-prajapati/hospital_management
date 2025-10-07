import { Patient, Doctor, Appointment, Bill, Room } from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'hms_patients',
  DOCTORS: 'hms_doctors',
  APPOINTMENTS: 'hms_appointments',
  BILLS: 'hms_bills',
  ROOMS: 'hms_rooms',
};

export const initializeDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const samplePatients: Patient[] = [
      {
        id: crypto.randomUUID(),
        patient_id: 'PAT001',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        contact: '+1-555-0101',
        address: '123 Main St, Springfield',
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        patient_id: 'PAT002',
        name: 'Sarah Johnson',
        age: 32,
        gender: 'Female',
        contact: '+1-555-0102',
        address: '456 Oak Ave, Riverside',
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        patient_id: 'PAT003',
        name: 'Michael Brown',
        age: 58,
        gender: 'Male',
        contact: '+1-555-0103',
        address: '789 Pine Rd, Lakewood',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(samplePatients));
  }

  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    const sampleDoctors: Doctor[] = [
      {
        id: crypto.randomUUID(),
        doctor_id: 'DOC001',
        name: 'Dr. Emily Carter',
        specialization: 'Cardiology',
        availability: 'Mon-Fri 9AM-5PM',
        phone: '+1-555-1001',
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        doctor_id: 'DOC002',
        name: 'Dr. James Wilson',
        specialization: 'Orthopedics',
        availability: 'Mon-Fri 10AM-6PM',
        phone: '+1-555-1002',
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        doctor_id: 'DOC003',
        name: 'Dr. Lisa Martinez',
        specialization: 'Pediatrics',
        availability: 'Mon-Sat 8AM-4PM',
        phone: '+1-555-1003',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(sampleDoctors));
  }

  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    const patients = getPatients();
    const doctors = getDoctors();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);

    const sampleAppointments: Appointment[] = [
      {
        id: crypto.randomUUID(),
        appointment_id: 'APT001',
        patient_id: patients[0]?.id || '',
        doctor_id: doctors[0]?.id || '',
        appointment_date: tomorrow.toISOString().split('T')[0],
        appointment_time: '10:00',
        reason: 'Regular checkup',
        status: 'Pending',
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        appointment_id: 'APT002',
        patient_id: patients[1]?.id || '',
        doctor_id: doctors[2]?.id || '',
        appointment_date: nextWeek.toISOString().split('T')[0],
        appointment_time: '14:30',
        reason: 'Child vaccination',
        status: 'Pending',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
    const patients = getPatients();
    const sampleBills: Bill[] = [
      {
        id: crypto.randomUUID(),
        bill_id: 'BILL001',
        patient_id: patients[2]?.id || '',
        doctor_charges: 500,
        room_charges: 1200,
        medicine_charges: 350,
        total_amount: 2050,
        payment_status: 'Unpaid',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(sampleBills));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    const patients = getPatients();
    const sampleRooms: Room[] = [
      {
        id: crypto.randomUUID(),
        room_id: 'ROOM101',
        room_type: 'General',
        availability_status: 'Available',
        assigned_patient_id: null,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        room_id: 'ROOM102',
        room_type: 'General',
        availability_status: 'Available',
        assigned_patient_id: null,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        room_id: 'ROOM201',
        room_type: 'ICU',
        availability_status: 'Available',
        assigned_patient_id: null,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        room_id: 'ROOM301',
        room_type: 'Private',
        availability_status: 'Occupied',
        assigned_patient_id: patients[2]?.id || null,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        room_id: 'ROOM302',
        room_type: 'Private',
        availability_status: 'Available',
        assigned_patient_id: null,
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(sampleRooms));
  }
};

export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return data ? JSON.parse(data) : [];
};

export const getDoctors = (): Doctor[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
  return data ? JSON.parse(data) : [];
};

export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : [];
};

export const getBills = (): Bill[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BILLS);
  return data ? JSON.parse(data) : [];
};

export const getRooms = (): Room[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
  return data ? JSON.parse(data) : [];
};

export const savePatient = (patient: Patient) => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === patient.id);
  if (index >= 0) {
    patients[index] = patient;
  } else {
    patients.push(patient);
  }
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const deletePatient = (id: string) => {
  const patients = getPatients().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const saveDoctor = (doctor: Doctor) => {
  const doctors = getDoctors();
  const index = doctors.findIndex((d) => d.id === doctor.id);
  if (index >= 0) {
    doctors[index] = doctor;
  } else {
    doctors.push(doctor);
  }
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
};

export const deleteDoctor = (id: string) => {
  const doctors = getDoctors().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
};

export const saveAppointment = (appointment: Appointment) => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === appointment.id);
  if (index >= 0) {
    appointments[index] = appointment;
  } else {
    appointments.push(appointment);
  }
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const deleteAppointment = (id: string) => {
  const appointments = getAppointments().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const saveBill = (bill: Bill) => {
  const bills = getBills();
  const index = bills.findIndex((b) => b.id === bill.id);
  if (index >= 0) {
    bills[index] = bill;
  } else {
    bills.push(bill);
  }
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
};

export const deleteBill = (id: string) => {
  const bills = getBills().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
};

export const saveRoom = (room: Room) => {
  const rooms = getRooms();
  const index = rooms.findIndex((r) => r.id === room.id);
  if (index >= 0) {
    rooms[index] = room;
  } else {
    rooms.push(room);
  }
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
};

export const deleteRoom = (id: string) => {
  const rooms = getRooms().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
};

export const generateNextId = (prefix: string, existingIds: string[]): string => {
  const numbers = existingIds
    .map((id) => parseInt(id.replace(prefix, ''), 10))
    .filter((num) => !isNaN(num));
  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
};
