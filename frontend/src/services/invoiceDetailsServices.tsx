import axiosInstance from "@/axiosConfig";

export interface BillingInvoice {
  appointment_id: number;
  additional_fee: number;
  total_fee: number;
  claim_id: number;
  net_amount: number;
  remaining_payment_amount: number;
  time_stamp: string;
}

export const getAllOutstandingBills = async (): Promise<BillingInvoice[]> => {
  try {
    const response = await axiosInstance.get<BillingInvoice[]>(`/outstanding-bills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all billing payments:", error);
    throw error;
  }
};

export const getAllBillingInvoices = async (): Promise<BillingInvoice[]> => {
  try {
    const response = await axiosInstance.get<BillingInvoice[]>(`/billing-invoices`);  
     
    return response.data;
  } catch (error) {
    console.error("Error fetching all billing payments:", error);
    throw error;
  }
};