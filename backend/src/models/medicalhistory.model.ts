import sql from "../db/db.ts";

export interface medicalHistory {
    medical_history_id: number;
    appointment_id: number;
    visit_date: string;
    diagnosis: string;
    symptoms: string;
    allergies: string;
    notes: string;
    follow_up_date: string;
    created_at: string;
    updated_at: string;
}

export const getAllMedicalHistories = async (): Promise<medicalHistory[]> => {
    try {
        const [rows] = await sql.query("CALL get_all_medical_histories()");
        return (rows as any)[0] as medicalHistory[];
    } catch (error) {
        console.error("Error fetching medical histories:", error);
        throw error;
    }
};

export const getMedicalHistoriesByPatientId = async (patientId: number): Promise<medicalHistory[]> => {
    try {
        const [rows] = await sql.query("CALL get_medical_histories_by_patient_id(?)", [patientId]);
        return (rows as any)[0] as medicalHistory[];
    } catch (error) {
        console.error("Error fetching medical histories by patient ID:", error);
        throw error;
    }
};