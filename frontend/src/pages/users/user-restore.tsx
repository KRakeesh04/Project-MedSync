import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { restoreDeletedUser, type User } from "@/services/userService";

interface UndoDeleteUserProps {
  isOpen: boolean;
  selectedUser: User | null;
  onFinished: () => void;
  onClose: () => void;
}

const UndoDeleteUser: React.FC<UndoDeleteUserProps> = ({
  isOpen,
  selectedUser,
  onFinished,
  onClose,
}) => {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleUndoDelete = async () => {
    if (!selectedUser) return;
    setIsRestoring(true);
    toast.loading("Restoring user...");

    try {
      const response = await restoreDeletedUser(selectedUser.user_id)
      toast.success(`${response} : "${selectedUser.username}"` || `User "${selectedUser.username}" restored successfully.`);
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to restore user.");
    } finally {
      toast.dismiss();
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore User</DialogTitle>
          <DialogDescription>
            Are you sure you want to restore{" "}
            <span className="font-semibold">{selectedUser?.username}</span>?  
            This user will be moved back to the active users list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRestoring}>
            Cancel
          </Button>
          <Button onClick={handleUndoDelete} disabled={isRestoring}>
            {isRestoring ? "Restoring..." : "Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UndoDeleteUser;
