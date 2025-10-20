import type { Request, Response } from "express";
import { createBranch, getAllBranches, getBranchCount, getBranchesForPagination, updateBranch, type Branch } from "../models/branch.model.ts";


interface BranchNames {
  branch_id: number,
  name: string,
}

export const createNewBranch = async (req: Request, res: Response) => {
  let { name, location, landline_no } = req.body;
  try {
    await createBranch(
      name,
      location,
      landline_no,
    );
    return res.status(201).json({ message: "Branch created successfully" });
  } catch (error) {
    console.error("Error in createNewBranch handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBranches = async (req: Request, res: Response) => {
  // const { count, offset } = req.query;
  try {
    // if (!count || !offset) {
    //   res.status(400).json({ error: "Params count & offset undefined" });
    //   return;
    // }
    // const branches: Branch[] = await getBranchesForPagination(Number(count), Number(offset));
    const branches: Branch[] = await getAllBranches();
    if (branches.length < 1) {
      res.status(404).json({ error: "Branches not found" });
      return;
    }
    const branch_count: Number = await getBranchCount();
    if (branch_count == undefined) {
      console.log("error in finding the branch count, count = " + branch_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (branch_count != branches.length) {
      console.log("branch count and length mismatch, count = " + branch_count + " length = " + branches.length);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      branch_count: branch_count,
      branches: branches
    });
  } catch (error) {
    console.log("error in getBranches handler: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  };
};

export const getAllBranchNames = async (req: Request, res: Response) => {
  try {
    const branches: Branch[] = await getAllBranches();
    if (branches.length < 1) {
      res.status(404).json({ error: "Branches not found" });
      return;
    }
    const branch_count: Number = await getBranchCount();
    if (branch_count == undefined) {
      console.log("error in finding the branch count, count = " + branch_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    const mappedBranches: BranchNames[] = branches.map((b) => ({
      branch_id: b.branch_id,
      name: b.name,
    }));
    res.status(200).json({
      branch_count: branch_count,
      branches: mappedBranches
    });
  } catch (error) {
    console.log("error in getBranches handler: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  };
};

export const updateBranchByID = async (req: Request, res: Response) => {
  const { branch_name, location, landline_no } = req.body;
  const { id } = req.params;
  try {
    await updateBranch(Number(id), branch_name, location, landline_no);
    return res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("Error in updateBranchByID handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchTotalBranchesCount = async (req: Request, res: Response) => {
  try {
    const branch_count: number = await getBranchCount();
    if (branch_count == undefined) {
      console.log("error in finding the branch count, count = " + branch_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({ total_count: branch_count });
  } catch (error) {
    console.error("Error in fetchTotalBranchesCount handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
