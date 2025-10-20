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

export const getAllBranchManagers = async (): Promise<any[]> => {
  try {
    const [rows] = await sql.execute("CALL get_all_branch_managers()");
    return (rows as any)[0] as any[];
  } catch (error) {
    console.error('Error fetching branch managers:', error);
    throw new Error('Database error');
  }
};

export const updateBranchManagerById = async (
  manager_id: number,
  fullname: string,
  monthly_salary: number,
  gender: string,
): Promise<void> => {
  try {
    await sql.query(
      "CALL update_branch_manager(?, ?, ?, ?)",
      [manager_id, fullname, monthly_salary, gender]
    );
  } catch (error) {
    console.error("Error updating branch manager details:", error);
    throw error;
  }
};