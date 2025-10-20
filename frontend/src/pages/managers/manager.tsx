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
import { getAllManagers, type BranchManager } from "@/services/managerServices";

const BranchManagerPage: React.FC = () => {
  const [manager, setManager] = useState<Array<BranchManager>>([]);
  const [managerCount, setManagerCount] = useState<number>(0);
  const [selectedManager, setSelectedManager] = useState<BranchManager | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [errorCode, setErrorCode] = useState<number | null>(null);
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

    fetchBranches();
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