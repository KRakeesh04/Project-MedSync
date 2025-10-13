import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createTimer, formatRole, formatSalary, Role } from "@/services/utils";
import { Eye } from "lucide-react";
import { getStaffDataForPagination, type Staff } from "@/services/staffServices";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getAllBranches } from "../../services/branchServices";
import { StaffRoles } from "../Authentication/staff-sign-up";
import ViewStaff from "@/pages/staff/staff-view";
import { LOCAL_STORAGE__ROLE, LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";



const StaffPage: React.FC = () => {
  const [Staff, setStaff] = useState<Array<Staff>>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  // const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const user = localStorage.getItem(LOCAL_STORAGE__USER)
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  const userRole = localStorage.getItem(LOCAL_STORAGE__ROLE);
  const userData = JSON.parse(user);
  const userBranchId = String(userData.branch_id);

  const [selectedBranch, setSelectedBranch] = useState<string>(
    userRole === Role.BRANCH_MANAGER ? userBranchId : "All"
  );

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "staff_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Staff ID
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Name
        </Button>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Role
        </Button>
      ),
      cell: ({ row }) => formatRole(row.original.type),
    },
    {
      accessorKey: "branch_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Branch
        </Button>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Gender
        </Button>
      ),
    },
    {
      accessorKey: "monthly_salary",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Monthly Salary
        </Button>
      ),
      cell: ({ row }) => formatSalary(Number(row.original.monthly_salary)),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedStaff(row.original);
              setAction("edit");
            }}
          >
            <Eye />
          </Button>
        );
      },
    },
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(-1);

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: Staff,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    pageCount,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  const fetchStaff = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    toast.loading("Loading...");

    try {
      const response = await Promise.allSettled([
        getStaffDataForPagination(
          itemsPerPage,
          (page - 1) * itemsPerPage,
          String(selectedRole),
          userRole === Role.SUPER_ADMIN
            ? (selectedBranch === "All" ? "-1" : selectedBranch)
            : userBranchId
        ),
        createTimer(500),
      ]);

      if (response[0].status === "rejected") {
        throw response[0].reason;
      }

      setStaff(response[0].value.staff);
      setPageCount(Math.ceil(response[0].value.staff_count / itemsPerPage));
      setErrorCode(null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorCode(404);
      } else {
        toast.error("Failed to fetch staff");
      }
    } finally {
      toast.dismiss();
    }
  }, [table, selectedRole, selectedBranch]);

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
  }, [fetchStaff, pagination, selectedRole, selectedBranch, errorCode]);
  return (
    <>
      <ViewStaff
        isOpen={action === "edit" && selectedStaff !== null}
        selectedStaff={selectedStaff}
        onFinished={fetchStaff}
        onClose={() => {
          setAction(null);
          setSelectedStaff(null);
        }}
      />
      <div className="grid gap-4 grid-cols-6 mb-4">
        <div className="grid gap-2">
          <Label>Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="All">
                All
              </SelectItem>

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
        </div>

        <div className="grid gap-2">
          <Label>Branch</Label>
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
            disabled={userRole === Role.BRANCH_MANAGER}
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
      <DataTable table={table} errorCode={errorCode} />
    </>
  );
};

export default StaffPage;