// services/billingPaymentService.ts
import axiosInstance from "@/axiosConfig";

export interface BillingPayment {
  payment_id: number;
  invoice_id: number;
  branch_id: number;
  paid_amount: number;
  cashier_id: number;
  time_stamp: string;
}

// Create Billing Payment
export const createBillingPayment = async (data: {
  invoice_id: number;
  branch_id: number;
  paid_amount: number;
  cashier_id: number;
}): Promise<{ message: string; payment?: BillingPayment }> => {
  try {
    
    const response = await axiosInstance.post(`/billing-payment`, data);
   
    
    return response.data;
  } catch (error) {
    console.error("Error creating billing payment:", error);
    throw error;
  }
};

// Update Billing Payment
export const updateBillingPayment = async (payment_id: number, paid_amount: number): Promise<{ message: string; payment?: BillingPayment }> => {
  try {
    const response = await axiosInstance.put(`/billing-payment/${payment_id}`, { paid_amount });
    return response.data;
  } catch (error) {
    console.error("Error updating billing payment:", error);
    throw error;
  }
};

// Delete Billing Payment
export const deleteBillingPayment = async (payment_id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/billing-payment/${payment_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting billing payment:", error);
    throw error;
  }
};

// Get Billing Payment by ID
export const getBillingPaymentById = async (payment_id: number): Promise<BillingPayment> => {
  try {
    const response = await axiosInstance.get<BillingPayment>(`/billing-payment/${payment_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching billing payment:", error);
    throw error;
  }
};

// Get All Billing Payments
export const getAllBillingPayments = async (): Promise<BillingPayment[]> => {
  try {
    const response = await axiosInstance.get<BillingPayment[]>(`/billing-payments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all billing payments:", error);
    throw error;
  }
};

// Get Billing Payments by Invoice ID
export const getBillingPaymentsByInvoiceId = async (invoice_id: number): Promise<BillingPayment[]> => {
  try {
    const response = await axiosInstance.get<BillingPayment[]>(`/billing-payments/invoice/${invoice_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching billing payments by invoice:", error);
    throw error;
  }
};