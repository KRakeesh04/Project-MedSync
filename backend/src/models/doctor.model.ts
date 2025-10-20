import { hashPassword } from "../auth/hash.ts";
import sql from "../db/db.ts";

export interface Doctor {
  doctor_id: number;
  name: string;
  gender: string;
  branch_id: number;
  branch_name: string;
  fee_per_patient: number;
  basic_monthly_salary: number;
}

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

export const createDoctorByAdmin = async (
  fullname: string,
  gender: string,
  fee_per_patient: number,
  monthly_salary: number,
  branch_id: number,
  specialties: string[]
): Promise<void> => {
  try {
    const conn = await sql.getConnection();
    try {
      await conn.beginTransaction();

      // create_user signature: (p_username, p_password_hash, p_role, p_branch_id, p_is_approved)
      const username = nameFormatToUsername(fullname);
      const [createUserResult]: any = await conn.query(
        "CALL create_user(?, ?, ?, ?, ?)",
        [username, hashPassword(username + "_password"), "Doctor", branch_id, 0]
      );

      const userRow = Array.isArray(createUserResult) ? createUserResult[0] : createUserResult;
      const user_id = userRow && userRow.user_id ? userRow.user_id : (userRow && userRow[0] && userRow[0].user_id ? userRow[0].user_id : null);
      if (!user_id) {
        throw new Error('Failed to create user for doctor');
      }

      await conn.query(
        "CALL create_doctor(?, ?, ?, ?, ?)",
        [Number(user_id), fullname, gender, fee_per_patient, monthly_salary]
      );

      if (specialties && specialties.length > 0) {
        for (const specialty of specialties) {
          await conn.query(
            "CALL link_doctor_specialty(?, ?)",
            [Number(user_id), Number(specialty)]
          );
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error creating doctor by admin:", error);
    throw error;
  }
};

export const getAllDoctors = async (
  count: number,
  offset: number,
  branch: number
): Promise<Doctor[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_doctors(?, ?, ?)", [
      count,
      offset,
      branch
    ]);
    const doctors = (rows as any)[0] as Doctor[];
    return doctors;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

export const getAllDoctorsCount = async (branch: number): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_all_doctors_count(?)", [branch]);
    return rows[0][0].doctor_count;
  } catch (error) {
    console.error("Error fetching count of all doctors:", error);
    throw error;
  }
};

export const getDoctorById = async (doctor_id: number): Promise<Doctor> => {
  try {
    const [rows] = await sql.query("CALL get_doctor_by_id(?)", [doctor_id]);
    const doctors = (rows as any)[0] as Doctor[];
    if (doctors.length === 0 || !doctors[0]) {
      throw new Error("Doctor not found");
    }
    return doctors[0];
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    throw error;
  }
};

export const getAllDoctorsNames = async (): Promise<{ doctor_id: number; name: string }[]> => {
  try {
    const [rows] = await sql.query("SELECT doctor_id, name FROM doctor ORDER BY name");
    return (rows as any) as { doctor_id: number; name: string }[];
  } catch (error) {
    console.error("Error fetching doctor names:", error);
    throw error;
  }
};

export const updateDoctorById = async (
  doctor_id: number,
  fullname: string,
  gender: string,
  branch_id: number,
  fee_per_patient: number,
  monthly_salary: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL update_doctor_by_id(?, ?, ?, ?, ? ?)",
      [doctor_id, fullname, gender, branch_id, fee_per_patient, monthly_salary]
    );
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
};

function nameFormatToUsername(fullname: string): string {
  // Convert to lowercase, remove non-alphanumeric, replace spaces with underscores
  return fullname
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}
