import axiosInstance from "../axiosConfig";
import {
  LOCAL_STORAGE__USER,
  LOCAL_STORAGE__TOKEN,
} from "@/services/authServices";

export interface fetchTotalPatientsCountResponse {
  total_count: number;
}
export interface fetchTotalStaffsCountResponse {
  total_count: number;
}
export interface fetchTotalBranchesCountResponse {
  total_count: number;
}

export interface fetchMonthlyAppointmentsCountResponse {
  month: string;
  count: number;
}
export interface FetchMonthlyRevenueResponse {
  month: string;    
  revenue: string;  
}

export interface DoctorDashboardDetails {
  doctor_id: number;
  name: string;
  gender: string;
  branch_id: number;
  branch_name: string;
  fee_per_patient: number;
  basic_monthly_salary: number;
}

type ApiResponse = {
  doctor: {
    doctor_id: number;
    name: string;
    gender: string;
    branch_id: number;
    branch_name: string;
    fee_per_patient: string | number;
    basic_monthly_salary: string | number;
  };
};

export const doctorDashboardDetails = async (): Promise<DoctorDashboardDetails> => {
  const userStr = localStorage.getItem(LOCAL_STORAGE__USER);
  if (!userStr) throw new Error("Not signed in");
  const user = JSON.parse(userStr) as { user_id: number };
  const token = localStorage.getItem(LOCAL_STORAGE__TOKEN) ?? "";
  const resp = await axiosInstance.get<ApiResponse>(`/doctors/${user.user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const record = resp.data?.doctor;
  if (!record) throw new Error("No doctor record found");

  return {
    ...record,
    fee_per_patient: typeof record.fee_per_patient === "string"
      ? Number(record.fee_per_patient)
      : record.fee_per_patient,
    basic_monthly_salary: typeof record.basic_monthly_salary === "string"
      ? Number(record.basic_monthly_salary)
      : record.basic_monthly_salary,
  };
};

export const fetchTotalPatientsCount = async () => {
  try {
    const response = await axiosInstance.get("/patient/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching total patients count:", error);
    throw error;
  }
};

export const fetchTotalStaffsCount = async () => {
  try {
    const response = await axiosInstance.get("/staff/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching total staffs count:", error);
    throw error;
  }
};

export const fetchTotalBranchesCount = async () => {
  try {
    const response = await axiosInstance.get("/branch/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching total staffs count:", error);
    throw error;
  }
};

// export const fetchMonthlyAppointmentsCount = async (startDate: string, endDate: string, status: string | null) => {
//   try {
//     const response = await axiosInstance.post("/appointments/monthly-counts", {startDate,endDate,status});
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching monthly appointments count:", error);
//     throw error;
//   }
// };
export const fetchMonthlyAppointments = async (
  start: string,
  end: string
): Promise<fetchMonthlyAppointmentsCountResponse[]> => {
  const { data } = await axiosInstance.get<fetchMonthlyAppointmentsCountResponse[]>(
    "/appointments/monthly-counts",
    { params: { start, end } }
  );
  return data; 
};

// Helper for a whole year
export const fetchMonthlyAppointmentsForYear = async (year: number) => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return fetchMonthlyAppointments(start, end);
};


export const fetchMonthlyRevenue = async (
  start: string,
  end: string
): Promise<FetchMonthlyRevenueResponse[]> => {
  const { data } = await axiosInstance.get<FetchMonthlyRevenueResponse[]>(
    "/billing/monthly-revenue",     
    { params: { start, end } }
  );
  return data;
};

export const fetchMonthlyRevenueForYear = async (year: number) => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return fetchMonthlyRevenue(start, end);
};

