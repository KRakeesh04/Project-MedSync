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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addInsuranceType } from '@/services/insuranceService';
import { can } from "@/services/roleGuard";

const InsuranceTypesPage: React.FC = () => {
  const [insuranceTypes, setInsuranceTypes] = useState<Array<InsuranceTypes>>([]);
  const [insuranceCount, setInsuranceCount] = useState<number>(0);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceTypes | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ insurance_type: '', insurance_period: '', claim_percentage: '' });

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
      cell: ({ row }) => `${(Number(row.original.claim_percentage) * 100).toFixed(1)} %`,
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

      <div className="flex justify-end">
        {can.addInsuranceType() ? (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">New Insurance Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Insurance Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label>Insurance Type</Label>
                <Input value={createForm.insurance_type} onChange={(e) => setCreateForm({ ...createForm, insurance_type: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Insurance Period</Label>
                <Input placeholder="Eg: 1 Year" value={createForm.insurance_period} onChange={(e) => setCreateForm({ ...createForm, insurance_period: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Claim Percentage (0-1)</Label>
                <Input placeholder="Eg: 0.1" type="number" value={createForm.claim_percentage} onChange={(e) => setCreateForm({ ...createForm, claim_percentage: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={async () => {
                  if (!createForm.insurance_type || !createForm.insurance_period || createForm.claim_percentage === '') {
                    toast.error('Please fill required fields');
                    return;
                  }
                  try {
                    await addInsuranceType({ insurance_type: createForm.insurance_type, insurance_period: createForm.insurance_period, claim_percentage: Number(createForm.claim_percentage) });
                    toast.success('Insurance type added');
                    setCreateOpen(false);
                    setCreateForm({ insurance_type: '', insurance_period: '', claim_percentage: '' });
                    await fetchInsuranceTypes();
                  } catch (err) {
                    toast.error('Failed to add insurance type');
                  }
                }}>Create</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        ) : null}
      </div>

      <DataTable table={table} errorCode={errorCode} />
    </div>
  );
};

export default InsuranceTypesPage;
