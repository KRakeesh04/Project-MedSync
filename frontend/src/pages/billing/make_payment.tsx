import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createBillingPayment } from "@/services/billing_paymentServices";

const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const [invoiceId, setInvoiceId] = useState<number | "">("");
  const [branchId, setBranchId] = useState<number | "">("");
  const [paidAmount, setPaidAmount] = useState<number | "">("");
  const [cashierId, setCashierId] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId || !branchId || !paidAmount || !cashierId) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await createBillingPayment({
        invoice_id: Number(invoiceId),
        branch_id: Number(branchId),
        paid_amount: Number(paidAmount),
        cashier_id: Number(cashierId),
      });
      toast.success("Payment successful!");
      navigate("/payments"); // redirect after success (change path as needed)
    } catch (error: any) {
      toast.error(error?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Card className="w-full max-w-[96vw] md:max-w-[450px]">
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
          <CardDescription>
            Fill in the payment details to complete the transaction.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/invoices")} // example navigation
            >
              View Invoices
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMakePayment} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="invoiceId">Invoice ID</Label>
              <Input
                id="invoiceId"
                type="number"
                placeholder="Enter invoice ID"
                value={invoiceId}
                onChange={(e) => setInvoiceId(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branchId">Branch ID</Label>
              <Input
                id="branchId"
                type="number"
                placeholder="Enter branch ID"
                value={branchId}
                onChange={(e) => setBranchId(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paidAmount">Paid Amount</Label>
              <Input
                id="paidAmount"
                type="number"
                placeholder="Enter paid amount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cashierId">Cashier ID</Label>
              <Input
                id="cashierId"
                type="number"
                placeholder="Enter cashier ID"
                value={cashierId}
                onChange={(e) => setCashierId(Number(e.target.value))}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={handleMakePayment}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Make Payment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MakePayment;
