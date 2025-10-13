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