import type { Request, Response } from "express";
import {
  createBillingPayment,
  updateBillingPayment,
  deleteBillingPayment,
  getBillingPaymentById,
  getAllBillingPayments,
  getBillingPaymentsByInvoiceId,
  type BillingPayment
} from "../models/billing_payment.model.ts";
import { updateBillingInvoiceBypayment } from "../models/billing_invoice.model.ts";

// Create a new billing payment
export const createNewBillingPayment = async (req: Request, res: Response) => {
  const { invoice_id, branch_id, paid_amount, cashier_id } = req.body;
  try {
    const payment = await createBillingPayment(
      invoice_id,
      branch_id,
      paid_amount,
      cashier_id
    );
    res.status(200).json({ message: "Billing payment created successfully", payment });
  } catch (error) {
    console.error("Error in createNewBillingPayment handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update billing payment
export const updateCurrentBillingPayment = async (req: Request, res: Response) => {
  const { payment_id, paid_amount } = req.body;
  try {
    const payment = await updateBillingPayment(payment_id, paid_amount);
    res.status(200).json({ message: "Billing payment updated successfully", payment });
  } catch (error) {
    console.error("Error in updateCurrentBillingPayment handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete billing payment
export const deleteBillingPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteBillingPayment(Number(id));
    res.status(200).json({ message: "Billing payment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBillingPaymentById handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get billing payment by ID
export const getBillingPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const payment = await getBillingPaymentById(Number(id));
    if (!payment) {
      res.status(404).json({ error: "Billing payment not found" });
      return;
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error in getBillingPayment handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all billing payments
export const getAllBillingPaymentsHandler = async (_req: Request, res: Response) => {
  try {
    const payments = await getAllBillingPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error in getAllBillingPaymentsHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get billing payments by invoice_id
export const getBillingPaymentsByInvoice = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;
  try {
    const payments = await getBillingPaymentsByInvoiceId(Number(invoice_id));
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error in getBillingPaymentsByInvoice handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};