import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import {doctorPatientsHistoryService} from '@/services/doctorpatientshistory';
import type { DoctorPatientsHistory } from '@/types/doctor.patients.history.types'; 



//for table
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";

export default function DoctorsPatientsHistory() {
  // State variables - like boxes that hold our data
  const [patientsHistory, setPatientsHistory] = useState<DoctorPatientsHistory[]>([]);  // Array of doctor patients history
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for DataTable
    const columns: ColumnDef<DoctorPatientsHistory>[] = [
    { accessorKey: "medical_history_id", header: "Medical History ID" },
    { accessorKey: "appointment_id", header: "Appointment ID" },
    { accessorKey: "visit_date", header: "Visit Date" },
    { accessorKey: "diagnosis", header: "Diagnosis" },
    { accessorKey: "symptoms", header: "Symptoms" },
    { accessorKey: "allergies", header: "Allergies" },
    { accessorKey: "notes", header: "Notes" },
    { accessorKey: "follow_up_date", header: "Follow Up Date" },
    { accessorKey: "created_at", header: "Created At" },
    { accessorKey: "updated_at", header: "Updated At" },
    ];
  
    const table = useReactTable({
      data: patientsHistory,
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
    const fetchDoctorPatientsHistory = async () => {
      try {
        setLoading(true);  // Show loading state
        setError(null);    // Clear any previous errors

        // Call our service to get doctor patients history
        const patientsHistoryData = await doctorPatientsHistoryService.getAllDoctorPatientsHistory();

        // Update state with the fetched data
        setPatientsHistory(patientsHistoryData);
        
      } catch (err) {
        // Handle any errors
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to fetch doctor patients history:', err);
        
      } finally {
        setLoading(false);  // Hide loading state
      }
    };

    // Actually call the function
    fetchDoctorPatientsHistory();
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
      <PageTitle title="Patients' history | MedSync" />
      
      <div>
        <h2>All Doctor Patients History ({patientsHistory.length})</h2>

        {patientsHistory.length === 0 ? (
          <p>No doctor patients history found in database.</p>
        ) : (
            <div className="space-y-4">
            <Input
              placeholder="Search patients history..."
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