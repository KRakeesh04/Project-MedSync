import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { createTimer, formatSalary, Role } from "@/services/utils";
import { Eye, Trash } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getAllBranches } from "../../services/branchServices";
import { LOCAL_STORAGE__USER, LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { Navigate } from "react-router-dom";
import ViewBranchManager from "./manager-view";
import { getAllManagers } from "@/services/managerServices";
import type { BranchManager } from "@/services/managerServices";
import { getBranchesWithoutManager, addBranchManager } from "@/services/managerServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useRef } from 'react';

const BranchManagerPage: React.FC = () => {
  const [manager, setManager] = useState<Array<BranchManager>>([]);
  const [managerCount, setManagerCount] = useState<number>(0);
  const [selectedManager, setSelectedManager] = useState<BranchManager | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [availableBranchesForCreate, setAvailableBranchesForCreate] = useState<Array<{ branch_id: number; name: string }>>([]);
  const [createForm, setCreateForm] = useState({ name: '', gender: '', monthly_salary: '' });
  const [selectedCreateBranch, setSelectedCreateBranch] = useState<number | null>(null);
  const createDataFetchedRef = useRef(false);
  const user = localStorage.getItem(LOCAL_STORAGE__USER)
  const role = localStorage.getItem(LOCAL_STORAGE__ROLE) || "";
  const isSuperAdmin = role === Role.SUPER_ADMIN;
  const isBranchManager = role === Role.BRANCH_MANAGER;

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const fetchStaff = useCallback(async () => {
    const loadingId = toast.loading("Loading...");

    try {
      const response = await Promise.allSettled([
        getAllManagers(
          (selectedBranch == "All")
            ? -1
            : Number(selectedBranch)
        ),
        createTimer(300),
      ]);

      if (response[0].status === "rejected") {
        throw response[0].reason;
      }

      setManager(response[0].value.managers);
      setManagerCount(response[0].value.manager_count);
      setErrorCode(null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorCode(404);
      } else {
        toast.error("Failed to fetch branch managers");
      }
    } finally {
      toast.dismiss(loadingId);
    }
  }, [selectedBranch]);

  function nameFormatToUsername(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_");
  }

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        const mappedBranches = data.branches.map((b: { branch_id: number; name: string }) => ({
          value: String(b.branch_id),
          label: b.name,
        }));
        setBranches(mappedBranches);
      } catch {
        toast.error("Failed to load branches");
      }
    };

    const fetchCreateData = async () => {
      try {
        if (createDataFetchedRef.current) return;
        const brRes = await getBranchesWithoutManager();
        const branchesRaw: Array<{ branch_id: number; name: string; location?: string }> = brRes.branches || [];
        // deduplicate by branch_id in case of accidental duplicates
        const unique = Array.from(new Map(branchesRaw.map((b) => [b.branch_id, b])).values()) as { branch_id: number; name: string; location?: string }[];
        setAvailableBranchesForCreate(unique);
        createDataFetchedRef.current = true;
      } catch (err) {
        console.error('Failed to load branches for create', err);
      }
    };

    fetchBranches();
    fetchCreateData();
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, selectedBranch, errorCode]);

  return (
    <div className="space-y-6 p-4">
      <ViewBranchManager
        isOpen={action === "edit" && selectedManager !== null}
        selectedManager={selectedManager}
        onFinished={fetchStaff}
        onClose={() => {
          setAction(null);
          setSelectedManager(null);
        }}
      />
      <div>
        <h2 className="text-lg font-medium">All Branch Managers</h2>
        <p className="text-sm text-muted-foreground">{managerCount} items</p>
      </div>

      <div className="flex items-center justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">New Branch Manager</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
                <DialogTitle>New Branch Manager</DialogTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  <div>Default credentials (preview):</div>
                  <div className="mt-1 font-mono text-xs">username: {createForm.name ? nameFormatToUsername(createForm.name) : '<name_here>'}</div>
                  <div className="font-mono text-xs">password: {createForm.name ? `${nameFormatToUsername(createForm.name)}_password` : '<name_here>_password'}</div>
                </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bm-name">Full Name</Label>
                <input id="bm-name" className="w-full rounded border px-3 py-2" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bm-gender">Gender</Label>
                  <Select onValueChange={(val) => setCreateForm({ ...createForm, gender: val })}>
                    <SelectTrigger id="bm-gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="bm-branch">Branch</Label>
                  <Select onValueChange={(val) => setSelectedCreateBranch(Number(val))}>
                    <SelectTrigger id="bm-branch" className="w-full">
                      <SelectValue placeholder="Select branch (only branches without manager)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {availableBranchesForCreate.map(b => (
                        <SelectItem key={b.branch_id} value={String(b.branch_id)}>{b.name} (#{b.branch_id})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="bm-salary">Monthly Salary</Label>
                <input id="bm-salary" type="number" className="w-full rounded border px-3 py-2" value={createForm.monthly_salary} onChange={(e) => setCreateForm({ ...createForm, monthly_salary: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={async () => {
                  if (!createForm.name || !createForm.gender || !selectedCreateBranch) {
                    toast.error('Please fill required fields');
                    return;
                  }
                  try {
                    await addBranchManager({ name: createForm.name, gender: createForm.gender, monthly_salary: Number(createForm.monthly_salary || 0), branch_id: Number(selectedCreateBranch) });
                    toast.success('Branch manager created');
                    setCreateOpen(false);
                    setCreateForm({ name: '', gender: '', monthly_salary: '' });
                    setSelectedCreateBranch(null);
                    await fetchStaff();
                  } catch (err) {
                    toast.error('Failed to create branch manager');
                  }
                }}>Create</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-6 mb-4">
        <div className="grid gap-2">
          <Label>Branch</Label>
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
          >
            <SelectTrigger id="branch" className="w-full">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="All">
                All
              </SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {manager.map((m) => (
          <article key={m.manager_id} className="bg-card p-4 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all">
            <div>
              <h3 className="text-base font-semibold">{m.name}</h3>
              {isSuperAdmin ? (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">Branch: {m.branch_name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Salary: {formatSalary(Number(m.monthly_salary))}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Gender: {m.gender}</p>
                </>
              ) : isBranchManager ? (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">Branch: {m.branch_name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Gender: {m.gender}</p>                </>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>#{m.manager_id}</div>
              <div className="flex items-center gap-3">
                {isSuperAdmin ? (
                  <>
                    <Button size="icon" variant="outline" onClick={() => { setSelectedManager(m); setAction("edit"); }}>
                      <Eye />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => { /* TODO: delete action if needed */ }}>
                      <Trash />
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

};

export default BranchManagerPage;