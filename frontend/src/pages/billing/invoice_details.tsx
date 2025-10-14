import React, { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/services/utils";
import { getAllBillingInvoices, type BillingInvoice } from "@/services/invoiceDetailsService";
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
          {row.original.total_fee.toFixed(2)}
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
      cell: ({ row }) => row.original.additional_fee.toFixed(2),
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
          {row.original.net_amount.toFixed(2)}
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
      cell: ({ row }) => (
        <span className={row.original.remaining_payment_amount > 0 ? "text-red-600 font-medium" : ""}>
          {row.original.remaining_payment_amount.toFixed(2)}
        </span>
      ),
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
      cell: ({ row }) => formatDate(row.original.time_stamp),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            toast.success(`Viewing Invoice ${row.original.appointment_id}`);
            // You can navigate to an invoice details page or payment modal here
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
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;

    toast.loading("Loading...");

    try {
      const response = await getAllBillingInvoices();

      // Optional branch filtering if your API doesn’t handle it
      let filtered = response;
      if (selectedBranch !== "All") {
        filtered = filtered.filter(
          (inv: any) => String(inv.branch_id) === selectedBranch
        );
      }

      setInvoices(filtered);
      setPageCount(Math.ceil(filtered.length / itemsPerPage));
      setErrorCode(null);
    } catch (error) {
      toast.error("Failed to fetch billing invoices");
      setErrorCode(500);
    } finally {
      toast.dismiss();
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
        const mappedBranches = data.branches.map((b) => ({
          value: String(b.branch_id),
          label: b.name,
        }));
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
