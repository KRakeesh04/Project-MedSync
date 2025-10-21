import React, { useCallback, useEffect, useState } from "react";
import { Eye, MapPin, PhoneCall, Trash } from "lucide-react";
import BranchView from "./branch-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { getBranchesForPagination, createBranch, type Branch } from "@/services/branchServices";
import toast from "@/lib/toast";
import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { Role } from "@/services/utils";

const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Array<Branch>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [action, setAction] = useState<"view" | null>(null);

  // add dialog state
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [landline, setLandline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // role-based UI visibility
  const role = (typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE__ROLE)) || "";
  const isSuperAdmin = role === Role.SUPER_ADMIN;

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBranchesForPagination();
      setBranches(res.branches || []);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !location.trim()) {
      toast.warning("Please provide name and location");
      return;
    }
    setSubmitting(true);
    try {
      await createBranch({ name: name.trim(), location: location.trim(), landline_no: landline.trim() });
      toast.success("Branch created");
      setName("");
      setLocation("");
      setLandline("");
      setOpenAdd(false);
      await fetchBranches();
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Create failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
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
        <div className="text-center">
          <div className="text-red-500 mb-3">Error: {error}</div>
          <div className="flex justify-center gap-2 mb-6">
            <Button onClick={fetchBranches}>Retry</Button>
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
      <div className="md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">All Branches</h2>
          <p className="text-sm text-muted-foreground">{branches.length} items</p>
        </div>

        {isSuperAdmin ? (
          <div className="flex items-center gap-3 md:pt-5 place-content-end">
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">+ Add New Branch</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Add New Branch</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch name</label>
                    <input
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g. Main Clinic"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="City, Street"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Landline</label>
                    <input
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Optional"
                      value={landline}
                      onChange={(e) => setLandline(e.target.value)}
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
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => (
          <article key={b.branch_id} className="bg-card p-4 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all">
            <div>
              <h3 className="text-base font-semibold">{b.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex place-content-center gap-2">
                <MapPin className="size-4" />
                {b.location}
              </p>
              <p className="mt-2 text-sm text-muted-foreground flex place-content-center gap-2">
                <PhoneCall className="size-4" />
                {b.landline_no}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>#{b.branch_id}</div>
              <div className="flex items-center gap-3">
                <Button size="icon" variant="outline" onClick={() => { setSelectedBranch(b); setAction("view"); }}>
                  <Eye />
                </Button>
                {isSuperAdmin ? (
                  <Button size="icon" variant="destructive" onClick={() => { setSelectedBranch(b); setAction("view"); }}>
                    <Trash />
                  </Button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      <BranchView
        isOpen={action === "view" && selectedBranch !== null}
        selectedBranch={selectedBranch}
        onClose={() => { setAction(null); setSelectedBranch(null); }}
        onFinished={fetchBranches}
      />
    </div>
  );
};

export default Branches;