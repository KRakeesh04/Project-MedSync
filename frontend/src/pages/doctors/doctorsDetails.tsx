import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { createTimer, formatSalary, Role } from "@/services/utils";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getAllBranches } from "../../services/branchServices";
import { LOCAL_STORAGE__ROLE, LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";
import { getAllDoctors, type Doctor } from "@/services/doctorServices";
import { Link } from "react-router-dom";



const DoctorsDetails: React.FC = () => {
  const [Doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [doctorCount, setDoctorCount] = useState<number>(0);
  // View/edit dialog is not used currently; remove related state to avoid unused warnings
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
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

  const columns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "doctor_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Doctor ID
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
      accessorKey: "fee_per_patient",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Fee Per Patient
        </Button>
      ),
      cell: ({ row }) => formatSalary(Number(row.original.fee_per_patient)),
    },
    {
      accessorKey: "basic_monthly_salary",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Monthly Salary
        </Button>
      ),
      cell: ({ row }) => formatSalary(Number(row.original.basic_monthly_salary)),
    },
    // Actions column removed (no view dialog wired up yet)
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(-1);

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: Doctors,
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
    const loadingId = toast.loading("Loading...");

    try {
      const response = await Promise.allSettled([
        getAllDoctors(
          itemsPerPage,
          (page - 1) * itemsPerPage,
          userRole === Role.SUPER_ADMIN
            ? (selectedBranch === "All" ? "-1" : selectedBranch)
            : userBranchId
        ),
        createTimer(500),
      ]);

      if (response[0].status === "rejected") {
        throw response[0].reason;
      }

      setDoctors(response[0].value.doctors);
      setDoctorCount(response[0].value.doctor_count);
      setPageCount(Math.ceil(response[0].value.doctor_count / itemsPerPage));
      setErrorCode(null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorCode(404);
      } else {
        toast.error("Failed to fetch doctors");
      }
    } finally {
      toast.dismiss(loadingId);
    }
  }, [table, selectedBranch]);

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
  }, [fetchStaff, pagination, selectedBranch, errorCode]);
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-lg font-medium">All Doctors</h2>
        <p className="text-sm text-muted-foreground">{doctorCount} items</p>
      </div>


      {/* <ViewDoctor
        isOpen={action === "edit" && selectedDoctor !== null}
        selectedDoctor={selectedDoctor}
        onFinished={fetchStaff}
        onClose={() => {
          setAction(null);
          setSelectedDoctor(null);
        }}
      /> */}

      <div className="grid gap-4 grid-cols-6 mb-4">
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
        <div className="flex justify-between items-center mb-4 place-self-end col-span-5">
          {userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER ? (
            <Link to="/doctors/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                + Add New Doctor
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
      <DataTable table={table} errorCode={errorCode} />
    </div >
  );
};

export default DoctorsDetails;