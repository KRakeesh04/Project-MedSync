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
import { editUser, type User } from "@/services/userService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "../Authentication/staff-sign-up";
import { Switch } from "@/components/ui/switch";
import { getAllBranches, type Branch } from "@/services/branchServices";

interface ViewUserProps {
  isOpen: boolean;
  selectedUser: User | null;
  onFinished: () => void;
  onClose: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({
  isOpen,
  selectedUser,
  onFinished,
  onClose,
}) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState<number | "">("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // fetch branches
  useEffect(() => {
    getAllBranches()
      .then((res) => setBranches(res.branches))
      .catch(() => toast.error("Failed to load branches"));
  }, []);

  // populate user details
  useEffect(() => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setRole(selectedUser.role);
      setBranch(selectedUser.branch_id ?? ""); // map to branch_id 
      setIsApproved(selectedUser.is_approved);
      setIsEditing(false);
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    if (!selectedUser) return;
    toast.loading("Updating user...");

    try {
      const data = {
        user_id: selectedUser.user_id,
        role: role,
        branch_id: branch,
        is_approved: isApproved,
      };
      const response = await editUser(data);
      toast.success(response.message || "User updated successfully.");
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to update user.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the user information below."
              : "Viewing user details. Click edit to make changes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Username */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} disabled className="md:w-[50%]" />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              {isEditing ? (
                <Select value={role} onValueChange={setRole} >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue
                      placeholder="Select role"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Roles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="role"
                  value={Roles.find((r) => r.value === role)?.label || role}
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
                    selectedUser?.branch_name ||
                    ""
                  }
                  disabled
                />
              )}
            </div>
          </div>


          {/* Approved */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="is_approved">Approved</Label>
            <Switch
              id="is_approved"
              checked={isApproved}
              onCheckedChange={setIsApproved}
              disabled={!isEditing}
            />
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

export default ViewUser;