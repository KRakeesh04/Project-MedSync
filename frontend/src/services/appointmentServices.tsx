import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  patient_note: string;
  date: string;
  time_slot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  time_stamp: string;
  patient_name?: string;
  doctor_name?: string;
}

export interface AvailableSlot {
  date: string;
  time_slot: string;
  doctor_id: number;
  doctor_name: string;
  specialty: string;
}

export interface Doctor {
  doctor_id: number;
  name: string;
  qualifications: string;
  specialties: string;
}

export interface Patient {
  patient_id: number;
  name: string;
  gender: string;
  emergency_contact_no: string;
  nic: string;
  address: string;
  date_of_birth: string;
  blood_type: string;
}

export interface CreateAppointmentData {
  patient_name: string;
  patient_contact: string;
  patient_age: number;
  doctor_id: number;
  date: string;
  time_slot: string;
  patient_note?: string;
}

export const updateAppointment = async (id: number, appointmentData: any): Promise<string> => {
  try {
    const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error updating appointment:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAllAppointments = async (
  itemsPerPage?: number,
  p0?: number,
  searchText?: string,
  p1?: string
): Promise<Appointment[]> => {
  try {
    const response = await axiosInstance.get<Appointment[]>(`/appointments`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all appointments data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const createAppointment = async (appointmentData: CreateAppointmentData): Promise<string> => {
  try {
    const response = await axiosInstance.post(`/appointments`, appointmentData);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error creating new appointment:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const deleteAppointment = async (id: number): Promise<string> => {
  try {
    const response = await axiosInstance.delete(`/appointments/${id}`);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error deleting appointment:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const updateAppointmentStatus = async (id: number, status: string): Promise<string> => {
  try {
    const response = await axiosInstance.patch(`/appointments/${id}/status`, { status });
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error updating appointment status:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAllDoctorsForAppointments = async (): Promise<Doctor[]> => {
  try {
    const response = await axiosInstance.get<Doctor[]>(`/appointment/doctors`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all doctors for appointments:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAvailableSlots = async (doctorId: number, date: string): Promise<AvailableSlot[]> => {
  try {
    const response = await axiosInstance.get<AvailableSlot[]>(`/available-slots`, {
      params: { doctor_id: doctorId, date }
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting available slots:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};