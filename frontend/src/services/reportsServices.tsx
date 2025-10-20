import axiosInstance from "../axiosConfig";
import { AxiosError } from "axios";

export interface BranchAppointmentSummary {
  branch_id: number;
  branch_name: string;
  appointment_date: string;
  total_appointments: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export interface DoctorRevenueReport {
  doctor_id: number;
  doctor_name: string;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: number;
  avg_revenue_per_appointment: number;
}

export interface PatientOutstandingBalance {
  patient_id: number;
  patient_name: string;
  branch_name: string;
  outstanding_balance: number;
  unpaid_invoices: number;
  last_visit_date: string;
}

export interface TreatmentsByCategory {
  speciality_id: number;
  speciality_name: string;
  treatment_count: number;
  unique_appointments: number;
  total_revenue: number;
}

export interface InsuranceVsOutOfPocket {
  insurance_id: number;
  payment_type: string;
  total_appointments: number;
  unique_patients: number;
  total_billed_amount: number;
  total_insurance_claimed: number;
  total_paid_amount: number;
  payment_category: string;
}

export interface ReportFilters {
  start_date: string;
  end_date: string;
  branch_id: number;
  doctor_id: number;
  speciality_id: number;
  insurance_id: number;
}

interface ReportResponse<T> {
  report_type: string;
  data: T[];
  total_records: number;
}

// Branch-wise appointment summary
export const getBranchAppointmentSummary = async (
  filters: ReportFilters
): Promise<BranchAppointmentSummary[]> => {
  try {
    const response = await axiosInstance.get<ReportResponse<BranchAppointmentSummary>>(
      "/reports/branch-appointments",
      {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          branch_id: filters.branch_id
        }
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error getting branch appointment summary:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};

// Doctor-wise revenue report
export const getDoctorRevenueReport = async (
  filters: ReportFilters
): Promise<DoctorRevenueReport[]> => {
  try {
    const response = await axiosInstance.get<ReportResponse<DoctorRevenueReport>>(
      "/reports/doctor-revenue",
      {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          doctor_id: filters.doctor_id
        }
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error getting doctor revenue report:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};

// Patients with outstanding balances
export const getPatientsOutstandingBalances = async (
  filters: ReportFilters
): Promise<PatientOutstandingBalance[]> => {
  try {
    const response = await axiosInstance.get<ReportResponse<PatientOutstandingBalance>>(
      "/reports/outstanding-balances",
      {
        params: {
          branch_id: filters.branch_id
        }
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error getting outstanding balances:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};

// Treatments by category
export const getTreatmentsByCategory = async (
  filters: ReportFilters
): Promise<TreatmentsByCategory[]> => {
  try {
    const response = await axiosInstance.get<ReportResponse<TreatmentsByCategory>>(
      "/reports/treatments-category",
      {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          speciality_id: filters.speciality_id
        }
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error getting treatments by category:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};

// Insurance vs Out-of-Pocket
export const getInsuranceVsOutOfPocket = async (
  filters: ReportFilters
): Promise<InsuranceVsOutOfPocket[]> => {
  try {
    const response = await axiosInstance.get<ReportResponse<InsuranceVsOutOfPocket>>(
      "/reports/insurance-outofpocket",
      {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          insurance_id: filters.insurance_id
        }
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error getting insurance vs out-of-pocket report:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};

// Get all branches for dropdown
export const getAllBranches = async (): Promise<{id: number, name: string}[]> => {
  try {
    const response = await axiosInstance.get("/all-branches");
    return response.data.branches || [];
  } catch (error: unknown) {
    console.error("Error getting branches:", error);
    return [];
  }
};

// Get all doctors for dropdown
export const getAllDoctors = async (): Promise<{id: number, name: string}[]> => {
  try {
    const response = await axiosInstance.get("/doctors/names");
    return response.data.doctors || [];
  } catch (error: unknown) {
    console.error("Error getting doctors:", error);
    return [];
  }
};

// Get all specialities for dropdown
export const getAllSpecialities = async (): Promise<{id: number, name: string}[]> => {
  try {
    const response = await axiosInstance.get("/specialities/names");
    return response.data.specialities || [];
  } catch (error: unknown) {
    console.error("Error getting specialities:", error);
    return [];
  }
};

// Get all insurance types for dropdown
export const getAllInsuranceTypes = async (): Promise<{id: number, name: string}[]> => {
  try {
    const response = await axiosInstance.get("/all-insurance-types");
    return response.data.insurance_types || [];
  } catch (error: unknown) {
    console.error("Error getting insurance types:", error);
    return [];
  }
};