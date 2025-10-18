import type { Request, Response } from "express";
import { getAllMedicalHistories, getMedicalHistoriesByPatientId } from "../models/medicalhistory.model.ts";



export const getMedicalHistoryHandler = async (req: Request, res: Response) => {
    try {
        const histories = await getAllMedicalHistories();
        return res.status(200).json({ histories });
    } catch (error) {
        console.error("Error in getMedicalHistoryHandler:", error);
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