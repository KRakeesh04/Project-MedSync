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
import toast from "react-hot-toast";
import { getAllBranches, type Branch } from "@/services/branchServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient } from "@/services/patientServices";

interface ViewPatientProps {
  isOpen: boolean;
  selectedPatient: Patient | null;
  onFinished: () => void;
  onClose: () => void;
}

const ViewPatient: React.FC<ViewPatientProps> = ({
  isOpen,
  selectedPatient,
  onFinished,
  onClose,
}) => {
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [branch, setBranch] = useState<number | "">("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // fetch branches
  useEffect(() => {
    getAllBranches()
      .then((res) => setBranches(res.branches))
      .catch(() => toast.error("Failed to load branches"));
  }, []);

  // populate patient details
  useEffect(() => {
    if (selectedPatient) {
      setFullname(selectedPatient.name);
      setGender(selectedPatient.gender);
      setBloodType(selectedPatient.blood_type);
      setBranch(branches.find((b) => b.name === selectedPatient.branch_name)?.branch_id || "");
      setIsEditing(false);
    }
  }, [selectedPatient, branches]);

  const handleUpdate = async () => {
    if (!selectedPatient) return;
    toast.loading("Updating patient...");

    try {
      const data = {
        patient_id: selectedPatient.patient_id,
        fullname,
        gender,
        blood_type: bloodType,
        branch_id: branch,
      };
      // TODO:.......................................................
      toast.success("Patient updated successfully.");
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to update patient.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the patient information below."
              : "Viewing patient details. Click edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" value={fullname} disabled={!isEditing} onChange={(e) => setFullname(e.target.value)} className="md:w-[50%]" />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {/* Gender */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="gender" value={gender} disabled />
              )}
            </div>

            {/* Blood Type */}
            <div className="grid gap-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              {isEditing ? (
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger id="bloodType" className="w-full">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="bloodType" value={bloodType} disabled />
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
                  value={branches.find((b) => b.branch_id === branch)?.name || ""}
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

export default ViewPatient;