import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Speciality {
  speciality_id: number;
  speciality_name: string;
  description: string;
}

export const getAllSpecialities = async () => {
  try {
    const response = await axiosInstance.get<{
      speciality_count: number;
      specialities: Array<Speciality>;
    }>(`/specialities`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all specialities data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const addSpeciality = async (specialityData: {
  speciality_name: string;
  description: string;
}) => {
  try {
    const response = await axiosInstance.post(`/specialities`, specialityData);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error adding new speciality data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const updateSpeciality = async (
  speciality_id: number,
  specialityData: {
    speciality_name: string;
    description: string
  }) => {
  try {
    const response = await axiosInstance.put(`/specialities/${speciality_id}`, specialityData);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error updating speciality data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const deleteSpeciality = async (speciality_id: number) => {
  try {
    const response = await axiosInstance.delete(`/specialities/${speciality_id}`);
    return response.data.message;
  } catch (error: unknown) {
    console.error("Error deleting speciality:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getSpecialityNames = async () => {
  try {
    const response = await axiosInstance.get<{
      speciality_count: number;
      specialities: Array<Pick<Speciality, 'speciality_id' | 'speciality_name'>>;
    }>(`/specialities/names`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting speciality names:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) throw error.response.data.error;
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};