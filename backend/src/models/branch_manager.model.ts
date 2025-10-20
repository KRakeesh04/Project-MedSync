import sql from "../db/db.ts";
import { hashPassword } from "../auth/hash.ts";

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

export const getAvailableManagerCandidates = async (): Promise<any[]> => {
  try {
    // users with role Branch_Manager and not present in branch_manager table
    const [rows] = await sql.execute(
      `SELECT u.user_id, u.username, u.role, u.branch_id
       FROM \`user\` u
       LEFT JOIN branch_manager bm ON bm.manager_id = u.user_id
       WHERE u.role = 'Branch_Manager' AND bm.manager_id IS NULL AND u.is_deleted = 0`
    );
    return (rows as any) as any[];
  } catch (error) {
    console.error('Error fetching available manager candidates:', error);
    throw new Error('Database error');
  }
};

export const getBranchesWithoutManager = async (): Promise<any[]> => {
  try {
    const [rows] = await sql.execute(
      `SELECT b.branch_id, b.name, b.location
       FROM branch b
       WHERE NOT EXISTS (
         SELECT 1 FROM branch_manager bm
         JOIN \`user\` u ON u.user_id = bm.manager_id
         WHERE u.branch_id = b.branch_id
       )`
    );
    return (rows as any) as any[];
  } catch (error) {
    console.error('Error fetching branches without manager:', error);
    throw new Error('Database error');
  }
};

export const assignUserToBranch = async (user_id: number, branch_id: number): Promise<void> => {
  try {
    await sql.query(
      "UPDATE `user` SET branch_id = ? WHERE user_id = ?",
      [branch_id, user_id]
    );
  } catch (error) {
    console.error('Error assigning user to branch:', error);
    throw error;
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

export const createManagerByAdmin = async (
  fullname: string,
  gender: string,
  monthly_salary: number,
  branch_id: number
): Promise<void> => {
  try {
    const conn = await sql.getConnection();
    try {
      await conn.beginTransaction();

      function nameFormatToUsername(name: string) {
        return name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "_");
      }

      const username = nameFormatToUsername(fullname);
      const passwordHash = await hashPassword(username + "_password");

      // create_user signature: (p_username, p_password_hash, p_role, p_branch_id, p_is_approved)
      const [createUserResult]: any = await conn.query(
        "CALL create_user(?, ?, ?, ?, ?)",
        [username, passwordHash, "Branch_Manager", branch_id, 0]
      );

      const userRow = Array.isArray(createUserResult) ? createUserResult[0] : createUserResult;
      const user_id = userRow && userRow.user_id ? userRow.user_id : (userRow && userRow[0] && userRow[0].user_id ? userRow[0].user_id : null);
      if (!user_id) {
        throw new Error('Failed to create user for branch manager');
      }

      await conn.query(
        "CALL create_branch_manager(?, ?, ?, ?)",
        [Number(user_id), fullname, monthly_salary, gender]
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error creating branch manager by admin:", error);
    throw error;
  }
};