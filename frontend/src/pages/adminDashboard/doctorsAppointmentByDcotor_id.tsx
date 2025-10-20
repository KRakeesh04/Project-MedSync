import { DataTable } from "../../components/data-table";
import { useEffect, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { toNormalTimestamp } from "@/services/utils";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";
import {
  getAppointmentsByDoctorId,
  type DoctorAppointmentByDoctorId,
} from "@/services/appoinmentServices";
import {
  doctorDashboardDetails,
  type DoctorDashboardDetails,
} from "@/services/adminDashboardServices";

const DoctorsAppointmentsByDoctorId: React.FC = () => {
  const [appointments, setAppointments] = useState<DoctorAppointmentByDoctorId[]>([]);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDashboardDetails | null>(null);

  const userRaw = localStorage.getItem(LOCAL_STORAGE__USER);
  if (!userRaw) return <Navigate to="/staff/sign-in" replace />;

  const user = (() => {
    try { return JSON.parse(userRaw) as { user_id?: number; doctor_id?: number }; }
    catch { return {}; }
  })();

  const columns: ColumnDef<DoctorAppointmentByDoctorId>[] = useMemo(
    () => [
      {
        accessorKey: "appointment_id",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
            Appointment ID
          </Button>
        ),
      },
      {
        accessorKey: "name", // change if your API uses "doctor_name"
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
            Doctor Name
          </Button>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
            Date
          </Button>
        ),
        cell: ({ row }) => toNormalTimestamp(row.original.date),
      },
      {
        accessorKey: "time_slot",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
            Time Slot
          </Button>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
            Status
          </Button>
        ),
      },
    ],
    []
  );

  // No pagination model here
  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const load = async () => {
      const loadingId = toast.loading("Loading appointments…");
      try {
        const details = await doctorDashboardDetails().catch(() => null);
        if (details) setDoctorDetails(details);

        const doctorId =
          (details as any)?.doctor_id ??
          (user as any)?.doctor_id ??
          (user as any)?.user_id;

        if (!doctorId) throw new Error("Doctor ID not found.");

        const appts = await getAppointmentsByDoctorId(doctorId);
        setAppointments(appts ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch appointments");
      } finally {
        toast.dismiss(loadingId);
      }
    };
    load();
  }, []); // run once

  return (
    <div className="space-y-6 p-4">
      {/* If your DataTable shows pagination controls, hide them inside that component since we're not using pagination */}
      <DataTable table={table} />
    </div>
  );
};

export default DoctorsAppointmentsByDoctorId;
