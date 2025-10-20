// pages/patient/PatientDashboard.tsx
import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState, } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { getPatientDashboardDetails, type PatientDashboardDetails, } from "@/services/patientDashboardServices";
import { DataTable } from "../components/data-table";
import { type medicalHistory, getMedicalHistoriesByPatientId } from "@/services/medicalhistoryServices";
import { getMedicationsByPatientId, type medication } from "@/services/medicationServices";
import { getAppointmentsByPatientId, type appointment as Appointment } from "@/services/appoinmentServices"; // keep filename consistent
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Droplet, MapPin, Phone, User } from "lucide-react";
import { CalendarDays, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "@/lib/toast";
import { calculateAge } from "@/services/utils";


export default function PatientDashboard() {
  const [patientDetails, setPatientDetails] = useState<PatientDashboardDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const details = await getPatientDashboardDetails();
        if (!cancelled) setPatientDetails(details);
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch patient details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!patientDetails?.patient_id) return; // guard until first effect finishes
    let cancelled = false;
    setApptLoading(true);

    (async () => {
      try {
        const list = await getAppointmentsByPatientId(patientDetails.patient_id);
        if (!cancelled) setAppointments(list);
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to fetch appointments");
        if (!cancelled) setAppointments([]);
      } finally {
        if (!cancelled) setApptLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [patientDetails?.patient_id]);

  if (loading) return <div>Loading...</div>;
  if (!patientDetails) return <div>No data.</div>;
  const formatApptDateTime = (dateISO: string, slot?: string) => {
    const d = new Date(dateISO);
    const friendly = isNaN(d.getTime())
      ? dateISO
      : d.toLocaleString(); // or set locale + options
    return slot ? `${friendly} (${slot})` : friendly;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "booked":
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="space-y-6 text-left">
      {"name" in patientDetails ? (
        <h1 className="left text-2xl font-bold">Hi {(patientDetails as any).name}, welcome to your dashboard !</h1>
      ) : (
        <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Patient Snapshot Card */}
        <Card className="w-full shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Patient Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium text-base text-white">Name:</p>
              <p className="text-base text-white-600">{patientDetails.name}</p>
            </div>
            <div>
              <p className="font-medium text-base text-white">Gender:</p>
              <p>{patientDetails.gender}</p>
            </div>
            <div>
              <p className="font-medium text-base text-white">NIC:</p>
              <p>{patientDetails.nic}</p>
            </div>
            <div>
              <p className="font-medium text-base text-white flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" /> Age:
              </p>
              <p>{calculateAge(patientDetails.nic, patientDetails.date_of_birth)}</p>
            </div>
            <div>
              <p className="font-medium text-base text-white flex items-center gap-1">
                <Droplet className="w-4 h-4 text-red-500" /> Blood Type:
              </p>
              <p>{patientDetails.blood_type}</p>
            </div>
            <div>
              <p className="font-medium text-base text-white flex items-center gap-1">
                <MapPin className="w-4 h-4 text-green-500" /> Address:
              </p>
              <p>{patientDetails.address}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-medium text-base text-white flex items-center gap-1">
                <Phone className="w-4 h-4 text-purple-500" /> Emergency Contact:
              </p>
              <p>{patientDetails.emergency_contact_no}</p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Card */}
        <Card className="w-full shadow-md rounded-2xl border border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Appointments
              </CardTitle>
              <span className="text-xs text-gray-500">{appointments.length} total</span>
            </div>
          </CardHeader>

          {apptLoading ? (
            <CardContent>Loading...</CardContent>
          ) : appointments.length === 0 ? (
            <CardContent>No appointments found.</CardContent>
          ) : (
            <CardContent className="pt-0">
              <ScrollArea className="h-72 pr-2"> {/* ~288px tall, scrolls if overflow */}
                <ul className="divide-y border-t">
                  {appointments.map((a) => (
                    <li key={a.appointment_id} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500 shrink-0" />
                            <p className="font-medium truncate">
                              {a.name ?? `Doctor #${a.doctor_id}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                            <span className="text-base text-white-600">{a.time_slot}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="text-base text-white-600">{formatApptDateTime(a.date, a.time_slot)}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          )}
        </Card>
      </div>
      <Tabs defaultValue="history" className="w-full">
        {/* Pills selector */}
        <div className="flex justify-start">
          <TabsList className="rounded-full">
            <TabsTrigger value="history" className="rounded-full">
              Medical History
              {/* Optional count badge — pass counts via props/state if you want */}
              {/* <Badge className="ml-2">3</Badge> */}
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-full">
              Prescriptions
              {/* <Badge className="ml-2">2</Badge> */}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Panels */}
        <TabsContent value="history" className="mt-6">
          <MedicalHistoryTable patientId={patientDetails.patient_id} />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <MedicationTable patientId={patientDetails.patient_id} />
        </TabsContent>
      </Tabs>

      {/* <MedicalHistoryTable patientId={patientDetails.patient_id} />
      <MedicationTable patientId={patientDetails.patient_id} /> */}
    </div>
  );
}

function MedicalHistoryTable({ patientId }: { patientId: number }) {
  const [medicalHistories, setMedicalHistories] = useState<medicalHistory[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [mhLoading, setMhLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMhLoading(true);

    (async () => {
      try {
        const list = await getMedicalHistoriesByPatientId(patientId); 
        if (!cancelled) setMedicalHistories(list);                   
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch medical histories");
        if (!cancelled) setMedicalHistories([]);
      } finally {
        if (!cancelled) setMhLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId]);


  const columns: ColumnDef<medicalHistory>[] = [
    { accessorKey: "appointment_id", header: "Appointment ID" },
    { accessorKey: "patient_id", header: "Patient ID" },
    // your payload has visit_date (not "date")
    {
      accessorKey: "visit_date",
      header: "Visit Date",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleString() : "-";
      },
    },
    { accessorKey: "diagnosis", header: "Diagnosis" },
    { accessorKey: "symptoms", header: "Symptoms" },
    { accessorKey: "allergies", header: "Allergies" },
    { accessorKey: "notes", header: "Notes" },
    {
      accessorKey: "follow_up_date",
      header: "Follow-up Date",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleDateString() : "-";
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleString() : "-";
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleString() : "-";
      },
    },
  ];

  const table = useReactTable({
    data: mhLoading ? [] : medicalHistories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (mhLoading) return <div>Loading...</div>;
  if (medicalHistories.length === 0) return <div>No medical histories found.</div>;

  return <DataTable table={table} />;
}

function MedicationTable({ patientId }: { patientId: number }) {
  const [medications, setMedications] = useState<Array<medication>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [mhLoading, setMhLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMhLoading(true);

    (async () => {
      try {
        const list = await getMedicationsByPatientId(patientId); // ← here
        if (!cancelled) setMedications(list);                    // ← and here
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch medications");
        if (!cancelled) setMedications([]);
      } finally {
        if (!cancelled) setMhLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const columns: ColumnDef<medication>[] = [
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
      accessorKey: "name", // fixed
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
      accessorKey: "consultation_note", // fixed
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
  const table = useReactTable({
    data: medications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (mhLoading) return <div>Loading...</div>;
  if (medications.length === 0) return <div>No medications found.</div>;

  return <DataTable table={table} />;
}
