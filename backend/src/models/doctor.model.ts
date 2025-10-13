import sql from "../db/db.ts";


export const createDoctor = async (
  user_id: number,
  fullname: string,
  gender: string,
  fee_per_patient: number,
  monthly_salary: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_doctor(?, ?, ?, ?, ?)",
      [user_id, fullname, gender, fee_per_patient, monthly_salary]
    );
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
};