import type { Request, Response } from "express";
import { getAllMedicalHistories, getMedicalHistoriesByPatientId, getMedicalHistoriesPaginated, getMedicalHistoriesCount } from "../models/medicalhistory.model.ts";



export const getMedicalHistoryHandler = async (req: Request, res: Response) => {
  try {
    const histories = await getAllMedicalHistories();
    return res.status(200).json({ histories });
  } catch (error) {
    console.error("Error in getMedicalHistoryHandler:", error);
    return res.status(500).json({ message: "Failed to fetch medical histories" });
  }
};

export const getMedicalHistoriesHandler = async (req: Request, res: Response) => {
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

    const histories = await getMedicalHistoriesPaginated(cnt, off, br);
    const total_count = await getMedicalHistoriesCount(br);

    return res.status(200).json({ histories, total_count });
  } catch (error) {
    console.error("Error in getMedicalHistoriesHandler:", error);
    return res.status(500).json({ message: "Failed to fetch medical histories" });
  }
};

export const getMedicalHistoriesByPatientHandler = async (req: Request, res: Response) => {
  try {
    // /patients/:patientId/medications 
    const raw = (req.params.patientId ?? req.query.patientId) as string | undefined;
    const patientId = Number(raw);

    if (!raw || !Number.isInteger(patientId)) {
      return res.status(400).json({ message: "patientId must be an integer" });
    }

    const histories = await getMedicalHistoriesByPatientId(patientId);
    return res.status(200).json({ histories });
  } catch (error) {
    console.error("Error in getMedicalHistoriesByPatientHandler:", error);
    return res.status(500).json({ message: "Failed to fetch medical histories for the given patient" });
  }
};