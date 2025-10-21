import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { getAllSpecialities, addSpeciality, updateSpeciality, deleteSpeciality, type Speciality } from "@/services/specialityServices";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { hasAnyRole } from "@/services/roleGuard";
import { Role } from "@/services/utils";

export default function SpecialityPage() {
  const canManage = hasAnyRole([Role.BRANCH_MANAGER, Role.SUPER_ADMIN]);
  const isSuperAdmin = hasAnyRole([Role.SUPER_ADMIN]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [viewing, setViewing] = useState<Speciality | null>(null);
  const [editing, setEditing] = useState<Speciality | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Speciality | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSpecialities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSpecialities();
      const items = (data && (data as any).specialities) ? (data as any).specialities : (data as any);
      setSpecialities(items || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const total = specialities.length;
  const gridColsClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.warning("Please provide both name and description.");
      return;
    }
    setSubmitting(true);
    try {
      await addSpeciality({ speciality_name: name.trim(), description: description.trim() });
      toast.success("Speciality added successfully.");
      setName("");
      setDescription("");
      setOpenAdd(false);
      await fetchSpecialities();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Add failed: ${msg}`);
      console.error("Failed to add speciality:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <PageTitle title="Specialities | MedSync" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <PageTitle title="Specialities | MedSync" />

        <div className="text-center">
          <div className="text-red-500 mb-3">Error: {error}</div>
          <div className="flex justify-center gap-2 mb-6">
            <Button onClick={fetchSpecialities}>Retry</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">All Specialities</h2>
          <p className="text-sm text-muted-foreground">{total} items</p>
        </div>

        {canManage && (
          <div className="flex place-content-end gap-3 md:pt-5">
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">+ Add New Speciality</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Add New Speciality</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Speciality name</label>
                    <Input
                      placeholder="e.g. Cardiology"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      placeholder="Short description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={4}
                    />
                  </div>

                  <DialogFooter>
                    <div className="flex justify-end gap-2 w-full">
                      <Button type="button" variant="ghost" onClick={() => setOpenAdd(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Card grid */}
      <div className={gridColsClass}>
        {specialities.map((s) => (
          <article
            key={s.speciality_id}
            className="bg-card p-4 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all"
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold">{s.speciality_name}</h3>
                {canManage && (
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8">⋯</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom">
                        <DropdownMenuItem onClick={() => setViewing(s)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditing(s)}>Edit</DropdownMenuItem>
                        {isSuperAdmin && (
                          <DropdownMenuItem onClick={() => setConfirmDelete(s)} className="text-destructive">Delete</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-4">{s.description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>#{s.speciality_id}</div>
              <div className="flex items-center gap-3">
                <Link to={`/doctors/specialities`} className="text-primary hover:underline">
                  {`doctors' list`}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {specialities.length === 0 && (
        <div className="p-6 text-center rounded-md border border-dashed">
          <p className="mb-3">No specialities found.</p>
          {canManage && (
            <Button onClick={() => setOpenAdd(true)}>Add the first speciality</Button>
          )}
        </div>
      )}

      {/* View dialog */}
      {canManage && (
        <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewing?.speciality_name}</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <p className="text-sm text-muted-foreground">{viewing?.description}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewing(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit dialog */}
      {canManage && (
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Edit Speciality</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editing) return;
                setSubmitting(true);
                try {
                  await updateSpeciality(editing.speciality_id, { speciality_name: editing.speciality_name, description: editing.description });
                  toast.success("Updated successfully");
                  setEditing(null);
                  await fetchSpecialities();
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  toast.error(`Update failed: ${msg}`);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Speciality name</label>
                <Input value={editing?.speciality_name || ""} onChange={(e) => setEditing(editing ? { ...editing, speciality_name: e.target.value } : null)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={4} value={editing?.description || ""} onChange={(e) => setEditing(editing ? { ...editing, description: e.target.value } : null)} />
              </div>

              <DialogFooter>
                <div className="flex justify-end gap-2 w-full">
                  <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirm alert */}
      {isSuperAdmin && (
        <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete speciality</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete "{confirmDelete?.speciality_name}"? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel onClick={() => setConfirmDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                if (!confirmDelete) return;
                setDeletingId(confirmDelete.speciality_id);
                try {
                  await deleteSpeciality(confirmDelete.speciality_id);
                  toast.success("Deleted successfully");
                  setConfirmDelete(null);
                  await fetchSpecialities();
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  toast.error(`Delete failed: ${msg}`);
                } finally {
                  setDeletingId(null);
                }
              }} className={`bg-destructive text-white ${deletingId ? 'opacity-60 pointer-events-none' : ''}`}>Delete</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}