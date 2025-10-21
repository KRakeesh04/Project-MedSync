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

export const UpdateStaff = async (
  staff_id: number,
  name: string,
  type: string,
  branch_id: number,
  gender: string,
  monthly_salary: number,
): Promise<void> => {
  try {
    await sql.query(
      "CALL   update_staff(?, ?, ?, ?, ?, ?)",
      [staff_id, name, type, branch_id, gender, monthly_salary]
    );
  } catch (error) {
    console.error("Error updating staff details:", error);
    throw error;
  }
};

export const getAllStaffForPagination = async (
  count: number,
  offset: number,
  role: string,
  branch: string
): Promise<Staff[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_staff(?, ?, ?, ?)", [
      count,
      offset,
      role,
      branch
    ]);
    return (rows as any)[0] as Staff[];
  } catch (error) {
    console.error("Error fetching all staff with filters:", error);
    throw error;
  }
};

export const getStaffCount = async (
  role: string,
  branch: string
): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_staff_count(?, ?)",[
      role,
      Number(branch)
    ]);
    return rows[0][0].staff_count;
  } catch (error) {
    console.error("Error fetching count of staff:", error);
    throw error;
  }
};

export const getTotalStaffsCount = async (): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_total_staffs_count()");
    if (Array.isArray(rows)) {
      const firstRow = Array.isArray(rows[0]) ? rows[0][0] : rows[0];
      if (firstRow && typeof firstRow.staffs_count !== "undefined") {
        return firstRow.staffs_count;
      }
      if (firstRow && typeof firstRow.staff_count !== "undefined") {
        return firstRow.staff_count;
      }
    }
    if (rows && typeof rows.staffs_count !== "undefined") {
      return rows.staffs_count;
    }
    if (rows && typeof rows.staff_count !== "undefined") {
      return rows.staff_count;
    }
    return 0 as Number;
  } catch (error) {
    console.error("Error fetching total count of staffs:", error);
    throw error;
  } 
};