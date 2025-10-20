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
    }>(`/branch-managers?branch=${branch}`);
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
    const payload = {
      fullname: data.name,
      monthly_salary: Number(data.monthly_salary || 0),
      gender: data.gender,
    };
    const response = await axiosInstance.put(`/branch-managers/${data.manager_id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableManagerCandidates = async () => {
  try {
    const res = await axiosInstance.get(`/branch-managers/candidates`);
    return res.data;
  } catch (error) {
    console.error('Error fetching manager candidates:', error);
    throw error;
  }
};

export const getBranchesWithoutManager = async () => {
  try {
    const res = await axiosInstance.get(`/branches/without-manager`);
    return res.data;
  } catch (error) {
    console.error('Error fetching branches without manager:', error);
    throw error;
  }
};

export const assignManagerToBranch = async (manager_id: number, branch_id: number, fullname: string, monthly_salary?: number, gender?: string) => {
  try {
    const payload: any = { manager_id, branch_id, fullname };
    if (monthly_salary !== undefined) payload.monthly_salary = monthly_salary;
    if (gender) payload.gender = gender;
    const res = await axiosInstance.post(`/branch-managers/assign`, payload);
    return res.data;
  } catch (error) {
    console.error('Error assigning manager to branch:', error);
    throw error;
  }
};

export const addBranchManager = async (data: { name: string; gender: string; monthly_salary?: number; branch_id: number }) => {
  try {
    const payload = {
      name: data.name,
      gender: data.gender,
      monthly_salary: Number(data.monthly_salary || 0),
      branch_id: Number(data.branch_id),
    };
    const res = await axiosInstance.post(`/branch-managers/add`, payload);
    return res.data;
  } catch (error) {
    console.error('Error adding branch manager:', error);
    throw error;
  }
};