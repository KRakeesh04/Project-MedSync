import type { Request, Response } from "express";
import { getAllStaffForPagination, getStaffCount, UpdateStaff, type Staff } from "../models/staff.model.ts";


export const updateStaffByID = async (req: Request, res: Response) => {
  let { name, type, branch_id, gender, monthly_salary } = req.body;
  let { id } = req.params;
  try {
    await UpdateStaff(
      Number(id),
      name,
      type,
      branch_id,
      gender,
      monthly_salary,
    );
    res.status(200).json({ message: "Staff detail updated sucessfully" });
  } catch (error) {
    console.error("Error in updateStaffByID handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllStaff = async (req: Request, res: Response) => {
  const { count, offset, role, branch } = req.query;
  try {
    const staff: Staff[] = await getAllStaffForPagination(
      Number(count),
      Number(offset),
      role as string,
      branch as string
    );
    if (staff.length < 1) {
      res.status(404).json({ error: "Staff not found" });
      return;
    }
    const staff_count: Number = await getStaffCount(
      role as string,
      branch as string
    );
    if (staff_count == undefined) {
      console.log("error in finding the staff count, count = " + staff_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      staff_count: staff_count,
      staff: staff,
    });
  } catch (error) {
    console.error("Error in getAllStaff handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};