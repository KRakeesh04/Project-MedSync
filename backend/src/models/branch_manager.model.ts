import sql from "../db/db.ts";

export const createManager = async (
  user_id: number,
  fullname: string,
  monthly_salary: number,
  gender: string,
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_branch_manager(?, ?, ?, ?)",
      [user_id, fullname, monthly_salary, gender]
    );
  } catch (error) {
    console.error("Error creating branch manager:", error);
    throw error;
  }
};