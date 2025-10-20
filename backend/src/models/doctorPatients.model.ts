import sql from "../db/db.ts";

export type DoctorPatientsOverview = {
  doctor_id: number;
  name: string;
  speciality?: string | null;
  patientsCount: number;
  lastVisit?: string | null;
  lastPatientName?: string | null;
  lastPatientId?: number | null;
};

export const getDoctorsPatientsOverview = async (): Promise<DoctorPatientsOverview[]> => {
  try {
    const [rows]: any = await sql.query("CALL get_doctors_patients_overview()");
    return (rows[0]) as DoctorPatientsOverview[];
  } catch (error) {
    console.error('Error fetching doctors patients overview:', error);
    throw error;
  }
};
