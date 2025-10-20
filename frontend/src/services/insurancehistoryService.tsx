import axiosInstance from "../axiosConfig";

export interface insuranceHistory {
claim_id: number;
service_code: string;
patient_id: number;
approved_by: string;
claimed_amount: number;
claimed_at: string;
insurance_id: number;
}


export const getallinsurancehistories = async () => {
    try {
        const resp = await axiosInstance.get<{ histories: Array<insuranceHistory> }>("/insurance-histories");
        return resp.data.histories;
    } catch (error) {
        console.error("Error fetching insurance histories:", error);
        throw error;
    }
};

