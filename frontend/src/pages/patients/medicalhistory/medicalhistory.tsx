import { DataTable } from "../../../components/data-table";
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { getallmedicalhistories, type medicalHistory } from "@/services/medicalhistoryServices";
import { createTimer } from "@/services/utils";
import { getAllBranches } from "@/services/branchServices";

const MedicalHistory: React.FC = () => {

  const [medicalHistory, setMedicalHistory] = useState<Array<medicalHistory>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [medicalHistoryCount, setMedicalHistoryCount] = useState<number>(0);

  const columns: ColumnDef<medicalHistory>[] = [
    // {
    //   accessorKey: "medical_history_id",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="px-0"
    //     >
    //       Medical History ID
    //     </Button>
    //   ),
    // },
    {
      accessorKey: "appointment_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Appointment ID
        </Button>
      ),
    },
    {
      accessorKey: "visit_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Visit Date
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "diagnosis",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Diagnosis
        </Button>
      ),
    },
    {
      accessorKey: "symptoms",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Symptoms
        </Button>
      ),
    },
    {
      accessorKey: "allergies",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Allergies
        </Button>
      ),
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          notes
        </Button>
      ),
    },
    {
      accessorKey: "follow_up_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Follow Up Date
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Created At
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Updated At
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    }
  ];

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState<number>(-1);

  const table = useReactTable({
    data: medicalHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
    },
    pageCount,
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getAllBranches();
        const mapped = data.branches.map((b: any) => ({ value: String(b.branch_id), label: b.name }));
        setBranches(mapped);
      } catch (e) {
        // ignore
      }
    };
    loadBranches();
  }, []);

  const fetchData = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    const loadingId = toast.loading("Loading medical histories...");

    try {
      const resp = await Promise.allSettled([
        getallmedicalhistories(
          itemsPerPage,
          (page - 1) * itemsPerPage,
          selectedBranch === "All" ? "-1" : selectedBranch,
        ),
        createTimer(300),
      ]);

      if (resp[0].status === "rejected") throw resp[0].reason;

      const data = resp[0].value;
      setMedicalHistory(data.histories);
      setMedicalHistoryCount(data.total_count);
      setPageCount(Math.ceil(data.total_count / itemsPerPage));
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to fetch medical histories");
    } finally {
      try { toast.dismiss(loadingId); } catch (e) { /* ignore */ }
    }
  }, [table, selectedBranch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination, selectedBranch]);

  return (
    <>
      <div>
        <h2 className="text-lg font-medium">Medical History</h2>
        <p className="text-sm text-muted-foreground">{medicalHistoryCount} items</p>
      </div>
      <DataTable table={table} />
    </>
  );
};





export default MedicalHistory;
