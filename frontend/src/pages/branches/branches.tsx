import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { Branch } from "@/services/branchServices";
import { getBranchesForPagination } from "@/services/branchServices";
import { Button } from "@/components/ui/button";
import { createTimer, toNormalTimestamp } from "@/services/utils";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Array<Branch>>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "branch_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Branch ID
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
          Branch Name
        </Button>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Location
        </Button>
      ),
    },
    {
      accessorKey: "landline_no",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Landline No
        </Button>
      ),
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
      cell: ({ row }) => toNormalTimestamp(row.original.created_at),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedBranch(row.original);
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
  const [pageCount, setPageCount] = useState<number>(-1); // total pages

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: branches,
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

  const fetchBranches = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    toast.loading("Loading...");

    return Promise.allSettled([
      getBranchesForPagination(itemsPerPage, (page - 1) * itemsPerPage),
      createTimer(500),
    ])
      .then((hu) => {
        if (hu[0].status === "rejected") {
          throw hu[0].reason;
        }
        setBranches(hu[0].value.branches);
        console.log("set", hu[0].value, itemsPerPage);
        setPageCount(Math.ceil(hu[0].value.branch_count / itemsPerPage));
      })
      .catch((error) => {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          toast.error("Failed to fetch branches");
        }
      })
      .finally(() => {
        toast.dismiss();
      });
  }, [table]);

  
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches, pagination]);

  return (
    <>
      {/* <ViewBranch
        isOpen={action === "edit" && selectedBranch !== null}
        selectedBranch={selectedBranch}
        onFinished={fetchBranches}
        onClose={() => {
          setAction(null);
          setSelectedBranch(null);
        }}
      /> */}
      <DataTable table={table} />
    </>
  );
};

export default Branches;