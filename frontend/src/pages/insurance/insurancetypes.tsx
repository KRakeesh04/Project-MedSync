import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { createTimer } from "@/services/utils";
import { Eye } from "lucide-react";
import { getInsuranceTypesDataForPagination, type InsuranceTypes } from "@/services/insuranceService";
import ViewInsurance from "@/pages/insurance/insurancetypes-view";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";

const InsuranceTypesPage: React.FC = () => {
  const [insuranceTypes, setInsuranceTypes] = useState<Array<InsuranceTypes>>([]);
  const [insuranceCount, setInsuranceCount] = useState<number>(0);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceTypes | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  
  const user = localStorage.getItem(LOCAL_STORAGE__USER);
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const columns: ColumnDef<InsuranceTypes>[] = [
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
    },
    {
      accessorKey: "insurance_type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Insurance Type
        </Button>
      ),
    },
    {
      accessorKey: "insurance_period",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Insurance Period
        </Button>
      ),
    },
    {
      accessorKey: "claim_percentage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Claim Percentage
        </Button>
      ),
      cell: ({ row }) => `${Number(row.original.claim_percentage).toFixed(2)}%`,
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
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedInsurance(row.original);
              setAction("edit");
            }}
          >
            <Eye />
          </Button>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(-1);

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: insuranceTypes,
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

  const fetchInsuranceTypes = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    const loadingId = toast.loading("Loading...");

    try {
      const response = await Promise.allSettled([
        getInsuranceTypesDataForPagination(
          itemsPerPage,
          (page - 1) * itemsPerPage
        ),
        createTimer(500),
      ]);

      if (response[0].status === "rejected") {
        throw response[0].reason;
      }

      setInsuranceTypes(response[0].value.insurance);
      setInsuranceCount(response[0].value.insurance_count);
      setPageCount(Math.ceil(response[0].value.insurance_count / itemsPerPage));
      setErrorCode(null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorCode(404);
      } else {
        toast.error("Failed to fetch insurance types");
      }
    } finally {
      toast.dismiss(loadingId);
    }
  }, [table]);

  useEffect(() => {
    fetchInsuranceTypes();
  }, [fetchInsuranceTypes, pagination, errorCode]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-lg font-medium">All Insurance Types</h2>
        <p className="text-sm text-muted-foreground">{insuranceCount} items</p>
      </div>

      <ViewInsurance
        isOpen={action === "edit" && selectedInsurance !== null}
        selectedInsurance={selectedInsurance}
        onFinished={fetchInsuranceTypes}
        onClose={() => {
          setAction(null);
          setSelectedInsurance(null);
        }}
      />

      <DataTable table={table} errorCode={errorCode} />
    </div>
  );
};

export default InsuranceTypesPage;
