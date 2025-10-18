import axiosInstance from "../axiosConfig";
import type { medication } from "./medicationServices";

export interface medicalHistory {
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

export const getallmedicalhistories = async () => {
    try {
        const resp = await axiosInstance.get<{ histories: Array<medicalHistory> }>("/medical-histories");
        return resp.data.histories;
    } catch (error) {
        console.error("Error fetching medical histories:", error);
        throw error;
    }
};

type WrappedA = { medicalHistories: medicalHistory[] };
type WrappedB = { histories: medicalHistory[] };

export const getMedicalHistoriesByPatientId = async (
  patientId: number
): Promise<medicalHistory[]> => {
  try {
    const { data } = await axiosInstance.get<WrappedA | WrappedB | medicalHistory[]>(
      `/medical-histories/${patientId}`
    );

    if (Array.isArray(data)) return data;
    if ("medicalHistories" in data && Array.isArray(data.medicalHistories)) {
      return data.medicalHistories;
    }
    if ("histories" in data && Array.isArray(data.histories)) {
      return data.histories;
    }

    // Fallback — keep return type stable
    return [];
  } catch (error) {
    console.error(`Error fetching medical histories for patient ${patientId}:`, error);
    throw error;
  }
};

// export const getMedicalHistoriesByPatientId = async (patientId: number) => {
//   try {

//     const resp = await axiosInstance.get<{ medicalHistories: Array<medicalHistory> }>(`/medications/${patientId}`);

//     return resp.data.medicalHistories;
//   } catch (error) {
//     console.error(`Error fetching medical history for patient ${patientId}:`, error);
//     throw error;
//   }
// };