import type { Request, Response } from "express";
import {
  createBillingInvoice,
  updateBillingInvoiceBypayment,
  deleteBillingInvoice,
  getAllBillingInvoices,
  getAllOutstandingBills,
  type BillingInvoice
} from "../models/billing_invoice.model.ts";

// Create a new billing invoice
export const createNewBillingInvoice = async (req: Request, res: Response) => {
  const { appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount } = req.body;
  try {
    const invoice = await createBillingInvoice(
      appointment_id,
      additional_fee,
      total_fee,
      claim_id,
      net_amount,
      remaining_payment_amount
    );
    res.status(200).json({ message: "Billing invoice created successfully", invoice });
  } catch (error) {
    console.error("Error in createNewBillingInvoice handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update billing invoice
export const updateCurrentBillingInvoiceByPayment = async (req: Request, res: Response) => {
  const { invoice_id, additional_fee, total_fee, net_amount, remaining_payment_amount } = req.body;
  try {
    const invoice = await updateBillingInvoiceBypayment (
      invoice_id,
      additional_fee,
      
    );
    res.status(200).json({ message: "Billing invoice updated successfully", invoice });
  } catch (error) {
    console.error("Error in updateCurrentBillingInvoice handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete billing invoice
export const deleteBillingInvoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteBillingInvoice(Number(id));
    res.status(200).json({ message: "Billing invoice deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBillingInvoiceById handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all billing invoices
export const getAllBillingInvoicesHandler = async (_req: Request, res: Response) => {
  try {
    const invoices = await getAllBillingInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error in getAllBillingInvoicesHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all outstanding billing invoices
export const getAllOutstandingBillsHandler = async (_req: Request, res: Response) => {
  try {
    const invoices = await getAllOutstandingBills();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error in getAllOutstandingBillsHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

