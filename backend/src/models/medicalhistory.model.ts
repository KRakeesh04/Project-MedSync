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
        const [rows]: any = await sql.query("CALL get_medical_histories_by_patient_id(?)", [patientId]);
        return (rows[0] ?? rows) as medicalHistory[];
    } catch (error) {
        console.error("Error fetching medical histories by patient ID:", error);
        throw error;
    }
};

export const getMedicalHistoriesPaginated = async (count: number, offset: number, branch: number): Promise<medicalHistory[]> => {
    try {
        const [rows]: any = await sql.query("CALL get_all_medical_histories_for_pagination(?,?,?)", [
            count,
            offset,
            branch
        ]);
        return (rows[0] ?? rows) as medicalHistory[];
    } catch (error) {
        console.error("Error fetching paginated medical histories:", error);
        throw error;
    }
};

export const getMedicalHistoriesCount = async (branch: number): Promise<number> => {
    try {
        const [rows]: any = await sql.query("CALL get_medical_histories_count(?)", [branch]);
        const first = rows?.[0]?.[0];
        return Number(first?.total_count ?? 0);
    } catch (error) {
        console.error("Error fetching medical histories count:", error);
        throw error;
    }
};