import sql from "../db/db.ts";

export interface Medication {
  appointment_id: number;
  branch_id: number;
  branch_name: string;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: number;
  consultation_note: string;
  prescription_items_details: string;
  prescribed_at: string;
  is_active: boolean;
}

export const getAllMedications = async (): Promise<Medication[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_medications()");
    return (rows as any)[0] as Medication[];
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw error;
  }
};

export const getMedicationsByPatientId = async (patientId: number): Promise<Medication[]> => {
  try {
    const [rows] = await sql.query("CALL get_medications_by_patient_id(?)", [patientId]);
    return (rows as any)[0] as Medication[];
  } catch (error) {
    console.error("Error fetching medications by patient id:", error);
    throw error;
  }
};

export const getMedicationsPaginated = async (count: number, offset: number, branch: number): Promise<Medication[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_medications_for_pagination(?,?,?)", [
      count,
      offset,
      branch
    ]);
    return (rows as any)[0] as Medication[];
  } catch (error) {
    console.error("Error fetching paginated medications:", error);
    throw error;
  }
};

export const getMedicationsCount = async (branch: number): Promise<number> => {
  try {
    const [rows]: any = await sql.query("CALL get_medications_count(?)", [branch]);
    return rows[0][0].medication_count;
  } catch (error) {
    console.error("Error fetching medications count:", error);
    throw error;
  }
};
