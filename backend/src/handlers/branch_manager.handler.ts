import type { Request, Response } from "express";
import * as model from "../models/branch_manager.model.ts";

export const getAllBranchManagers = async (req: Request, res: Response) => {
  try {
    const branchParam = req.query.branch as string | undefined;
    const branchFilter = branchParam ? Number(branchParam) : -1;
    let managers = await model.getAllBranchManagers();

    if (branchFilter && !Number.isNaN(branchFilter) && branchFilter > -1) {
      managers = managers.filter((m: any) => Number(m.branch_id) === branchFilter);
    }

    res.status(200).json({ managers, manager_count: Array.isArray(managers) ? managers.length : 0 });
  } catch (error) {
    console.error("Error in getAllBranchManagers handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createBranchManager = async (req: Request, res: Response) => {
  try {
    const { user_id, fullname, monthly_salary, gender } = req.body;
    if (!user_id || !fullname) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await model.createManager(Number(user_id), String(fullname), Number(monthly_salary || 0), String(gender || ""));
    res.status(201).json({ message: "Branch manager created" });
  } catch (error) {
    console.error("Error in createBranchManager handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBranchManager = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullname, monthly_salary, gender } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing manager id" });
    }

    await model.updateBranchManagerById(Number(id), String(fullname || ""), Number(monthly_salary || 0), String(gender || ""));
    res.status(200).json({ message: "Branch manager updated" });
  } catch (error) {
    console.error("Error in updateBranchManager handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};