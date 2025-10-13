import sql from "../db/db.ts";

export interface Patient {
  patient_id: number,
  name: string,
  gender: string,
  emergency_contact_no: string,
  nic: string,
  address: string,
  date_of_birth: string,
  blood_type: string,
  branch_id: number,
  branch_name: string,
};

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
    console.error("Error creating new patient:", error);
    throw error;
  }
};

export const UpdatePatientByID = async (
  patient_id: number,
  fullname: string,
  gender: string,
  emergency_contact: string,
  nic: string,
  address: string,
  DOB: string,
  blood_type: string,
  isExPatient: boolean
): Promise<void> => {
  try {
    await sql.query(
      "CALL update_patient(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [patient_id, fullname, gender, emergency_contact, nic, address, DOB, blood_type, isExPatient]
    );
  } catch (error) {
    console.error("Error updating patient details:", error);
    throw error;
  }
};

export const dischargePatient = async (patient_id: number): Promise<void> => {
  try {
    await sql.query(
      "CALL discharge_patient(?)", [patient_id]);
  } catch (error) {
    console.error("Error discharge patient:", error);
    throw error;
  }
};

export const getPatientByID = async (id: number): Promise<Patient> => {
  try {
    const [rows] = await sql.query("CALL get_patient_by_id(?)", [id]);
    const patient = (rows as any)[0] as Patient;
    return patient;
  } catch (error) {
    console.error("Error fetching patient by id:", error);
    throw error;
  }
};

export const getAllPatients = async (
  count: number,
  offset: number,
  isExPatient: boolean,
  branch: number,
  blood_group: string,
  gender: string
): Promise<Patient[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_patients(?, ?, ?, ?, ?, ?)", [
      count,
      offset,
      isExPatient,
      branch,
      blood_group,
      gender
    ]);
    return (rows as any)[0] as Patient[];
  } catch (error) {
    console.error("Error fetching all patients:", error);
    throw error;
  }
};

export const getPatientsCount = async (
  isExPatient: boolean,
  branch: string,
  blood_group: string,
  gender: string
): Promise<Number> => {
  try {
    const [rows]: any = await sql.query("CALL get_patient_count(?, ?, ?, ?)", [
      isExPatient,
      Number(branch),
      blood_group,
      gender
    ]);
    return rows[0][0].patient_count;
  } catch (error) {
    console.error("Error fetching count of patients:", error);
    throw error;
  }
};