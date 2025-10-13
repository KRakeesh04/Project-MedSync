import type { Request, Response } from "express";
import { createPatient, dischargePatient, getAllPatients, getPatientByID, getPatientsCount, UpdatePatientByID, type Patient } from "../models/patient.model.ts";


// export const createNewPatient = async (req: Request, res: Response) => {
//   let { patient_id, fullname, gender, emergency_contact, nic, address, DOB, blood_type } = req.body;
//   try {
//     await createPatient(
//       patient_id,
//       fullname,
//       gender,
//       emergency_contact,
//       nic,
//       address,
//       DOB,
//       blood_type
//     );
//     res.status(200).json({ message: "Patient created sucessfully" });
//   } catch (error) {
//     console.error("Error in createNewPatient handler:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


export const updateCurrentPatientDetails = async (req: Request, res: Response) => {
  let { patient_id, fullname, gender, emergency_contact, nic, address, DOB, blood_type } = req.body;
  try {
    await UpdatePatientByID(
      patient_id,
      fullname,
      gender,
      emergency_contact,
      nic,
      address,
      DOB,
      blood_type,
      false,
    );
    res.status(200).json({ message: "Patient updated sucessfully" });
  } catch (error) {
    console.error("Error in updateCurrentPatientDetails handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const dischargePatientByID = async (req: Request, res: Response) => {
  let { id } = req.params;
  try {
    await dischargePatient(Number(id));
    res.status(200).json({ message: "Patient updated sucessfully" });
  } catch (error) {
    console.error("Error in dischargePatientByID handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  const { isExPatient, count, offset, branch, bloodGroup, gender } = req.query;
  try {
    if (!count || !offset || !isExPatient || !branch || !bloodGroup || !gender) {
      res.status(400).json({ error: "Params count, offset, isExPatient, branch, bloodGroup or gender undefined" });
      return;
    }
    const patients: Patient[] = await getAllPatients(
      Number(count),
      Number(offset),
      Boolean(parseInt(String(isExPatient))),
      Number(branch),
      String(bloodGroup),
      String(gender)
    );
    if (patients.length < 1) {
      res.status(404).json({ error: "Patients not found" });
      return;
    }
    const patient_count: Number = await getPatientsCount(
      Boolean(isExPatient),
      String(branch),
      String(bloodGroup),
      String(gender)
    );
    if (patient_count == undefined) {
      console.log("error in finding the patient count, count = " + patient_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      patient_count: patient_count,
      patients: patients
    });
  } catch (error) {
    console.log("Error in getPatients handler: ", error)
    res.status(500).json({ error: "Internal Server Error" });
  };
};