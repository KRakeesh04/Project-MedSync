import sql from "../db/db.ts";

export interface DoctorSpeciality {
  doctor_id: number;
  doctor_name: string;
  speciality_id: number;
  speciality_name: string;
  description: string;
  added_at: string;
};

export const getAllDoctorSpeciality = async (): Promise<DoctorSpeciality[]> => {
  try {
    const [rows] = await sql.execute("CALL get_all_doctor_speciality()");
    return (rows as any)[0] as DoctorSpeciality[];
  } catch (error) {
    console.error('Error fetching doctor specialities:', error);
    throw new Error('Database error');
  }
};

export const addDoctorSpeciality = async (doctor_id: number, speciality_id: number): Promise<void> => {
  try {
    await sql.query("CALL link_doctor_specialty(?, ?)", [doctor_id, speciality_id]);
  } catch (error) {
    console.error('Error linking doctor speciality:', error);
    throw error;
  }
};