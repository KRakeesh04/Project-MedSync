import axiosInstance from "@/axiosConfig";
import { AxiosError } from "axios";

export interface BranchManager {
  manager_id: number;
  name: string;
  gender: string;
  branch_id: number;
  branch_name: string;
  monthly_salary: number;
}

export const getAllManagers = async (branch: number) => {
  try {
    const managers = await axiosInstance.get<{
      manager_count: number;
      managers: Array<BranchManager>;
    }>(`/managers?branch=${branch}`);
    return managers.data;
  } catch (error: unknown) {
    console.error("Error getting branch manager data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const updateManagerDetails = async (data: {
  manager_id: number;
  name: string;
  gender: string;
  branch_id: number | "";
  monthly_salary: string;
}): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put(`/managers/${data.manager_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};