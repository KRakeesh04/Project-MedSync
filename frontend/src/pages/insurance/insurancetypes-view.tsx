import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "@/lib/toast";
import { editInsurance, type InsuranceTypes } from "@/services/insuranceService";

interface ViewInsuranceProps {
  isOpen: boolean;
  selectedInsurance: InsuranceTypes | null;
  onFinished: () => void;
  onClose: () => void;
}

const ViewInsurance: React.FC<ViewInsuranceProps> = ({ isOpen, selectedInsurance, onFinished, onClose }) => {
  const [insuranceType, setInsuranceType] = useState("");
  const [insurancePeriod, setInsurancePeriod] = useState<number | "">("");
  const [claimPercentage, setClaimPercentage] = useState<number | "">("");
  const [isEditing, setIsEditing] = useState(false);

  // populate insurance details
  useEffect(() => {
    if (selectedInsurance) {
      setInsuranceType(selectedInsurance.insurance_type);
      setInsurancePeriod(
        typeof selectedInsurance.insurance_period === "string"
          ? Number(selectedInsurance.insurance_period)
          : selectedInsurance.insurance_period ?? ""
      );
      setClaimPercentage(selectedInsurance.claim_percentage ?? "");
      setIsEditing(false);
    }
  }, [selectedInsurance]);

  const handleUpdate = async () => {
    if (!selectedInsurance) return;
    const loadingId = toast.loading("Updating insurance type...");

    try {
      const data = {
        insurance_id: selectedInsurance.insurance_id,
        insurance_type: insuranceType,
  insurance_period: Number(insurancePeriod),
        claim_percentage: Number(claimPercentage),
      };
      const response = await editInsurance(data);
      toast.success(response.message || "Insurance type updated successfully.");
      onFinished();
      onClose();
    } catch (_error) {
      toast.error("Failed to update insurance type.");
    } finally {
      toast.dismiss(loadingId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insurance Type Details</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the insurance type information below."
              : "Viewing insurance type details. Click edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Insurance Type */}
          <div className="grid gap-2">
            <Label htmlFor="insurance_type">Insurance Type</Label>
            <Input
              id="insurance_type"
              value={insuranceType}
              disabled={!isEditing}
              onChange={(e) => setInsuranceType(e.target.value)}
              className="md:w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {/* Insurance Period */}
            <div className="grid gap-2">
              <Label htmlFor="insurance_period">Insurance Period</Label>
              <Input
                id="insurance_period"
                type="number"
                value={insurancePeriod?.toString()}
                disabled={!isEditing}
                onChange={(e) => {
                  const v = e.target.value;
                  setInsurancePeriod(v === "" ? "" : Number(v));
                }}
              />
            </div>

            {/* Claim Percentage */}
            <div className="grid gap-2">
              <Label htmlFor="claim_percentage">Claim Percentage</Label>
              <Input
                id="claim_percentage"
                type="number"
                value={claimPercentage?.toString()}
                disabled={!isEditing}
                onChange={(e) => {
                  const v = e.target.value;
                  setClaimPercentage(v === "" ? "" : Number(v));
                }}
              />
            </div>
          </div>

        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInsurance;