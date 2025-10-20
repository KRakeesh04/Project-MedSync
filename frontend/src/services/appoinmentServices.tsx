import axiosInstance from "../axiosConfig";
import { AxiosError } from "axios";



export interface appointment{
    appointment_id:number;
    patient_id:number;
    doctor_id:number;
    patient_note:string;
    date:string;
    time_slot:string;
    status:string;
    name?:string; // doctor's name
}

export interface DoctorAppointment {
  appointment_id: number;
  doctor_id: number;
  name: string;           // doctor name
  date: string;
  time_slot: string;
  status: string;
}

export interface DoctorAppointmentByDoctorId {
    appointment_id: number;
    name: string;
    patient_note: string;
    date: string;
    time_slot: string;
    status: string;
}

export interface getAppointmentsByDoctorIdCountResponse {
    total_appointments: number;
}

export const getAppointmentsByPatientId = async (patientId: number): Promise<appointment[]> => {
  const resp = await axiosInstance.get(`/patient/appointments/${patientId}`);
  const data = resp.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.appointments)) return data.appointments;
  return [];
};



export const getDoctorsAppointments = async (
  count: number,
  offset: number
) => {
  try {
    const response = await axiosInstance.get<{
      appointments_count: number;
      appointments: DoctorAppointment[];
    }>(`/doctors/appointments?count=${count}&offset=${offset}`);

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

export const getAppointmentsByDoctorId = async (doctorId: number): Promise<DoctorAppointmentByDoctorId[]> => {
  try {
    const response = await axiosInstance.get<DoctorAppointmentByDoctorId[] | { appointments: DoctorAppointmentByDoctorId[] }>(`/doctors/appointments/${doctorId}`);
    const data = response.data;    if (Array.isArray(data)) return data;
    if (Array.isArray((data as { appointments?: DoctorAppointmentByDoctorId[] })?.appointments)) {
      return (data as { appointments?: DoctorAppointmentByDoctorId[] }).appointments ?? [];
    }
    return [];
  } catch (error: unknown) {
    console.error("Error getting appointments by doctor id:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};

export const getAppointmentsByDoctorIdCount = async (doctorId: number): Promise<number> => {
  try {
    const resp = await axiosInstance.get<number | string>(`/doctors/appointments/${doctorId}/count`);

    const n = typeof resp.data === "number" ? resp.data : Number(resp.data);
    if (!Number.isFinite(n)) {
      console.warn("Unexpected count payload, defaulting to 0:", resp.data);
      return 0;
    }
    return n;
  } catch (error: unknown) {
    console.error("Error getting appointments count:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) throw error.response.data.error;
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};
