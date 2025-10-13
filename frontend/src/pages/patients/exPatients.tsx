import React, { useEffect, useState, useCallback } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { getAllBranches } from "@/services/branchServices";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import ViewPatient from "./patient-view";
import { getPatients, type Patient } from "@/services/patientServices";
import { Label } from "@/components/ui/label";
import { createTimer } from "@/services/utils";
import { Eye } from "lucide-react";


const ExPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("All");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [errorCode, setErrorCode] = useState<number | null>(null);


  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "patient_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Patient ID
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
          Full Name
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
      accessorKey: "emergency_contact_no",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Emergency ContactNo
        </Button>
      ),
    },
    {
      accessorKey: "nic",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          NIC
        </Button>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Address
        </Button>
      ),
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Date Of Birth
        </Button>
      ),
    },
    {
      accessorKey: "blood_type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Blood Group
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
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            setSelectedPatient(row.original);
            setAction("edit");
          }}
        >
          <Eye />
        </Button>
      ),
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(-1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    pageCount,
    state: { sorting, pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  const fetchPatients = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    toast.loading("Loading...");

    try {
      const response = await Promise.allSettled([
        getPatients(
          1,
          itemsPerPage,
          (page - 1) * itemsPerPage,
          selectedBranch === "All" ? "-1" : selectedBranch,
          selectedGender,
          selectedBloodType,
        ),
        createTimer(500),
      ]);

      if (response[0].status === "rejected") {
        throw response[0].reason;
      }

      setPatients(response[0].value.patients);
      setPageCount(Math.ceil(response[0].value.patient_count / itemsPerPage));
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
  }, [table, selectedGender, selectedBloodType, selectedBranch]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        const mappedBranches = data.branches.map((b) => ({
          value: String(b.branch_id),
          label: b.name,
        }));
        setBranches(mappedBranches);
      } catch (err) {
        toast.error("Failed to load branches");
      }
    };

    fetchBranches();
  }, []);

  return (
    <>
      <div className="grid gap-4 grid-cols-8 mb-4">
        <div className="grid gap-2">
          <Label>Gender</Label>
          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Blood Group</Label>
          <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Blood Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Branch</Label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={branch.value}>
                  {branch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        table={table}
        errorCode={errorCode}
      />

      <ViewPatient
        isOpen={action === "edit" && selectedPatient !== null}
        selectedPatient={selectedPatient}
        onFinished={fetchPatients}
        onClose={() => {
          setAction(null);
          setSelectedPatient(null);
        }}
      />
    </>
  );
};

export default ExPatients;
