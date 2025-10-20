import sql from "../db/db.ts";

export interface Treatment {
  service_code: number;
  name: string;
  fee: string;
  description: string;
  speciality_id: number;
  created_at: string;
}

export const getAllTreatments = async (): Promise<Treatment[]> => {
  try {
    const [rows]: any = await sql.query("CALL get_all_treatments()");
    return (rows[0] ?? rows) as Treatment[];
  } catch (error) {
    console.error("Error fetching treatments:", error);
    throw error;
  }
};

export const getTreatmentsForPagination = async (
  count: number,
  offset: number
): Promise<Treatment[]> => {
  try {
    const [rows]: any = await sql.query("CALL get_treatments_for_pagination(?, ?)", [
      count,
      offset,
    ]);
    return (rows[0] ?? rows) as Treatment[];
  } catch (error) {
    console.error("Error in getTreatmentsForPagination:", error);
    throw error;
  }
};

export const getTreatmentsCount = async (): Promise<number> => {
  try {
    const [rows]: any = await sql.query("CALL get_treatments_count()");
    const first = rows?.[0]?.[0];
    return Number(first?.treatment_count ?? 0);
  } catch (error) {
    console.error("Error fetching treatment count:", error);
    throw error;
  }
};
export const checkServiceCodeExists = async (code: number): Promise<boolean> => {
  const [rows]: any = await sql.query("CALL check_service_code_exists(?)", [code]);
  const exists = rows?.[0]?.[0]?.exists_flag ?? 0;
  return Boolean(Number(exists));
};
export type CreateTreatmentInput = {
  name: string;
  fee: number;
  description?: string | null;
  speciality_id: number;
};

export const createTreatment = async (payload: CreateTreatmentInput): Promise<Treatment> => {
  const [rows]: any = await sql.query("CALL create_treatment(?, ?, ?, ?)", [
    payload.name,
    payload.fee,
    payload.description ?? null,
    payload.speciality_id,
  ]);
  // procedure selects the inserted row using LAST_INSERT_ID(); unwrap accordingly
  const first = rows?.[0]?.[0] ?? rows?.[0];
  return (first as Treatment) ?? (rows as Treatment);
};