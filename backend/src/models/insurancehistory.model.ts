import sql from "../db/db.ts";

export interface insuranceHistory {
claim_id: number;
service_code: string;
patient_id: number;
approved_by: string;
claimed_amount: number;
claimed_at: string;
insurance_id: number;

}

export const getAllInsuranceHistories = async (): Promise<insuranceHistory[]> => {
    try {
        const [rows] = await sql.query("CALL get_all_insurance_histories()");
        return (rows as any)[0] as insuranceHistory[];
    } catch (error) {
        console.error("Error fetching insurance histories:", error);
        throw error;
    }
};

