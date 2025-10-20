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

export interface getPatientsCountPerBranchResponse {
  branch_name: string;
  patient_count: number;
}

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


export const getFullPatientDetails = async (patientId: number) => {
  try {
    const response = await axiosInstance.get(`/patient/full/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching full patient details:', error);
    throw error;
  }
};

// services/patientServices.ts
export const getPatientsCountPerBranch = async (): Promise<{ branch_name: string; patient_count: number }[]> => {
  try {
    // Backend actually returns { counts: { branch: string; total_patients: number }[] }
    const response = await axiosInstance.get<{ counts: { branch: string; total_patients: number }[] }>(
      "/patient/count/per-branch"
    );

    // 🔁 Normalize to the shape your component uses
    return response.data.counts.map(({ branch, total_patients }) => ({
      branch_name: branch,
      patient_count: total_patients,
    }));
  } catch (error) {
    console.error("Error fetching patients count per branch:", error);
    throw error;
  }
};