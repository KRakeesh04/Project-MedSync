import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { createTimer, formatRole, toNormalTimestamp } from "@/services/utils";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";
import { getAllLogs, type Log } from "@/services/logsServices";

const LogsTable: React.FC = () => {
  const [Logs, setLogs] = useState<Array<Log>>([]);
  const [logCount, setLogCount] = useState<number>(0);
  const user = localStorage.getItem(LOCAL_STORAGE__USER)
  if (!user) {
    return <Navigate to="/staff/sign-in" replace />;
  }

  const columns: ColumnDef<Log>[] = [
    {
      accessorKey: "log_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Log ID
        </Button>
      ),
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          User ID
        </Button>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Username
        </Button>
      ),
    },
    {
      accessorKey: "user_role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          User Role
        </Button>
      ),
      cell: ({ row }) => formatRole(row.original.user_role),
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Action Type
        </Button>
      ),
    },
    {
      accessorKey: "table_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Table
        </Button>
      ),
    },
    {
      accessorKey: "record_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Record ID
        </Button>
      ),
    },
    {
      accessorKey: "time_stamp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Time Stamp
        </Button>
      ),
      cell: ({ row }) => toNormalTimestamp(row.original.time_stamp),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <div className="flex flex-1 pl-2">
          {row.original.details}
        </div>
      )
    },
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });
  const [pageCount, setPageCount] = useState<number>(-1); // total pages

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: Logs,
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

  const fetchUsers = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    const loadingId = toast.loading("Loading...");

    return Promise.allSettled([
      getAllLogs(
        itemsPerPage,
        (page - 1) * itemsPerPage,
      ),
      createTimer(500),
    ])
      .then((hu) => {
        if (hu[0].status === "rejected") {
          throw hu[0].reason;
        }
        setLogs(hu[0].value.logs);
        setLogCount(hu[0].value.logs_count);
        console.log("set", hu[0].value, itemsPerPage);
        setPageCount(Math.ceil(hu[0].value.logs_count / itemsPerPage));
      })
      .catch((error) => {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          toast.error("Failed to fetch users");
        }
      })
      .finally(() => {
        toast.dismiss(loadingId);
      });
  }, [table]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pagination]);
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-lg font-medium">All Logs</h2>
        <p className="text-sm text-muted-foreground">{logCount} items</p>
      </div>

      <DataTable table={table} />
    </div>
  );
};

export default LogsTable;