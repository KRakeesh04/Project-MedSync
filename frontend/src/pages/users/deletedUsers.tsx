import { getAllInactiveUsers, type User } from "@/services/userService";
import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createTimer, Role, toNormalTimestamp } from "@/services/utils";
import { RotateCcw } from "lucide-react";
import UndoDeleteUser from "./user-restore";


const InactiveUsers: React.FC = () => {
  const [Users, setUsers] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] = useState<"undo" | null>(null);
  const columns: ColumnDef<User>[] = [
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
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Role
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
      accessorKey: "is_approved",
      header: "Approved",
      cell: ({ row }) => (row.original.is_approved ? "True" : "False"),
    },
    {
      header: "Action",
      cell: ({ row }) => {
        if (row.original.role === Role.SUPER_ADMIN) {
          return <div className="text-muted-foreground mt-3 h-6">N/A</div>;
        }
        return (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setSelectedUser(row.original);
                setAction("undo");
              }}
            >
              <RotateCcw />
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
    data: Users,
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
    toast.loading("Loading...");

    return Promise.allSettled([
      getAllInactiveUsers(itemsPerPage, (page - 1) * itemsPerPage),
      createTimer(500),
    ])
      .then((hu) => {
        if (hu[0].status === "rejected") {
          throw hu[0].reason;
        }
        setUsers(hu[0].value.users);
        console.log("set", hu[0].value, itemsPerPage);
        setPageCount(Math.ceil(hu[0].value.user_count / itemsPerPage));
      })
      .catch((error) => {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          toast.error("Failed to fetch users");
        }
      })
      .finally(() => {
        toast.dismiss();
      });
  }, [table]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pagination]);
  return (
    <>
      <UndoDeleteUser
        isOpen={action === "undo" && selectedUser !== null}
        selectedUser={selectedUser}
        onFinished={fetchUsers}
        onClose={() => {
          setAction(null);
          setSelectedUser(null);
        }}
      />
      <DataTable table={table} />
    </>
  );
};

export default InactiveUsers;