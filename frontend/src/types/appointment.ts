// src/types/appointment.ts
export interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  patientEmail?: string;
  doctorSpecialty?: string;
  notes?: string;
  type?: string;
  priority?: string;
  insurance?: string;
}

export interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availableSlots: TimeSlot[];
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age?: number;
}