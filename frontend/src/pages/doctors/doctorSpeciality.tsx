import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";

import type { DoctorSpeciality } from '@/types/doctor.specialities.types';    
import { doctorSpecialityService } from '@/services/doctorSpecialityService';


//for table
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";

export default function DoctorsSpecialityDetails() {
  // State variables - like boxes that hold our data
  const [specialities, setSpecialities] = useState<DoctorSpeciality[]>([]);  // Array of doctor specialities
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for DataTable
    const columns: ColumnDef<DoctorSpeciality>[] = [
        { accessorKey: "doctor_id", header: "Doctor ID" },
        { accessorKey: "speciality_id", header: "Speciality ID" },
        { accessorKey: "name", header: "Doctor Name" },
        { accessorKey: "speciality_name", header: "Speciality Name" },
        { accessorKey: "added_at", header: "Added At" },
    ];
  
    const table = useReactTable({
      data: specialities,
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
        const appointmentsData = await doctorSpecialityService.getAllDoctorSpecialities();

        // Update state with the fetched data
        setSpecialities(appointmentsData);

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
        <PageTitle title="Doctors' Specialities Details" />
        <div>Loading doctor specialities data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="Doctors' Specialities Details" />
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
      <PageTitle title="Doctors' Specialities Details | MedSync" />
      
      <div>
        <h2>All Doctor Specialities ({specialities.length})</h2>

        {specialities.length === 0 ? (
          <p>No doctor specialities found in database.</p>
        ) : (
            <div className="space-y-4">
            <Input
              placeholder="Search specialities..."
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