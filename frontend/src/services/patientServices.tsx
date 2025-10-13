import axiosInstance from "@/axiosConfig";

export interface Patient {
  patient_id: number,
  name: string,
  gender: string,
  emergency_contact_no: string,
  nic: string,
  address: string,
  date_of_birth: string,
  blood_type: string,
  branch_id: number,
  branch_name: string,
};

export const getPatients = async (
  isExPatient: number,
  count: number,
  offset: number,
  branch: string,
  gender: string,
  bloodGroup: string,
) => {
  try {
    const response = await axiosInstance.get<{
      patient_count: number;
      patients: Patient[];
    }>(`/patients?isExPatient=${isExPatient}&count=${count}&offset=${offset}&branch=${branch}&gender=${gender}&bloodGroup=${bloodGroup.trim()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current patients:", error);
    throw error;
  }
};

export const updatePatientByID = async (data: {
  patient_id: number;
  name: string;
  type: string;
  branch_id: number | "";
  gender: string;
  monthly_salary: string;
}): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put(`/patient/${data.patient_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
