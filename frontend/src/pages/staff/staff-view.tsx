import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllBranches, type Branch } from "@/services/branchServices";
import { StaffRoles } from "../Authentication/staff-sign-up";
import { editStaff, type Staff } from "@/services/staffServices";
import { Role } from "@/services/utils";

interface ViewStaffProps {
  isOpen: boolean;
  selectedStaff: Staff | null;
  onFinished: () => void;
  onClose: () => void;
}

const ViewStaff: React.FC<ViewStaffProps> = ({ isOpen, selectedStaff, onFinished, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState("");

  // fetch branches
  useEffect(() => {
    getAllBranches()
      .then((res) => setBranches(res.branches))
      .catch(() => toast.error("Failed to load branches"));
  }, []);

  // populate staff details
  useEffect(() => {
    if (selectedStaff) {
      setName(selectedStaff.name);
      setRole(selectedStaff.type);
      setBranch(selectedStaff.branch_id ?? "");
      setGender(selectedStaff.gender);
      setMonthlySalary(String(selectedStaff.monthly_salary));
      setIsEditing(false);
    }
  }, [selectedStaff]);

  const handleUpdate = async () => {
    if (!selectedStaff) return;
    toast.loading("Updating staff...");

    try {
      const data = {
        staff_id: selectedStaff.staff_id,
        name: name,
        type: role,
        branch_id: branch,
        gender: gender,
        monthly_salary: monthlySalary,
      };
      const response = await editStaff(data);
      toast.success(response.message || "Staff updated successfully.");
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to update staff.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the staff information below."
              : "Viewing staff details. Click edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} disabled={!isEditing} onChange={(e) => setName(e.target.value)} className="md:w-[50%]" />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              {isEditing ? (
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {StaffRoles
                      .filter((r) =>
                        ![
                          Role.PATIENT,
                          Role.DOCTOR,
                          Role.BRANCH_MANAGER,
                          Role.SUPER_ADMIN
                        ].includes(r.value))
                      .map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="role"
                  value={StaffRoles.find((r) => r.value === role)?.label || role}
                  disabled
                />
              )}
            </div>

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
                    selectedStaff?.branch_name ||
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
                    <SelectValue placeholder={selectedStaff?.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="Male" value="Male">Male</SelectItem>
                    <SelectItem key="Female" value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="gender"
                  value={selectedStaff?.gender}
                  disabled
                />
              )}
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

export default ViewStaff;