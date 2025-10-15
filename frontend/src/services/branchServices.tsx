import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Branch {
  branch_id: number;
  name: string;
  location: string;
  landline_no: string;
  created_at: string;
}

export interface BranchName {
  branch_id: number;
  name: string;
}

export const getBranchesForPagination = async () => {
  try {
    const branches_db = await axiosInstance.get<{
      branch_count: number;
      branches: Array<Branch>;
    }>(`/branches`);
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
      branches: Array<BranchName>;
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

export const createBranch = async (branchData: { name: string; location: string; landline_no: string; }) => {
  try {
    // Note: backend router uses `/branchs/add` in this project (typo kept for compatibility)
    const response = await axiosInstance.post(`/branches/add`, branchData);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error creating branch:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const deleteBranch = async (branch_id: number) => {
  try {
    const response = await axiosInstance.delete(`/branchs/${branch_id}`);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error deleting branch:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};