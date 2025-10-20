import { DataTable } from "../../components/data-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { createTimer, toNormalTimestamp } from "@/services/utils";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";
import { getDoctorsAppointments, type DoctorAppointment } from "@/services/appoinmentServices";

const DoctorsAppointmentsTable: React.FC = () => {
  const [appointments, setAppointments] = useState<Array<DoctorAppointment>>([]);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);

  const user = localStorage.getItem(LOCAL_STORAGE__USER);
  if (!user) {
    return <Navigate to="/staff/sign-in" replace />;
  }

  const columns: ColumnDef<DoctorAppointment>[] = useMemo(() => [
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
      accessorKey: "doctor_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Doctor ID
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
          Doctor Name
        </Button>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Date
        </Button>
      ),
      // If your `date` is ISO, you can format it similarly to logs’ timestamp helper
      cell: ({ row }) => toNormalTimestamp(row.original.date),
    },
    {
      accessorKey: "time_slot",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Time Slot
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Status
        </Button>
      ),
    },
  ], []);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(-1); // total pages
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: appointments,
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

  const fetchAppointments = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    const loadingId = toast.loading("Loading...");

    return Promise.allSettled([
      getDoctorsAppointments(itemsPerPage, (page - 1) * itemsPerPage),
      createTimer(500),
    ])
      .then((res) => {
        const first = res[0];
        if (first.status === "rejected") {
          throw first.reason;
        }
        setAppointments(first.value.appointments);
        setAppointmentsCount(first.value.appointments_count);
        setPageCount(Math.ceil(first.value.appointments_count / itemsPerPage));
      })
      .catch((error) => {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          toast.error("Failed to fetch appointments");
        }
      })
      .finally(() => {
        toast.dismiss(loadingId);
      });
  }, [table]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, pagination]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-lg font-medium">Appointments</h2>
        <p className="text-sm text-muted-foreground">{appointmentsCount} items</p>
      </div>
      
      <DataTable table={table} />
    </div>
  );
};

export default DoctorsAppointmentsTable;
