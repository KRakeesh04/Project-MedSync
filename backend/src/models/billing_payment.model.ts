import sql from "../db/db.ts"; 
export interface BillingPayment {
  payment_id: number;
  invoice_id: number;
  branch_id: number;
  paid_amount: number;
  cashier_id: number;
  time_stamp: string;
}

export const createBillingPayment = async (
  invoice_id: number,
  branch_id: number,
  paid_amount: number,
  cashier_id: number
): Promise<void> => {
  try {
    
    const [rows] = await sql.query(
      "CALL create_billing_payment(?, ?, ?, ?)",
      [invoice_id, branch_id, paid_amount, cashier_id]
    );
    
  } catch (error) {
    console.error("Error creating billing payment:", error);
    throw error;
  }
};




export const updateBillingPayment = async (
  payment_id: number,
  paid_amount: number
): Promise<BillingPayment> => {
  try {
    const [rows] = await sql.query(
      "CALL update_billing_payment(?, ?)",
      [payment_id, paid_amount]
    );
    const payment = (rows as any)[0][0] as BillingPayment;
    if (!payment) throw new Error("Billing payment not updated");
    return payment;
  } catch (error) {
    console.error("Error updating billing payment:", error);
    throw error;
  }
};


export const deleteBillingPayment = async (payment_id: number): Promise<void> => {
  try {
    await sql.query("CALL delete_billing_payment(?)", [payment_id]);
  } catch (error) {
    console.error("Error deleting billing payment:", error);
    throw error;
  }
};

export const getBillingPaymentById = async (payment_id: number): Promise<BillingPayment | null> => {
  try {
    const [rows] = await sql.query("CALL get_billing_payment_by_id(?)", [payment_id]);
    const payment = (rows as any)[0][0] as BillingPayment;
    if (!payment) return null;
    return payment;
  } catch (error) {
    console.error("Error fetching billing payment by ID:", error);
    throw error;
  }
};

export const getAllBillingPayments = async (): Promise<BillingPayment[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_billing_payments()");
    return (rows as any)[0] as BillingPayment[];
  } catch (error) {
    console.error("Error fetching all billing payments:", error);
    throw error;
  }
};

// Get billing payments by invoice_id
export const getBillingPaymentsByInvoiceId = async (invoice_id: number): Promise<BillingPayment[]> => {
  try {
    const [rows] = await sql.query("CALL get_billing_payments_by_invoice_id(?)", [invoice_id]);
    return (rows as any)[0] as BillingPayment[];
  } catch (error) {
    console.error("Error fetching billing payments by invoice_id:", error);
    throw error;
  }
};