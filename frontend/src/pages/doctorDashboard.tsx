import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Clock,
  ClipboardList,
  DollarSign,
  History,
  MapPin,
  PlusCircle,
  Stethoscope,
  UserCircle,
  Users,
} from "lucide-react";
import toast from "@/lib/toast";
import {
  doctorDashboardDetails,
  type DoctorDashboardDetails,
} from "@/services/adminDashboardServices";
import {
  getAppointmentsByDoctorId,
  type DoctorAppointmentByDoctorId,
} from "@/services/appoinmentServices";
import { LOCAL_STORAGE__USER } from "@/services/authServices";

const startOfDay = (value: Date) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseAppointmentDateTime = (
  dateISO?: string,
  slot?: string,
): Date | null => {
  if (!dateISO) return null;

  const slotStart = slot?.split("-")?.[0]?.trim();
  if (slotStart) {
    const composed = `${dateISO}T${slotStart.length === 5 ? `${slotStart}:00` : slotStart}`;
    const combined = new Date(composed);
    if (!Number.isNaN(combined.getTime())) {
      return combined;
    }
  }

  const fallback = new Date(dateISO);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const statusTone = (status: string | undefined) => {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized.includes("cancel")) {
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  }
  if (normalized.includes("complete")) {
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  }
  if (normalized.includes("pending") || normalized.includes("booked")) {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  }
  if (normalized.includes("reschedule") || normalized.includes("scheduled")) {
    return "bg-amber-500/10 text-amber-300 border border-amber-500/20";
  }
  return "bg-muted text-muted-foreground border border-transparent";
};

const labelFromStatus = (status: string | undefined) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Unknown";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorDashboardDetails | null>(null);
  const [appointments, setAppointments] = useState<DoctorAppointmentByDoctorId[]>([]);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const parsedUser = useMemo(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE__USER);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as { user_id?: number; doctor_id?: number; name?: string };
    } catch (error) {
      console.warn("Failed to parse stored user", error);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const details = await doctorDashboardDetails();
        if (!active) return;
        setDoctor(details);
      } catch (error: any) {
        console.error("Unable to load doctor profile", error);
        toast.error(error?.message ?? "Unable to load doctor details");
      } finally {
        if (active) setLoadingDoctor(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const doctorId = useMemo(() => {
    return doctor?.doctor_id ?? parsedUser?.doctor_id ?? parsedUser?.user_id ?? null;
  }, [doctor, parsedUser]);

  useEffect(() => {
    if (!doctorId) {
      setAppointments([]);
      setLoadingAppointments(false);
      return;
    }

    let active = true;
    setLoadingAppointments(true);
    (async () => {
      try {
        const list = await getAppointmentsByDoctorId(doctorId);
        if (!active) return;
        setAppointments(Array.isArray(list) ? list : []);
      } catch (error: any) {
        console.error("Unable to load appointments", error);
        if (active) {
          setAppointments([]);
          toast.error(error?.message ?? "Unable to load appointments");
        }
      } finally {
        if (active) setLoadingAppointments(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [doctorId]);

  const now = new Date();
  const todayStart = startOfDay(now);

  const appointmentsWithDate = useMemo(
    () =>
      appointments.map((appt) => ({
        ...appt,
        appointmentDate: parseAppointmentDateTime(appt.date, appt.time_slot),
      })),
    [appointments],
  );

  const upcomingAppointments = useMemo(() => {
    return appointmentsWithDate
      .filter((appt) => appt.appointmentDate && appt.appointmentDate >= todayStart && !appt.status?.toLowerCase().includes("cancel"))
      .sort((a, b) => {
        const aTime = a.appointmentDate?.getTime() ?? 0;
        const bTime = b.appointmentDate?.getTime() ?? 0;
        return aTime - bTime;
      });
  }, [appointmentsWithDate, todayStart]);

  const todaysAppointments = useMemo(() => {
    return appointmentsWithDate.filter((appt) => {
      const date = appt.appointmentDate;
      if (!date) return false;
      return date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
    });
  }, [appointmentsWithDate, now]);

  const completedAppointments = useMemo(
    () => appointments.filter((appt) => appt.status?.toLowerCase().includes("complete")),
    [appointments],
  );

  const patientSummary = useMemo(() => {
    const seen = new Set<string>();
    const ordered = [...appointmentsWithDate]
      .filter((appt) => appt.appointmentDate)
      .sort((a, b) => {
        const aTime = a.appointmentDate?.getTime() ?? 0;
        const bTime = b.appointmentDate?.getTime() ?? 0;
        return bTime - aTime;
      });

    const entries: Array<{ name: string; when: Date | null; status: string | undefined }> = [];
    for (const appt of ordered) {
      const label = appt.name ?? `Appointment #${appt.appointment_id}`;
      if (seen.has(label)) continue;
      seen.add(label);
      entries.push({ name: label, when: appt.appointmentDate ?? null, status: appt.status });
      if (entries.length >= 6) break;
    }
    return entries;
  }, [appointmentsWithDate]);

  const statusBreakdown = useMemo(() => {
    const summary = new Map<string, number>();
    appointments.forEach((appt) => {
      const key = appt.status?.toLowerCase() ?? "unknown";
      summary.set(key, (summary.get(key) ?? 0) + 1);
    });
    return Array.from(summary.entries());
  }, [appointments]);

  if (loadingDoctor && loadingAppointments) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-muted-foreground">
        Preparing your dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <Card className="bg-neutral-950/60 border border-neutral-800 text-gray-100">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
                <Stethoscope className="h-7 w-7 text-sky-400" />
                {doctor ? `Welcome back, Dr. ${doctor.name}` : "Doctor Dashboard"}
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                Monitor today’s schedule, follow up on patients, and keep track of clinic performance at a glance.
              </CardDescription>
            </div>
            <Badge className="bg-sky-500/15 text-sky-300 border border-sky-500/30">
              {doctor?.branch_name ? `Branch: ${doctor.branch_name}` : "Branch pending"}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <UserCircle className="h-5 w-5 text-sky-300" />
                <span className="uppercase tracking-wide text-xs text-gray-400">Speciality</span>
              </div>
              <p className="text-lg font-medium text-gray-100">
                {doctor?.gender ? `${doctor.gender} Specialist` : "General Physician"}
              </p>
              <p className="text-sm text-gray-400">
                Keep patient histories up to date and review notes before consultations.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <DollarSign className="h-5 w-5 text-emerald-300" />
                <span className="uppercase tracking-wide text-xs text-gray-400">Compensation Overview</span>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-100">
                  Fee per patient: {doctor ? `LKR ${doctor.fee_per_patient.toLocaleString("en-LK")}` : "—"}
                </p>
                <p className="text-sm text-gray-400">
                  Basic salary: {doctor ? `LKR ${doctor.basic_monthly_salary.toLocaleString("en-LK")}` : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950/60 border border-neutral-800 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-300" />
              Next Appointment
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Stay prepared for the upcoming consultation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingAppointments ? (
              <p className="text-sm text-gray-400">Loading schedule…</p>
            ) : upcomingAppointments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-center text-sm text-gray-400">
                You have no upcoming appointments for today. Enjoy your time to review patient notes.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcomingAppointments.slice(0, 3).map((appt) => (
                  <div
                    key={appt.appointment_id}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-gray-100">
                        {appt.name ?? `Appointment #${appt.appointment_id}`}
                      </p>
                      <Badge className={statusTone(appt.status)}>{labelFromStatus(appt.status)}</Badge>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-sky-300" />
                        <span>
                          {appt.appointmentDate?.toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }) ?? "Date TBC"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-300" />
                        <span>{appt.time_slot ?? "Time TBD"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full bg-sky-500/20 text-sky-200 hover:bg-sky-500/30">
              <Link to="/appointments">
                <ClipboardList className="mr-2 h-4 w-4" />
                View full schedule
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Appointments</CardTitle>
            <CalendarDays className="h-5 w-5 text-sky-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{appointments.length}</div>
            <p className="text-sm text-gray-500">Across all recorded visits</p>
          </CardContent>
        </Card>
        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Upcoming</CardTitle>
            <Clock className="h-5 w-5 text-amber-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{upcomingAppointments.length}</div>
            <p className="text-sm text-gray-500">Scheduled from today onward</p>
          </CardContent>
        </Card>
        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Today’s Appointments</CardTitle>
            <Users className="h-5 w-5 text-emerald-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{todaysAppointments.length}</div>
            <p className="text-sm text-gray-500">Patients visiting today</p>
          </CardContent>
        </Card>
        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
            <History className="h-5 w-5 text-indigo-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{completedAppointments.length}</div>
            <p className="text-sm text-gray-500">Consultations wrapped up successfully</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Today’s Schedule</CardTitle>
              <CardDescription className="text-sm text-gray-400">
                {todaysAppointments.length > 0
                  ? "Review patients arriving today and prepare in advance."
                  : "No appointments booked for today."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingAppointments ? (
              <div className="p-6 text-sm text-gray-400">Loading today’s appointments…</div>
            ) : todaysAppointments.length === 0 ? (
              <div className="p-6 text-sm text-gray-400">There are no appointments scheduled for today.</div>
            ) : (
              <ScrollArea className="h-[320px]">
                <ul className="divide-y divide-neutral-800">
                  {todaysAppointments.map((appt) => (
                    <li key={appt.appointment_id} className="px-6 py-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <p className="text-base font-medium text-gray-100">
                            {appt.name ?? `Appointment #${appt.appointment_id}`}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-300" />
                              {appt.time_slot ?? "Time TBD"}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-sky-300" />
                              {doctor?.branch_name ?? "Main Clinic"}
                            </span>
                          </div>
                        </div>
                        <Badge className={statusTone(appt.status)}>{labelFromStatus(appt.status)}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Patients</CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Last few patients you have interacted with.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patientSummary.length === 0 ? (
              <p className="text-sm text-gray-400">Patient history will appear once you start consulting.</p>
            ) : (
              <ul className="space-y-4">
                {patientSummary.map((entry) => (
                  <li key={entry.name} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-base font-medium text-gray-100">{entry.name}</p>
                        <p className="text-xs text-gray-500">
                          Last seen: {entry.when ? entry.when.toLocaleString() : "Not available"}
                        </p>
                      </div>
                      <Badge className={statusTone(entry.status)}>{labelFromStatus(entry.status)}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Workload Snapshot</CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Breakdown of appointment statuses to keep track of pending work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusBreakdown.length === 0 ? (
              <p className="text-sm text-gray-400">No appointments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {statusBreakdown.map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Badge className={statusTone(status)}>{labelFromStatus(status)}</Badge>
                      <span className="text-sm text-gray-300 capitalize">{status.replace(/_/g, " ")}</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-100">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-neutral-800 bg-neutral-950/60 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Jump straight into the workflows you use most.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="secondary" className="justify-start bg-sky-500/15 text-sky-200 hover:bg-sky-500/25">
              <Link to="/appointments">
                <ClipboardList className="mr-2 h-4 w-4" />
                Manage Appointments
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start bg-indigo-500/15 text-indigo-200 hover:bg-indigo-500/25">
              <Link to="/patients/medical-history">
                <History className="mr-2 h-4 w-4" />
                Review Medical History
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25">
              <Link to="/patients/medication">
                <PlusCircle className="mr-2 h-4 w-4" />
                Check Prescriptions
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            Need a new speciality or slot updated? Contact your branch manager for assistance.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}