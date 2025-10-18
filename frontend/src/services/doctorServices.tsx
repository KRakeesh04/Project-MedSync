import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Doctor {
  doctor_id: number;
  name: string;
  gender: string;
  branch_id: number;
  branch_name: string;
  fee_per_patient: number;
  basic_monthly_salary: number;
}

// export interface DoctorSpeciality {
//   doctor_id: number;
//   speciality_id: number;
//   name: string;
//   speciality_name: string;
//   added_at: string;
// }
export type DoctorSpeciality = {
  id: number;
  name: string;
};

export type DoctorDataWithSpeciality = {
  doctor_id: number;
  name: string;
  specialties: string[]; // array of specialty names
  added_at: string; // ISO date string
};

export interface DoctorAppointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  patient_note: string;
  date: string;
  time_slot: string;
  status: string;
  time_stamp: string;
}

export interface DoctorPatientsHistory {
  medical_history_id: number;
  appointment_id: number;
  visit_date: string;
  diagnosis: string;
  symptoms: string;
  allergies: string;
  notes: string;
  follow_up_date: string;
  created_at: string;
  updated_at: string;
}

export const getAllDoctors = async (branchId: string) => {
  try {
    const response = await axiosInstance.get<{
      doctor_count: number;
      doctors: Array<Doctor>;
    }>(`/doctors?branch=${branchId}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all doctors data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getDoctorByID = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting a doctor's data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const addDoctor = async (doctorData: {
  name: string;
  fee_per_patient: string;
  basic_monthly_salary: string;
  gender: string;
  branch_id: string;
  specialties?: number[];
}) => {
  try {
    const response = await axiosInstance.post(`/doctors/add`, doctorData);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error adding new doctor data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};


// export const getAllDoctorSpecialities = async () => {
//   try {
//     const response = await axiosInstance.get<{
//       doctor_speciality_count: number;
//       doctor_specialities: Array<DoctorSpeciality>;
//     }>(`/doctors/specialities`);
//     return response.data;
//   } catch (error: unknown) {
//     console.error("Error getting all doctors' speciality data:", error);
//     if (error instanceof AxiosError) {
//       if (error.response?.data?.error) {
//         throw error.response.data.error;
//       }
//       throw error.message;
//     }
//     throw "Unknown error occurred";
//   }
// };
export const getAllDoctorSpecialities = async (): Promise<DoctorDataWithSpeciality[]> => {
  try {
    const response = await axiosInstance.get<{
      doctor_speciality_count: number;
      doctor_specialities: Array<{
        doctor_id: number;
        doctor_name: string;
        specialties: DoctorSpeciality[];
        added_at: string;
      }>;
    }>(`/doctors/specialities`);

    // Map API response to our Doctor type
    const doctors: DoctorDataWithSpeciality[] = response.data.doctor_specialities.map((d) => ({
      doctor_id: d.doctor_id,
      name: d.doctor_name,
      specialties: d.specialties.map((s) => s.name), // extract names
      added_at: d.added_at,
    }));

    return doctors;
  } catch (error: unknown) {
    console.error("Error getting all doctors' speciality data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAllDoctorAppointments = async () => {
  try {
    const response = await axiosInstance.get
      // <{
      //   doctor_appointment_count: number;
      //   doctor_appointments: Array<DoctorAppointment>;
      // }>
      (`/doctors-appointments`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all doctors' appointments data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAllDoctorPatientsHistory = async () => {
  try {
    const response = await axiosInstance.get
      // <{
      //   doctors_patients_history_count: number;
      //   doctors_patients_history: Array<DoctorPatientsHistory>;
      // }>
      (`/doctors-patients-history`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all doctors' patients History data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};
