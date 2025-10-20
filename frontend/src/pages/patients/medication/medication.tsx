import { DataTable } from "../../../components/data-table";
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "@/lib/toast";
import { getMedicationsByPatientId, getMedications, createMedication, type Medication } from "@/services/medicationServices";
import { getAllBranches } from "@/services/branchServices";
import { createTimer } from "@/services/utils";

const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Array<Medication>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [patientIdInput, setPatientIdInput] = useState<string>("");
  const [medicationsCount, setMedicationsCount] = useState<number>(0);

  const columns: ColumnDef<Medication>[] = [
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
      accessorKey: "patient_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Patient ID
        </Button>
      ),
    },
    {
      accessorKey: "patient_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Patient Name
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
          Branch Name
        </Button>
      ),
    },
    {
      accessorKey: "doctor_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Treated By
        </Button>
      ),
    },
    {
      accessorKey: "consultation_note",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Consultation Notes
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="line-clamp-2">{String(getValue() ?? "")}</span>
      ),
    },
    {
      accessorKey: "prescription_items_details",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Prescription Items Details
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="line-clamp-2">{String(getValue() ?? "")}</span>
      ),
    },
    {
      accessorKey: "prescribed_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Prescribed At
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "is_active",
      header: "Active",
      cell: ({ getValue }) => <span>{getValue() ? "Yes" : "No"}</span>,
    },
  ];

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState<number>(-1);
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);

  const table = useReactTable({
    data: medications,
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

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getAllBranches();
        setBranches(data.branches.map((b: any) => ({ value: String(b.branch_id), label: b.name })));
      } catch (e) {
        toast.error("Failed to load branches");
      }
    };
    loadBranches();
  }, []);

  const fetchData = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    const loadingId = toast.loading("Loading medications...");

    try {
      const resp = await Promise.allSettled([
        getMedications(itemsPerPage, (page - 1) * itemsPerPage, selectedBranch === "All" ? "-1" : selectedBranch),
        createTimer(300),
      ]);

      if (resp[0].status === "rejected") throw resp[0].reason;

      setMedications(resp[0].value.medications);
      setMedicationsCount(resp[0].value.medication_count);
      setPageCount(Math.ceil(resp[0].value.medication_count / itemsPerPage));
    } catch (error) {
      toast.error("Failed to fetch medications");
    } finally {
      try { toast.dismiss(loadingId); } catch (e) { }
    }
  }, [table, selectedBranch]);

  useEffect(() => { fetchData(); }, [fetchData, pagination, selectedBranch]);


  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});

  const handleAdd = async () => {
    const t = toast.loading("Adding medication...");
    try {
      await createMedication(newMedication);
      toast.success("Medication added");
      setIsAddOpen(false);
      fetchData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to add medication");
    } finally { toast.dismiss(t); }
  };

  const handleSearch = async () => {
    const parsed = parseInt(patientIdInput.trim(), 10);
    if (Number.isNaN(parsed)) {
      toast.warning("Please enter a valid integer Patient ID");
      return;
    }
    const t = toast.loading(`Loading medications for patient ${parsed}...`);
    try {
      const data = await getMedicationsByPatientId(parsed);
      setMedications(data);
      toast.info(`Loaded ${data.length} record(s)`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        "Failed to fetch medications for that patient";
      toast.error(msg);
    } finally {
      toast.dismiss(t);
    }
  };

  const handleClear = async () => {
    const t = toast.loading("Loading all medications...");
    try {
      fetchData();
      setPatientIdInput("");
      setSelectedBranch("All");
    } catch {
      toast.error("Failed to fetch medications");
    } finally {
      toast.dismiss(t);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-medium">Patients Medications</h2>
        <p className="text-sm text-muted-foreground">{medicationsCount} items</p>
      </div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Select value={selectedBranch} onValueChange={(v) => setSelectedBranch(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Branches</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Patient ID…"
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            className="w-40"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <Button onClick={handleSearch}>Search</Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
        <div className="flex items-center">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddOpen(true)}>+ Add Medication</Button>
        </div>
      </div>

      <DataTable table={table} />

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>Enter medication details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="med-branch">Appointment ID</Label>
            <Input id="med-branch" placeholder="Appointment ID" value={String(newMedication.appointment_id ?? '')} onChange={(e) => setNewMedication({ ...newMedication, appointment_id: Number(e.target.value) })} />
            <Label htmlFor="med-patient">Patient ID</Label>
            <Input id="med-patient" placeholder="Patient ID" value={String(newMedication.patient_id ?? '')} onChange={(e) => setNewMedication({ ...newMedication, patient_id: Number(e.target.value) })} />
            <Label htmlFor="med-note">Consultation Note</Label>
            <Input id="med-note" placeholder="Consultation Note" value={newMedication.consultation_note ?? ''} onChange={(e) => setNewMedication({ ...newMedication, consultation_note: e.target.value })} />
            <Label htmlFor="med-presc">Prescription Items</Label>
            <Input id="med-presc" placeholder="Prescription Items" value={newMedication.prescription_items_details ?? ''} onChange={(e) => setNewMedication({ ...newMedication, prescription_items_details: e.target.value })} />
            <Label htmlFor="med-doctor">Prescribed By(Doctor ID)</Label>
            <Input id="med-doctor" placeholder="Doctor ID" value={String(newMedication.doctor_id ?? '')} onChange={(e) => setNewMedication({ ...newMedication, doctor_id: Number(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default Medications;