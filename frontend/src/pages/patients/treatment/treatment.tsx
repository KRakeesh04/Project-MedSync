import { getTreatments, type Treatment } from "@/services/treatmentServices";
import { DataTable } from "../../../components/data-table";
import { useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "@/lib/toast";
import { getSpecialityNames, type Speciality } from '@/services/specialityServices';



const Treatments: React.FC = () => {

  const [treatments, setTreatments] = useState<Array<Treatment>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState<number>(-1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTreatment, setNewTreatment] = useState({ name: "", fee: "", description: "", speciality_id: "" });
  const [specialities, setSpecialities] = useState<Pick<Speciality, 'speciality_id' | 'speciality_name'>[]>([]);
  const [specialitiesLoading, setSpecialitiesLoading] = useState(false);

  const columns: ColumnDef<Treatment>[] = [
    {
      accessorKey: "service_code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Service Code
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
          Name
        </Button>
      ),
    },
    {
      accessorKey: "fee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Fee
        </Button>
      ),
      cell: ({ getValue }) => {
        const v = getValue<number | string>();
        const num = typeof v === "string" ? parseFloat(v) : v;
        return "Rs. " + (num ?? 0).toFixed(2); // -> Rs. 500.00
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Description
        </Button>
      ),
    },
    // {
    //   accessorKey: "speciality_id",
    //   header: "Speciality ID",
    // },
    {
      accessorKey: "speciality_name",
      header: "Speciality Name",
    }
  ];

  const table = useReactTable({
    data: treatments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting, pagination },
    pageCount,
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  const fetchData = async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    const tId = toast.loading("Loading treatments...");
    try {
      const resp = await getTreatments(itemsPerPage, (page - 1) * itemsPerPage);
      setTreatments(resp.treatments);
      setPageCount(Math.ceil((resp.treatment_count ?? 0) / itemsPerPage));
    } catch (e) {
      toast.error("Failed to load treatments");
    } finally {
      toast.dismiss(tId);
    }
  };

  useEffect(() => { fetchData(); }, [pagination]);

  useEffect(() => {
    const load = async () => {
      setSpecialitiesLoading(true);
      try {
        const data = await getSpecialityNames();
        setSpecialities(data.specialities ?? []);
      } catch (e) {
        toast.error("Failed to load specialities");
      } finally {
        setSpecialitiesLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Treatments</h1>
        <div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddOpen(true)}>+ Add Treatment</Button>
        </div>
      </div>

      {treatments.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          No treatments yet. Click <span className="font-medium">+ Add Treatment</span> to create one.
        </div>
      ) : (
        <DataTable table={table} />
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Treatment</DialogTitle>
            <DialogDescription>Enter treatment details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="tr-name">Name</Label>
            <Input id="tr-name" placeholder="Name" value={newTreatment.name} onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })} />
            <Label htmlFor="tr-fee">Fee</Label>
            <Input id="tr-fee" placeholder="Fee" value={newTreatment.fee} onChange={(e) => setNewTreatment({ ...newTreatment, fee: e.target.value })} inputMode="decimal" />
            <Label htmlFor="tr-desc">Description</Label>
            <Input id="tr-desc" placeholder="Description" value={newTreatment.description} onChange={(e) => setNewTreatment({ ...newTreatment, description: e.target.value })} />
            <Label htmlFor="tr-speciality">Speciality</Label>
            <Select value={newTreatment.speciality_id} onValueChange={(v) => setNewTreatment({ ...newTreatment, speciality_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select speciality" />
              </SelectTrigger>
              <SelectContent>
                {specialitiesLoading ? (
                  <SelectItem value="">Loading...</SelectItem>
                ) : specialities.length === 0 ? (
                  <SelectItem value="">No specialities</SelectItem>
                ) : (
                  specialities.map((s) => (
                    <SelectItem key={s.speciality_id} value={String(s.speciality_id)}>
                      {s.speciality_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={async () => {
              const tId = toast.loading("Creating treatment...");
              try {
                const payload = {
                  name: newTreatment.name,
                  fee: Number(newTreatment.fee),
                  description: newTreatment.description,
                  speciality_id: Number(newTreatment.speciality_id),
                };
                await (await import('@/services/treatmentServices')).createTreatment(payload as any);
                toast.success("Treatment created");
                setIsAddOpen(false);
                setNewTreatment({ name: "", fee: "", description: "", speciality_id: "" });
                fetchData();
              } catch (e: any) {
                toast.error(e?.message || "Failed to create treatment");
              } finally { toast.dismiss(tId); }
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Treatments;
