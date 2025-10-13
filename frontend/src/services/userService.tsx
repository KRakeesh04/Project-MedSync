import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";


export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  role: string;
  branch_id: number;
  branch_name: string;
  is_approved: boolean;
  created_at: string;
}

export const getAllUsers = async (count: number, offset: number, Role: string, Branch: string) => {
  try {
    const users_db = await axiosInstance.get<{
      user_count: number;
      users: Array<User>;
    }>(`/users/active?count=${count}&offset=${offset}&role=${Role}&branch=${Branch}`);
    return users_db.data;
  } catch (error: unknown) {
    console.error("Error getting all users:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getAllInactiveUsers = async (count: number, offset: number) => {
  try {
    const users_db = await axiosInstance.get<{
      user_count: number;
      users: Array<User>;
    }>(`/users/inactive?count=${count}&offset=${offset}`);
    return users_db.data;
  } catch (error: unknown) {
    console.error("Error getting all deleted users:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const editUser = async (data: any) => {
  try {
    const response = await axiosInstance.put(`/user/${data.user_id}`,
      {
        role: data.role,
        branch_id: data.branch_id,
        is_approved: data.is_approved,
      }
    )
    return response.data
  } catch (error: unknown) {
    console.error("Error editing user:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
}

export const deleteUser = async (user_id: number) => {
  try {
    const response = await axiosInstance.delete(`/user/${user_id}`)
    return response.data
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
}

export const restoreDeletedUser = async (user_id: number) => {
  try {
    const response = await axiosInstance.put(`/user/restore/${user_id}`)
    return response.data
  } catch (error: unknown) {
    console.error("Error restoring user:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
}