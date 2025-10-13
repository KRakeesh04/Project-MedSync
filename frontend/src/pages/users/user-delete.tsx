import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {  deleteUser, type User } from "@/services/userService";

interface DeleteUserProps {
  isOpen: boolean;
  selectedUser: User | null;
  onFinished: () => void;
  onClose: () => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ isOpen, selectedUser, onFinished, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    toast.loading("Deleting user...");

    try {
      const response = await deleteUser(selectedUser.user_id)
      toast.success(`${response} : "${selectedUser.username}"` || `User "${selectedUser.username}" deleted successfully.`);
      onFinished();
      onClose();
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      toast.dismiss();
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedUser?.username}</span>?  
            This user data will move to deleted users table.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUser;
