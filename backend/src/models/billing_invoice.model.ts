import sql from "../db/db.ts";

export interface BillingInvoice {
  appointment_id: number;
  additional_fee: number;
  total_fee: number;
  claim_id: number;
  net_amount: number;
  remaining_payment_amount: number;
  time_stamp: string; 
}

export const createBillingInvoice = async (
  appointment_id: number,
  additional_fee: number,
  total_fee: number,
  claim_id: number,
  net_amount: number,
  remaining_payment_amount: number
): Promise<BillingInvoice> => {
  try {
    const [rows] = await sql.query(
      "CALL create_billing_invoice(?, ?, ?, ?, ?, ?)",
      [
        appointment_id,
        additional_fee,
        total_fee,
        claim_id,
        net_amount,
        remaining_payment_amount
      ]
    );
    const invoice = (rows as any)[0][0] as BillingInvoice;
    if (!invoice) throw new Error("Billing invoice not created");
    return invoice;
  } catch (error) {
    console.error("Error creating billing invoice:", error);
    throw error;
  }
};


export const updateBillingInvoiceBypayment = async (
  invoice_id: number,
  payment: number,
  
): Promise<void> => {
  try {
    const [rows] = await sql.query(
      "CALL update_billing_invoice_bypayment (?, ?)",
      [
        invoice_id,
        payment
      ]
    );
    
  } catch (error) {
    console.error("Error updating billing invoice:", error);
    throw error;
  }
};

export const deleteBillingInvoice = async (invoice_id: number): Promise<void> => {
  try {
    await sql.query("CALL delete_billing_invoice(?)", [invoice_id]);
  } catch (error) {
    console.error("Error deleting billing invoice:", error);
    throw error;
  }
};

export const getAllBillingInvoices = async (): Promise<BillingInvoice[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_billing_invoices()");
    return (rows as any)[0] as BillingInvoice[];
  } catch (error) {
    console.error("Error fetching all billing invoices:", error);
    throw error;
  }
};

export const getAllOutstandingBills = async (): Promise<BillingInvoice[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_outstanding_bills ()");
    return (rows as any)[0] as BillingInvoice[];
  } catch (error) {
    console.error("Error fetching all billing invoices:", error);
    throw error;
  }
};