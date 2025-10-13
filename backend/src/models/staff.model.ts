import sql from "../db/db.ts";

export interface Staff {
  staff_id: number,
  name: string,
  type: string,
  branch_id: number,
  branch_name: string,
  gender: string,
  monthly_salary: number,
}


export const createStaff = async (
  user_id: number,
  fullname: string,
  role: string,
  gender: string,
  monthly_salary: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_staff(?, ?, ?, ?, ?)",
      [user_id, fullname, role, gender, monthly_salary]
    );
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

