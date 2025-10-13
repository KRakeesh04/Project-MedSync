import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import { doctorAppointmentService } from '@/services/doctorappointmentservice';
import type { DoctorAppointment } from '@/types/doctor.appointments.types';


//for table
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";

export default function DoctorsAppointmentDetails() {
  // State variables - like boxes that hold our data
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);  // Array of doctor appointments
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for DataTable
    const columns: ColumnDef<DoctorAppointment>[] = [
      { accessorKey: "appointment_id", header: "Appointment_ID" },
      { accessorKey: "patient_id", header: "Patient_ID" },
      { accessorKey: "doctor_id", header: "Doctor_ID" },
      { accessorKey: "patient_note", header: "Patient Note"},
      { accessorKey: "date", header: "Date" },
      { accessorKey: "time_slot", header: "Time Slot" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "time_stamp", header: "Time Stamp" },
    ];
  
    const table = useReactTable({
      data: appointments,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: { sorting, columnFilters, globalFilter },
    });

  // useEffect runs when component first loads (mounts)
  useEffect(() => {
    // Function to fetch doctors data
    const fetchDoctorAppointments = async () => {
      try {
        setLoading(true);  // Show loading state
        setError(null);    // Clear any previous errors

        // Call our service to get doctor appointments
        const appointmentsData = await doctorAppointmentService.getAllDoctorAppointments();

        // Update state with the fetched data
        setAppointments(appointmentsData);
        
      } catch (err) {
        // Handle any errors
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to fetch doctors:', err);
        
      } finally {
        setLoading(false);  // Hide loading state
      }
    };

    // Actually call the function
    fetchDoctorAppointments();
  }, []);  // Empty array means "run once when component mounts"

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle title="DoctorAppointments' Details" />
        <div>Loading doctor appointments data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="DoctorAppointments' Details" />
        <div style={{ color: 'red' }}>Error: {error}</div>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // Show actual data
  return (
    <div className="space-y-6">
      <PageTitle title="Appointment details | MedSync" />
      
      <div>
        <h2>All Doctor Appointments ({appointments.length})</h2>

        {appointments.length === 0 ? (
          <p>No doctor appointments found in database.</p>
        ) : (
            <div className="space-y-4">
            <Input
              placeholder="Search appointments..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
            <DataTable table={table} />
          </div>
        )}
      </div>
    </div>
  );
}