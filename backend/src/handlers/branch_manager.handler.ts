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

export const addNewBranchManager = async (req: Request, res: Response) => {
  try {
    const { name, gender, monthly_salary, branch_id } = req.body;
    if (!name || !gender || !branch_id) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    await model.createManagerByAdmin(String(name), String(gender), Number(monthly_salary || 0), Number(branch_id));
    return res.status(201).json({ message: 'Branch manager added successfully' });
  } catch (error) {
    console.error('Error adding branch manager by admin:', error);
    return res.status(500).json({ error: 'Failed to add branch manager' });
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

export const getAvailableManagerCandidatesHandler = async (req: Request, res: Response) => {
  try {
    const candidates = await model.getAvailableManagerCandidates();
    res.status(200).json({ candidate_count: candidates.length, candidates });
  } catch (error) {
    console.error('Error in getAvailableManagerCandidatesHandler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBranchesWithoutManagerHandler = async (req: Request, res: Response) => {
  try {
    const branches = await model.getBranchesWithoutManager();
    res.status(200).json({ branch_count: branches.length, branches });
  } catch (error) {
    console.error('Error in getBranchesWithoutManagerHandler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const assignManagerToBranchHandler = async (req: Request, res: Response) => {
  try {
    const { manager_id, branch_id, fullname, monthly_salary, gender } = req.body;
    if (!manager_id || !branch_id || !fullname) {
      return res.status(400).json({ error: 'manager_id, branch_id and fullname are required' });
    }

    // create branch manager entry
    await model.createManager(Number(manager_id), String(fullname), Number(monthly_salary || 0), String(gender || ''));

    // update user's branch_id
    await model.assignUserToBranch(Number(manager_id), Number(branch_id));

    res.status(201).json({ message: 'Manager assigned to branch successfully' });
  } catch (error) {
    console.error('Error in assignManagerToBranchHandler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};