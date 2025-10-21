import axiosInstance from "@/axiosConfig";

export type BranchDailyFilters = {
  start?: string;
  end?: string;
  branchId?: number;
  status?: string;
};

function triggerDownload(blob: Blob, fallbackFilename: string, contentDisposition?: string | null) {
  let filename = fallbackFilename;
  if (contentDisposition) {
    const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition);
    const enc = match?.[1];
    const plain = match?.[2];
    if (enc) filename = decodeURIComponent(enc);
    else if (plain) filename = plain;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const downloadBranchDailyAppointmentsCsv = async (filters: BranchDailyFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.start && filters.end) {
    params.set("start", filters.start);
    params.set("end", filters.end);
  }
  if (typeof filters.branchId === "number") params.set("branchId", String(filters.branchId));
  if (filters.status) params.set("status", filters.status);
  const url = `/reports/branch-daily-appointments.csv${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await axiosInstance.get(url, { responseType: "blob" });
  triggerDownload(res.data, "branch_daily_appointment_summary.csv", res.headers["content-disposition"]);
};

export const downloadDoctorRevenueCsv = async () => {
  const res = await axiosInstance.get(`/reports/doctor-revenue.csv`, { responseType: "blob" });
  triggerDownload(res.data, "doctor_revenue_report.csv", res.headers["content-disposition"]);
};

export const downloadOutstandingBalancesCsv = async () => {
  const res = await axiosInstance.get(`/reports/outstanding-balances.csv`, { responseType: "blob" });
  triggerDownload(res.data, "patients_with_outstanding_balances.csv", res.headers["content-disposition"]);
};

export const downloadTreatmentsPerCategoryCsv = async () => {
  const res = await axiosInstance.get(`/reports/treatments-per-category.csv`, { responseType: "blob" });
  triggerDownload(res.data, "treatments_per_category.csv", res.headers["content-disposition"]);
};

export const downloadInsuranceVsOutOfPocketCsv = async () => {
  const res = await axiosInstance.get(`/reports/insurance-vs-out-of-pocket.csv`, { responseType: "blob" });
  triggerDownload(res.data, "insurance_vs_out_of_pocket.csv", res.headers["content-disposition"]);
};
