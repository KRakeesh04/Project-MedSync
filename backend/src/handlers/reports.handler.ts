import type { Request, Response } from "express";
import {
  fetchBranchDailyAppointmentSummary,
  fetchDoctorRevenueReport,
  fetchInsuranceVsOutOfPocket,
  fetchPatientsWithOutstandingBalances,
  fetchTreatmentsPerCategory,
} from "../models/reports.model.ts";

function toCsv(rows: any[]): string {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    if (val == null) return "";
    const s = String(val);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape((row as any)[h])).join(","));
  }
  return lines.join("\n");
}

export const getBranchDailyAppointmentSummaryCsv = async (req: Request, res: Response) => {
  try {
    const { start, end, branchId, status } = req.query;
    const filters: any = {};
    if (typeof start === "string") filters.start = start;
    if (typeof end === "string") filters.end = end;
    if (typeof branchId === "string" && branchId) filters.branchId = Number(branchId);
    if (typeof status === "string") filters.status = status;
    const rows = await fetchBranchDailyAppointmentSummary(filters);
    const csv = toCsv(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=branch_daily_appointment_summary.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating branch daily appointment summary CSV:", error);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
};

export const getDoctorRevenueReportCsv = async (_req: Request, res: Response) => {
  try {
    const rows = await fetchDoctorRevenueReport();
    const csv = toCsv(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=doctor_revenue_report.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating doctor revenue CSV:", error);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
};

export const getPatientsWithOutstandingBalancesCsv = async (_req: Request, res: Response) => {
  try {
    const rows = await fetchPatientsWithOutstandingBalances();
    const csv = toCsv(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=patients_with_outstanding_balances.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating outstanding balances CSV:", error);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
};

export const getTreatmentsPerCategoryCsv = async (_req: Request, res: Response) => {
  try {
    // Note: current view does not include date columns to filter on. Returns overall counts.
    const rows = await fetchTreatmentsPerCategory();
    const csv = toCsv(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=treatments_per_category.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating treatments per category CSV:", error);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
};

export const getInsuranceVsOutOfPocketCsv = async (_req: Request, res: Response) => {
  try {
    const rows = await fetchInsuranceVsOutOfPocket();
    const csv = toCsv(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=insurance_vs_out_of_pocket.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating insurance vs out-of-pocket CSV:", error);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
};
