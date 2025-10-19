// ...existing code...
import React, { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import toast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/services/utils";
import { getAllBillingInvoices, type BillingInvoice } from "@/services/invoiceDetailsServices";
import { getAllBranches } from "@/services/branchServices";

const AllInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState<number>(-1);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  // Filters
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);

  // --- Safe helpers to avoid runtime errors in table cells ---
  const safeNumber = (v: unknown, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const safeFormatDate = (v: unknown) => {
    try {
      const s = String(v ?? "");
      if (!s) return "";
      const d = new Date(s);
      if (Number.isNaN(d.getTime())) return s;
      return formatDate(d.toISOString());
    } catch {
      return String(v ?? "");
    }
  };
  // --- end helpers ---

  const columns: ColumnDef<BillingInvoice>[] = [
    {
      accessorKey: "appointment_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Appointment ID
        </Button>
      ),
      cell: ({ row }) => String(row.original.appointment_id ?? ""),
    },
    {
      accessorKey: "total_fee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Fee
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-blue-600">
          {safeNumber(row.original.total_fee).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "additional_fee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Additional Fee
        </Button>
      ),
      cell: ({ row }) => safeNumber(row.original.additional_fee).toFixed(2),
    },
    {
      accessorKey: "net_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Net Amount
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {safeNumber(row.original.net_amount).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "remaining_payment_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Remaining Amount
        </Button>
      ),
      cell: ({ row }) => {
        const rem = safeNumber(row.original.remaining_payment_amount);
        return (
          <span className={rem > 0 ? "text-red-600 font-medium" : ""}>
            {rem.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "time_stamp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
        </Button>
      ),
      cell: ({ row }) => safeFormatDate(row.original.time_stamp),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            toast.success(`Viewing Invoice ${row.original.appointment_id}`);
            // navigate or open modal here
          }}
        >
          <Eye />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: invoices,
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

  const fetchInvoices = useCallback(async () => {
    const tableState = table.getState();
    const itemsPerPage = tableState.pagination.pageSize;

    const toastId = toast.loading("Loading...");

    try {
      const response = await getAllBillingInvoices();

      // normalize response into an array
      let data: BillingInvoice[] = [];
      if (Array.isArray(response)) data = response;
      else if (response && Array.isArray((response as any).invoices)) data = (response as any).invoices;
      else if (response && Array.isArray((response as any).data)) data = (response as any).data;
      else data = (response as any) || [];

      // Optional branch filtering if invoices have branch_id
      let filtered = data;
      if (selectedBranch !== "All") {
        filtered = filtered.filter(
          (inv: any) => String(inv.branch_id ?? "") === selectedBranch
        );
      }

      setInvoices(filtered);
      setPageCount(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
      setErrorCode(null);
    } catch (error) {
      toast.error("Failed to fetch billing invoices");
      setErrorCode(500);
    } finally {
      toast.dismiss(toastId);
    }
  }, [table, selectedBranch]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Fetch branch list
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getAllBranches();
        const items = (data && (data as any).branches) || (data as any) || [];
        const mappedBranches = Array.isArray(items)
          ? items.map((b: any) => ({
              value: String(b.branch_id),
              label: b.name,
            }))
          : [];
        setBranches(mappedBranches);
      } catch (err) {
        toast.error("Failed to load branches");
      }
    };
    loadBranches();
  }, []);

  return (
    <>
      <div className="grid gap-4 grid-cols-8 mb-4">
        <div className="grid gap-2 col-span-2">
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
    </>
  );
};

export default AllInvoices;
