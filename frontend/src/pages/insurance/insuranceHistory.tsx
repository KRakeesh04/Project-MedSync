import { DataTable } from "../../components/data-table";
import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { getallinsurancehistories, type insuranceHistory } from "@/services/insurancehistoryService";

const InsuranceHistory: React.FC = () => {

  const [insuranceHistory, setInsuranceHistory] = useState<Array<insuranceHistory>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<insuranceHistory>[] = [
    {
      accessorKey: "claim_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Insurance Claim ID
        </Button>
      ),
    },
    {
      accessorKey: "service_code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Service Code
        </Button>
      ),
    },
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
      accessorKey: "approved_by",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Approved By
        </Button>
      ),
    },
    {
      accessorKey: "claimed_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Claimed Amount
        </Button>
      ),
      cell: ({ getValue }) => {
        const n = Number(getValue());
        return <span>{isNaN(n) ? String(getValue()) : n.toFixed(2)}</span>;
      }
    },
    {
      accessorKey: "claimed_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Claimed At
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "insurance_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Insurance ID
        </Button>
      ),
    }
  ];

  const table = useReactTable({
    data: insuranceHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const loadingId = toast.loading("Loading insurance histories...");
      try {
        const data = await getallinsurancehistories();
        setInsuranceHistory(data);
      } catch (error) {
        toast.error("Failed to fetch insurance histories");
      } finally {
        toast.dismiss(loadingId);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
  <h1 className="text-2xl font-bold">Insurance History</h1>

      </div>



      <DataTable table={table} />

    </>
  );
};





export default InsuranceHistory;
