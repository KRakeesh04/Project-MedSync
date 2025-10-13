import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import { doctorService } from '@/services/doctorService';
import type { Doctor } from '@/types/doctor.types';

//adding a button to add new doctor
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

//for table
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";


export default function DoctorsDetails() {
  // State variables - like boxes that hold our data
  const [doctors, setDoctors] = useState<Doctor[]>([]);  // Array of doctors
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for DataTable
  const columns: ColumnDef<Doctor>[] = [
    { accessorKey: "doctor_id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "fee_per_patient", header: "Fee per Patient", cell: ({ row }) => `Rs.${row.getValue("fee_per_patient")}` },
    { accessorKey: "basic_monthly_salary", header: "Monthly Salary", cell: ({ row }) => `Rs.${row.getValue("basic_monthly_salary")}` },
  ];

  const table = useReactTable({
    data: doctors,
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

  //console.log("RENDERING DOCTORS DETAILS COMPONENT");
  //console.log(doctors);
  // useEffect runs when component first loads (mounts)
  useEffect(() => {
    // Function to fetch doctors data
    const fetchDoctors = async () => {
      try {
        setLoading(true);  // Show loading state
        setError(null);    // Clear any previous errors
        
        // Call our service to get doctors
        const doctorsData = await doctorService.getAllDoctors();
        
        // Update state with the fetched data
        setDoctors(doctorsData);

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
    fetchDoctors();
  }, []);  // Empty array means "run once when component mounts"

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle title="Doctors' Details" />
        <div>Loading doctors data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="Doctors' Details" />
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
      <PageTitle title="Doctors' Details | Medsync" />

      {/* adding button to add new doctor */}
      <div>
      <div className="flex justify-between items-center mb-4">
        <h2>All Doctors ({doctors.length})</h2> 
        <Link to="/doctor-add">    
          <Button className="bg-blue-600 hover:bg-blue-700"> 
            + Add New Doctor
          </Button>
        </Link>
      </div>
        
        {doctors.length === 0 ? (
          <p>No doctors found in the database.</p>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Search doctors..."
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