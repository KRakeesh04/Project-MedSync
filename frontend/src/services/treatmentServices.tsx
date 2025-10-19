import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Treatment {
  service_code: number;
  name: string;
  fee: string;
  description: string;
  speciality_id: number;

}

export const getAllTreatments = async () => {
  try {
    const resp = await axiosInstance.get<{ treatments: Array<Treatment> }>("/treatments");
    return resp.data;
  } catch (error: unknown) {
    console.error("Error getting all treatments:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) throw error.response.data.error;
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getTreatments = async (count: number, offset: number) => {
  try {
    const resp = await axiosInstance.get<{ treatments: Treatment[]; treatment_count: number }>(
      `/treatments?count=${count}&offset=${offset}`
    );
    return resp.data;
  } catch (error) {
    console.error("Error fetching paginated treatments:", error);
    throw error;
  }
};

export type TreatmentCreateInput = {
  name: string;
  fee: number | string; // number on submit, string while typing
  description: string;
  speciality_id: string;
};
export async function createTreatment(
  payload: Omit<TreatmentCreateInput, "fee"> & { fee: number }
) {
  try {
    const resp = await axiosInstance.post<{ treatment: Treatment }>('/treatments/add', payload);
    return resp.data;
  } catch (err: unknown) {
    console.error('Error creating treatment:', err);
    if (err instanceof AxiosError) {
      const msg = err.response?.data?.error ?? err.message;
      throw new Error(msg);
    }
    throw new Error('Failed to create treatment');
  }
}


