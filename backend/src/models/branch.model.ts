import sql from "../db/db.ts";

export interface Branch {
  branch_id: number,
  name: string,
  location: string,
  landline_no: string,
  created_at: string,
}

export const createBranch = async (
  branch_name: string,
  location: string,
  landline_no: string,
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_branch(?, ?, ?)",
      [branch_name, location, landline_no]
    );
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
};

export const updateBranch = async (
  branch_id: number,
  branch_name: string,
  location: string,
  landline_no: string,
): Promise<void> => {
  try {
    await sql.query(
      "CALL update_branch(?, ?, ?)",
      [branch_id, branch_name, location, landline_no]
    );
  } catch (error) {
    console.error("Error updating branch:", error);
    throw error;
  }
};

export const getBranchesForPagination = async (
  count: number,
  offset: number
): Promise<Branch[]> => {
  try {
    const [rows] = await sql.query("CALL get_branch_for_pagination(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as Branch[];
  } catch (error) {
    console.error("Error in get all branch for pagination:", error);
    throw error;
  }
};

export const getAllBranches = async (): Promise<Branch[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_branch()");
    return (rows as any)[0] as Branch[];
  } catch (error) {
    console.error("Error in get all branch for pagination:", error);
    throw error;
  }
};

export const getBranchCount = async (): Promise<number> => {
  try {
    const [rows]: any = await sql.query("CALL get_all_branch_count()");
    return rows[0][0].branch_count;
  } catch (error) {
    console.error("Error fetching branch count:", error);
    throw error;
  }
};