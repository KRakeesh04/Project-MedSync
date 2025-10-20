import type { Request, Response } from "express";
import { createInsuranceType, getAllInsuranceTypes, getInsuranceTypeCount, getInsuranceTypesForPagination, updateInsuranceType } from "../models/insurancetype.model.ts";

interface insuranceTypeNames {
  insurance_id: number,
  insurance_type: string,
}

export const createNewInsuranceType = async (req: Request, res: Response) => {
  let { insurance_type, insurance_period, claim_percentage } = req.body;
  try {
    await createInsuranceType(
      insurance_type,
      insurance_period,
      claim_percentage
    );
    return res.status(201).json({ message: "Insurance type created successfully" });
  } catch (error) {
    console.error("Error in createNewInsuranceType handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getInsuranceTypes = async (req: Request, res: Response) => {
  const { count, offset } = req.query;
  try {
    if (!count || !offset) {
      res.status(400).json({ error: "Params count & offset undefined" });
      return;
    }
    const insuranceTypes = await getInsuranceTypesForPagination(Number(count), Number(offset));
    if (insuranceTypes.length < 1) {
      res.status(404).json({ error: "Insurance types not found" });
      return;
    }
    const insurance_count: Number = await getInsuranceTypeCount();
    if (insurance_count == undefined) {
      console.log("error in finding the insurance count, count = " + insurance_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({
      insurance_count: insurance_count,
      insuranceTypes: insuranceTypes
    });
  } catch (error) {
    console.log("error in getInsuranceTypes handler: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  };
};

export const getAllInsuranceTypeNames = async (req: Request, res: Response) => {
  try {
    const insuranceTypes: insuranceTypeNames[] = await getAllInsuranceTypes();
    if (insuranceTypes.length < 1) {
      res.status(404).json({ error: "Insurance types not found" });
      return;
    }
    const insurance_count: Number = await getInsuranceTypeCount();
    if (insurance_count == undefined) {
      console.log("error in finding the insurance count, count = " + insurance_count);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    const mappedInsuranceTypes: insuranceTypeNames[] = insuranceTypes.map((i) => ({
      insurance_id: i.insurance_id,
      insurance_type: i.insurance_type,
    }));
    res.status(200).json({
      insurance_count: insurance_count,
      insuranceTypes: mappedInsuranceTypes
    });
  } catch (error) {
    console.log("error in getInsuranceTypes handler: ", error);
    res.status(500).json({ error: "Internal Server Error is here" });
  };
};

export const updateInsuranceTypeByID = async (req: Request, res: Response) => {
  const { insurance_type, insurance_period, claim_percentage } = req.body;
  const { id } = req.params;
  try {
    await updateInsuranceType(Number(id), insurance_type, insurance_period, claim_percentage);
    return res.status(200).json({ message: "Insurance type updated successfully" });
  } catch (error) {
    console.error("Error in updateBranchByID handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};