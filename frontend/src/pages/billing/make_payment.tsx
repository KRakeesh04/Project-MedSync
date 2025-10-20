
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
import toast from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { createBillingPayment } from "@/services/billing_paymentServices";
import { LOCAL_STORAGE__USER_ID, LOCAL_STORAGE__USERNAME } from '@/services/authServices';

const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const [invoiceId, setInvoiceId] = useState<number | "">("");
  const [branchId, setBranchId] = useState<number | "">("");
  const [cashierId, setCashierId] = useState<string | "">(localStorage.getItem(LOCAL_STORAGE__USER_ID) ?? "");
  const [cashierName] = useState<string | null>(localStorage.getItem(LOCAL_STORAGE__USERNAME));
  const [paidAmount, setPaidAmount] = useState<number | "">("");
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
      //navigate("/payments"); // redirect after success (change path as needed)
    } catch (error: any) {
      toast.error(error?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-dvh pt-12">
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
              onClick={() => navigate("/invoice_details")} // example navigation
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
                min={0}
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
              <Label htmlFor="cashierId">Cashier ID</Label>
              <Input
                id="cashierId"
                type="text"
                placeholder="Cashier ID"
                value={cashierId}
                disabled
                className="bg-slate-50"
              />
              {cashierName && <div className="text-sm text-muted-foreground">Logged in as: {cashierName}</div>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paidAmount">Paid Amount</Label>
              <Input
                id="paidAmount"
                type="number"
                placeholder="Enter paid amount"
                value={paidAmount}
                min={0}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
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
