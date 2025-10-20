import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllBranches, type Branch } from "@/services/branchServices";
import { updateManagerDetails, type BranchManager } from "@/services/managerServices";

interface ViewManagerProps {
  isOpen: boolean;
  selectedManager: BranchManager | null;
  onFinished: () => void;
  onClose: () => void;
}

const ViewBranchManager: React.FC<ViewManagerProps> = ({
  isOpen,
  selectedManager,
  onFinished,
  onClose,
}) => {
  const [managerUserId, setManagerUserId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [branch, setBranch] = useState<number | "">("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [monthlySalary, setMonthlySalary] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // fetch branches
  useEffect(() => {
    getAllBranches()
      .then((res) => setBranches(res.branches))
      .catch(() => toast.error("Failed to load branches"));
  }, []);

  // populate user details
  useEffect(() => {
    if (selectedManager) {
      setManagerUserId(selectedManager.manager_id.toString());
      setName(selectedManager.name);
      setGender(selectedManager.gender);
      setBranch(selectedManager.branch_id ?? "");
      setMonthlySalary(String(selectedManager.monthly_salary));
      setIsEditing(false);
    }
  }, [selectedManager]);

  const handleUpdate = async () => {
    if (!selectedManager) return;
    const loadingId = toast.loading("Updating branch manager...");

    try {
      const data = {
        manager_id: selectedManager.manager_id,
        name: name,
        gender: gender,
        branch_id: branch,
        monthly_salary: monthlySalary,
      };
      const response = await updateManagerDetails(data);
      toast.success(response.message || "Manager details updated successfully.");
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to update manager details.");
    } finally {
      toast.dismiss(loadingId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Branch Manager Details</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the Branch Manager information below."
              : "Viewing Branch Manager details. Click edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* name */}
          <div className="grid gap-2">
            <Label htmlFor="name">User ID</Label>
            <Input id="name" value={managerUserId} disabled className="md:w-[50%]" />
          </div>

          <div className="grid gap-4 py-2">
            {/* Name */}
            <div className="grid gap-2 w-full">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} disabled={!isEditing} onChange={(e) => setName(e.target.value)} className="md:w-[50%]" />
            </div>

            <div className="grid md:grid-cols-2 gap-2">

              {/* Branch */}
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                {isEditing ? (
                  <Select
                    value={branch?.toString() || ""}
                    onValueChange={(val) => setBranch(Number(val))}
                  >
                    <SelectTrigger id="branch" className="w-full">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.branch_id} value={b.branch_id.toString()}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="branch"
                    value={
                      branches.find((b) => b.branch_id === branch)?.name ||
                      selectedManager?.branch_name ||
                      ""
                    }
                    disabled
                  />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              {/* Monthly Salary */}
              <div className="grid gap-2">
                <Label htmlFor="monthly_salary">Monthly Salary</Label>
                <Input
                  id="monthly_salary"
                  value={monthlySalary}
                  disabled={!isEditing}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                />
              </div>

              {/* Gender */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select
                    value={gender?.toString() || ""}
                    onValueChange={(val) => setGender(val)}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder={selectedManager?.gender} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="Male" value="Male">Male</SelectItem>
                      <SelectItem key="Female" value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="gender"
                    value={selectedManager?.gender}
                    disabled
                  />
                )}
              </div>
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

export default ViewBranchManager;