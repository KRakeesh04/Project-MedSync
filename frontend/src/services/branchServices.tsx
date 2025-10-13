import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Branch {
  branch_id: number;
  name: string;
  location: string;
  landline_no: string;
  created_at: string;
}

export const getBranchesForPagination = async (count: number, offset: number) => {
  try {
    const branches_db = await axiosInstance.get<{
      branch_count: number;
      branches: Array<Branch>;
    }>(`/branches?count=${count}&offset=${offset}`);
    return branches_db.data;
  } catch (error: unknown) {
    console.error("Error getting branches for pagination:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAllBranches = async () => {
  try {
    const branches_db = await axiosInstance.get<{
      branch_count: number;
      branches: Array<Branch>;
    }>(`/all-branches`);
    return branches_db.data;
  } catch (error: unknown) {
    console.error("Error getting all branches:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};