import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface InsuranceTypes {
 insurance_id: number,  
  insurance_type: string,  
  insurance_period: string,  
  claim_percentage: number,  
  created_at: string
}
export const getInsuranceTypesDataForPagination = async (
  count: number,
  offset: number
) => {
  try {
    const insuranceTypes = await axiosInstance.get<{
      insurance_count: number;
      insuranceTypes: Array<InsuranceTypes>;
    }>(`/insurance-types?count=${count}&offset=${offset}`);
    return {
      insurance_count: insuranceTypes.data.insurance_count,
      insurance: insuranceTypes.data.insuranceTypes,
    };
  } catch (error: unknown) {
    console.error("Error getting insurance data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const getInsuranceById = async (insuranceId: number) => {
  try {
    const insurance = await axiosInstance.get<InsuranceTypes>(`/insurance/${insuranceId}`);
    return insurance.data;
  } catch (error: unknown) {
    console.error("Error fetching insurance details:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export const editInsurance = async (data: {
  insurance_id: number;
  insurance_type: string;
  insurance_period: number;
  claim_percentage: number;
}) => {
  try {
    const response = await axiosInstance.put(`/insurance-types/${data.insurance_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error editing insurance:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};
  
