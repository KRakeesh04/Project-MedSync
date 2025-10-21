import sql from "../db/db.ts";

export type BranchDailyAppointmentFilters = {
  start?: string;
  end?: string;
  branchId?: number;
  status?: string;
};

export const fetchBranchDailyAppointmentSummary = async (
  filters: BranchDailyAppointmentFilters = {}
): Promise<any[]> => {
  const { start, end, branchId, status } = filters;
  const conditions: string[] = [];
  const params: any[] = [];

  if (start && end) {
    conditions.push("appointment_date BETWEEN ? AND ?");
    params.push(start, end);
  }
  if (typeof branchId === "number") {
    conditions.push("branch_id = ?");
    params.push(branchId);
  }
  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await sql.query(
    `SELECT * FROM branch_daily_appointment_summary ${where} ORDER BY branch_id, appointment_date`,
    params
  );
  return (rows as any[]) ?? [];
};

export const fetchDoctorRevenueReport = async (): Promise<any[]> => {
  const [rows] = await sql.query(
    `SELECT * FROM doctor_revenue_report ORDER BY total_revenue DESC`
  );
  return (rows as any[]) ?? [];
};

export const fetchPatientsWithOutstandingBalances = async (): Promise<any[]> => {
  const [rows] = await sql.query(
    `SELECT * FROM patients_with_outstanding_balance ORDER BY remaining_payment_amount DESC`
  );
  return (rows as any[]) ?? [];
};

export const fetchTreatmentsPerCategory = async (): Promise<any[]> => {
  const [rows] = await sql.query(
    `SELECT * FROM treatments_per_category ORDER BY speciality_name, treatment_name`
  );
  return (rows as any[]) ?? [];
};

export const fetchInsuranceVsOutOfPocket = async (): Promise<any[]> => {
  const [rows] = await sql.query(
    `SELECT * FROM insurance_vs_out_of_pocket_report ORDER BY branch_name`
  );
  return (rows as any[]) ?? [];
};
