import sql from "../db/db.ts";


export const createPatient = async (
  patient_id: number,
  fullname: string,
  gender: string,
  emergency_contact: string,
  nic: string,
  address: string,
  DOB: string,
  blood_type: string,
): Promise<void> => {
  try {
    await sql.query(
      "CALL create_patient(?, ?, ?, ?, ?, ?, ?, ?)",
      [patient_id, fullname, gender, emergency_contact, nic, address, DOB, blood_type]
    );
  } catch (error) {
    console.error("Error creating branch manager:", error);
    throw error;
  }
};