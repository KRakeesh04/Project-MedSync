import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import toast from "@/lib/toast";
import type { Branch } from "@/services/branchServices";
import { deleteBranch } from "@/services/branchServices";
import { hasAnyRole } from "@/services/roleGuard";
import { Role } from "@/services/utils";

interface BranchViewProps {
  isOpen: boolean;
  selectedBranch: Branch | null;
  onClose: () => void;
  onFinished: () => void;
}

export default function BranchView({ isOpen, selectedBranch, onClose, onFinished }: BranchViewProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isSuperAdmin = hasAnyRole([Role.SUPER_ADMIN]);

  if (!selectedBranch) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBranch.name}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">Branch ID: {selectedBranch.branch_id}</p>
            <p className="text-sm text-muted-foreground">Location: {selectedBranch.location}</p>
            <p className="text-sm text-muted-foreground">Landline: {selectedBranch.landline_no || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Created: {selectedBranch.created_at}</p>
          </div>
          <DialogFooter>
            <div className="flex justify-between w-full">
              {isSuperAdmin && (
                <Button variant="ghost" onClick={() => setConfirmDelete(true)}>Delete</Button>
              )}
              <Button onClick={onClose}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isSuperAdmin && (
        <AlertDialog open={confirmDelete} onOpenChange={() => setConfirmDelete(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete branch</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete "{selectedBranch.name}"? This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel onClick={() => setConfirmDelete(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                if (!selectedBranch) return;
                setDeleting(true);
                try {
                  await deleteBranch(selectedBranch.branch_id);
                  toast.success('Branch deleted');
                  setConfirmDelete(false);
                  onClose();
                  onFinished();
                } catch (err: any) {
                  const msg = err instanceof Error ? err.message : String(err);
                  toast.error(`Delete failed: ${msg}`);
                } finally {
                  setDeleting(false);
                }
              }} className={`bg-destructive text-white ${deleting ? 'opacity-60 pointer-events-none' : ''}`}>Delete</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
