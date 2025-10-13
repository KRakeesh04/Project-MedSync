import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Staff {
  staff_id: number,
  name: string,
  type: string,
  branch_id: number,
  branch_name: string,
  gender: string,
  monthly_salary: number,
}

export const getStaffDataForPagination = async (
  count: number,
  offset: number,
  role: string,
  branch: string
) => {
  try {
    const staff = await axiosInstance.get<{
      staff_count: number;
      staff: Array<Staff>;
    }>(`/staff?count=${count}&offset=${offset}&role=${role}&branch=${branch}`);
    return staff.data;
  } catch (error: unknown) {
    console.error("Error getting staff data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getStaffById = async (staffId: number) => {
  try {
    const staff = await axiosInstance.get<Staff>(`/staff/${staffId}`);
    return staff.data;
  } catch (error: unknown) {
    console.error("Error fetching staff details:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const editStaff = async (data: {
  staff_id: number;
  name: string;
  type: string;
  branch_id: number | "";
  gender: string;
  monthly_salary: string;
}): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put(`/staff/${data.staff_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};