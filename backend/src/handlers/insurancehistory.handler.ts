import type { Request, Response } from "express";
import { getAllInsuranceHistories } from "../models/insurancehistory.model.ts";



export const getInsuranceHistoryHandler = async (req: Request, res: Response) => {
    try {
        const histories = await getAllInsuranceHistories();
        return res.status(200).json({ histories });
    } catch (error) {
        console.error("Error in getInsuranceHistoryHandler:", error);
        return res.status(500).json({ message: "Failed to fetch insurance histories" });
    }
};