
import axiosInstance from "../axiosConfig";

export interface Medication {
  appointment_id: number;
  branch_id: number;
  branch_name: string;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: number;
  consultation_note: string;
  prescription_items_details: string;
  prescribed_at: string;
  is_active: boolean;
}

export const getAllMedications = async () => {
  try {
    const resp = await axiosInstance.get<{ medications: Array<Medication> }>("/medications");
    return resp.data.medications;
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw error;
  }
};

export const getMedications = async (
  count: number,
  offset: number,
  branch: string
) => {
  try {
    const response = await axiosInstance.get<{
      medication_count: number;
      medications: Medication[];
    }>(`/medications?count=${count}&offset=${offset}&branch=${branch}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current medications:", error);
    throw error;
  }
};


export const createMedication = async (payload: Partial<Medication>) => {
  try {
    const resp = await axiosInstance.post<{ medication: Medication }>(`/medications`, payload);
    return resp.data.medication;
  } catch (error) {
    console.error("Error creating medication:", error);
    throw error;
  }
};


export const getMedicationsByPatientId = async (patientId: number) => {
  try {
    const resp = await axiosInstance.get<{ medications: Array<Medication> }>(`/medications/${patientId}`);

    return resp.data.medications;
  } catch (error) {
    console.error(`Error fetching medications for patient ${patientId}:`, error);
    throw error;
  }
};