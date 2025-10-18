import axiosInstance from "../axiosConfig";
import {
  LOCAL_STORAGE__USER,
  LOCAL_STORAGE__TOKEN,
} from "@/services/authServices";


export interface PatientDashboardDetails {
  patient_id: number;
  name: string;
  gender: string;
  emergency_contact_no: string;
  nic: string;
  address: string;
  date_of_birth: string | null;
  blood_type: string;
}

type ApiResponse = { patient: PatientDashboardDetails[] };

export const getPatientDashboardDetails = async (): Promise<PatientDashboardDetails> => {
  const userStr = localStorage.getItem(LOCAL_STORAGE__USER);
  if (!userStr) throw new Error("Not signed in");
  const user = JSON.parse(userStr) as { user_id: number };

  const token = localStorage.getItem(LOCAL_STORAGE__TOKEN) ?? "";
  const resp = await axiosInstance.get<ApiResponse>(`/patient/${user.user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const record = resp.data?.patient?.[0];
  if (!record) throw new Error("No patient record found");

  return record; 
};


