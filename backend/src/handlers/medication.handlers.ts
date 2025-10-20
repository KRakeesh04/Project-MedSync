import type { Request, Response } from "express";
import { getAllMedications, getMedicationsByPatientId, getMedicationsPaginated, getMedicationsCount } from "../models/medication.model.ts";

export const getAllMedicationsHandler = async (_req: Request, res: Response) => {
  try {
    const medications = await getAllMedications();
    return res.status(200).json({ medications });
  } catch (error) {
    console.error("Error in getAllMedicationsHandler:", error);
    return res.status(500).json({ message: "Failed to fetch medications" });
  }
};



export const getMedicationsByPatientHandler = async (req: Request, res: Response) => {
  try {
    const patientId = Number(req.params.patientId);

    if (!req.params.patientId || !Number.isInteger(patientId)) {
      return res.status(400).json({ message: "patientId must be an integer" });
    }

    const medications = await getMedicationsByPatientId(patientId);
    return res.status(200).json({ medications });
  } catch (error) {
    console.error("Error in getMedicationsByPatientHandler:", error);
    return res.status(500).json({ message: "Failed to fetch medications for the given patient" });
  }
};

export const getMedicationsHandler = async (req: Request, res: Response) => {
  const { count, offset, branch } = req.query;
  try {
    if (count === undefined || offset === undefined || branch === undefined) {
      return res.status(400).json({ message: "Params count, offset or branch undefined" });
    }

    const cnt = Number(count);
    const off = Number(offset);
    const br = Number(branch);
    if (!Number.isInteger(cnt) || !Number.isInteger(off) || !Number.isInteger(br)) {
      return res.status(400).json({ message: "count, offset and branch must be integers" });
    }

    const medications = await getMedicationsPaginated(cnt, off, br);
    // if (medications === null) {
    //   return res.status(500).json({ message: "Failed to fetch medications" });
    // }
    const total_count = await getMedicationsCount(br);
    if (total_count === null) {
      return res.status(500).json({ message: "Failed to fetch medications count" });
    }
    if (total_count != medications.length && medications.length === 0) {
      return res.status(500).json({ message: "Mismatch in medications count" });
    }
    return res.status(200).json({
      medications: medications,
      medication_count: total_count
    });
  } catch (error) {
    console.error("Error in getMedicationsHandler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};