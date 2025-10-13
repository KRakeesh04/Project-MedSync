import sql from "../db/db.ts";

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  role: string;
  branch_id: number;
  branch_name: string;
  is_approved: boolean;
  created_at: string;
}

// for the login
export const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const [rows] = await sql.query("CALL get_user_by_username(?)", [username]);
    const user = (rows as any)[0][0] as User;
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Create User
export const createUser = async (
  username: string,
  password_hash: string,
  role: string,
  branch_id: number,
  is_approved: boolean
): Promise<User> => {
  try {
    const [resultSets] = await sql.query(
      "CALL create_user(?, ?, ?, ?, ?)",
      [username, password_hash, role, branch_id, is_approved]
    );
    console.log("create_user result:", JSON.stringify(resultSets, null, 2));
    // CALL returns [ [rows], [extraMeta] ]
    const userRows = (resultSets as any)[0]; // first array = rows
    if (!userRows || userRows.length === 0) {
      throw new Error("User not created");
    }
    return userRows[0] as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update User
export const updateUserById = async (
  user_id: number,
  username: string,
  password_hash: string,
  role: string,
  branch_id: number,
  is_approved: boolean
): Promise<void> => {
  try {
    await sql.query("CALL update_user(?, ?, ?, ?, ?, ?)", [
      user_id,
      username,
      password_hash,
      role,
      branch_id,
      is_approved,
    ]);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUserById = async (user_id: number): Promise<void> => {
  try {
    await sql.query("CALL delete_user(?)", [user_id]);
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    throw error;
  }
};

export const restoreUserById = async (user_id: number): Promise<void> => {
  try {
    await sql.query("CALL restore_user(?)", [user_id]);
  } catch (error) {
    console.error("Error restoring user by ID:", error);
    throw error;
  }
};

// Get User By ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const [rows] = await sql.query("CALL get_user_by_id(?)", [id]);
    const user = (rows as any)[0][0] as User;
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Get All active Users (pagination)
export const getAllUser = async (
  count: number,
  offset: number
): Promise<User[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_users(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as User[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};


export const getActiveUserCount = async (): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_all_active_users_count()");
    return rows[0][0].user_count;
  } catch (error) {
    console.error("Error fetching count of active users:", error);
    throw error;
  }
};


// Get All Deleted Users (pagination)
export const getAllDeletedUser = async (
  count: number,
  offset: number
): Promise<User[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_deleted_users(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as User[];
  } catch (error) {
    console.error("Error fetching all deleted users:", error);
    throw error;
  }
};


export const getInActiveUserCount = async (): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_all_deleted_users_count()");
    return rows[0][0].user_count;
  } catch (error) {
    console.error("Error fetching count of deleted users:", error);
    throw error;
  }
};
