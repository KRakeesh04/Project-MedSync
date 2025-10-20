import type { Request, Response } from "express";
import { getMonthlyRevenue } from "../models/billingpayment.model.ts";

export const getMonthlyRevenueHandler = async (req: Request, res: Response) => {
    try {
        const monthlyRevenue = await getMonthlyRevenue('2025-01-01', '2025-12-31');
        res.status(200).json(monthlyRevenue);
    } catch (error) {
        console.error("Error in getMonthlyRevenueHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};