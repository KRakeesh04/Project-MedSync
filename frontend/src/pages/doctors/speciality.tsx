import { useState, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import type { Speciality,SpecialitiesApiResponse } from '@/types/speciality.types';    
import { specialityService } from '@/services/SpecialityService';

//adding a button to add new speciality
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
//for table
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";

export default function Speciality() {
  // State variables - like boxes that hold our data
  const [specialities, setSpecialities] = useState<Speciality[]>([]);  // Array of doctor specialities
  const [loading, setLoading] = useState<boolean>(true);  // Is data loading?
  const [error, setError] = useState<string | null>(null);  // Any error message

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for DataTable
    const columns: ColumnDef<Speciality>[] = [
        { accessorKey: "speciality_id", header: "Speciality ID" },
        { accessorKey: "speciality_name", header: "Speciality Name" },
        { accessorKey: "description", header: "Description" },
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
    const fetchSpecialities = async () => {
      try {
        setLoading(true);  // Show loading state
        setError(null);    // Clear any previous errors

        // Call our service to get doctor appointments
        const specialitiesData = await specialityService.getAllSpecialities();

        // Update state with the fetched data
        setSpecialities(specialitiesData);

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
    fetchSpecialities();
  }, []);  // Empty array means "run once when component mounts"

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle title="Specialities | MedSync" />
        <div>Loading doctor specialities data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="Specialities | MedSync" />
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
      <PageTitle title="Specialities | MedSync" />
      
      {/* adding button to add new doctor */}
      <div>
      <div className="flex justify-between items-center mb-4">
        <h2>All Specialities ({specialities.length})</h2> 
        <Link to="/speciality-add">    
          <Button className="bg-blue-600 hover:bg-blue-700"> 
            + Add New Speciality
          </Button>
        </Link>
      </div>

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