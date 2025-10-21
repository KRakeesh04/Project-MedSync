import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, Building2, DollarSign } from "lucide-react";
import {
  doctorDashboardDetails,
  fetchTotalBranchesCount,
  fetchTotalPatientsCount,
  fetchTotalStaffsCount,
  type DoctorDashboardDetails,
} from "@/services/adminDashboardServices";
import { MonthlyAppointmentsChart } from "./monthlyappoinmenttable";
import { MonthlyRevenueChart } from "./monthlyrevenuetable";
import { fetchMonthlyRevenueForYear } from "@/services/adminDashboardServices";
import { getDoctorsAppointments } from "@/services/appoinmentServices";
import { getAllBranches, type Branch } from "@/services/branchServices";
import { BranchPatientsPieChart } from "./piechartbranchesandpatients";
import DoctorsAppointment from "./doctorsAppointmenttable";
import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE__USER, LOCAL_STORAGE__USER_ID } from "@/services/authServices";
import { Role } from "@/services/utils";
import DoctorsAppointmentsByDoctorId from "./doctorsAppointmentByDcotor_id";

const AdminDashboard: React.FC = () => {
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const [totalBranches, setTotalBranches] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  // patients per branch handled inside BranchPatientsPieChart
  const [defaultBranchName, setDefaultBranchName] = useState<string | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDashboardDetails | null>(null);

  // doctor's appointments count is handled inside doctor-specific components
  const [smallAppointmentsCount, setSmallAppointmentsCount] = useState<number>(0);

  const user = localStorage.getItem(LOCAL_STORAGE__USER);
  if (!user) {
    return <Navigate to="/staff/sign-in" replace />;
  }
  // parse user once and read helpful fields
  const parsedUser = JSON.parse(user);
  const user_id = localStorage.getItem(LOCAL_STORAGE__USER_ID) || parsedUser.user_id || parsedUser.userId;
  if (!user_id) {
    return <Navigate to="/staff/sign-in" replace />;
  }
  // branch info is available if needed: parsedUser.branch_id or parsedUser.branch
  const userRole = parsedUser.role;

  useEffect(() => {
    (async () => {
      try {
        const [
          patientsRes,
          staffsRes,
          branchesRes,
        ] = await Promise.all([
          fetchTotalPatientsCount(),
          fetchTotalStaffsCount(),
          fetchTotalBranchesCount(),
        ]);

        // robustly parse counts from various possible API shapes
        const parseCount = (obj: any) => {
          if (obj == null) return 0;
          if (typeof obj === "number") return obj;
          if (typeof obj === "string") return Number(obj) || 0;
          const candidates = ["total_count", "patient_count", "staff_count", "total", "count", "appointments_count"];
          for (const k of candidates) {
            if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) return Number(obj[k]) || 0;
          }
          // nested shape { data: { total_count: x } }
          if (obj.data) return parseCount(obj.data);
          return 0;
        };

        setTotalPatients(parseCount(patientsRes));
        setTotalStaffs(parseCount(staffsRes));
        setTotalBranches(parseCount(branchesRes));
      } catch (error) {
        console.error("Error fetching counts:", error);
      }

      try {
        // Revenue for current month
        const year = new Date().getFullYear();
        const rows = await fetchMonthlyRevenueForYear(year);
        const currentMonth = new Date().toISOString().slice(0, 7);
        const current = rows?.find((r: { month: string }) => r.month === currentMonth);
        setRevenue(Number(current?.revenue ?? 0));
      } catch (err) {
        console.error("Failed to fetch current month revenue:", err);
      }

      // BranchPatientsPieChart fetches its own counts; no-op here

      // If user has a branch_id, resolve its name and use as default for pie chart
      try {
        const userBranchId = parsedUser.branch_id ?? parsedUser.branch ?? null;
        if (userBranchId) {
          const branchesRes = await getAllBranches();
          const branches: Branch[] = branchesRes.branches ?? [];
          const match = branches.find((b) => Number(b.branch_id) === Number(userBranchId));
          if (match) setDefaultBranchName(match.name);
        }
      } catch (err) {
        // non-fatal
        console.error("Error resolving user's branch name:", err);
      }

      try {
        const details = await doctorDashboardDetails();
        setDoctorDetails(details ?? null);
      } catch (error) {
        console.error("Error fetching doctor dashboard details:", error);
      }
    })();
  }, []);

  // If revenue is hidden (not manager/super admin), fetch a small appointments count for the corner card
  useEffect(() => {
    const isRevenueVisible = userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER;
    if (isRevenueVisible) return;

    (async () => {
      try {
        const resp = await getDoctorsAppointments(1, 0);
        const n = resp?.appointments_count ?? resp?.appointments_count === 0 ? resp.appointments_count : null;
        setSmallAppointmentsCount(Number(n ?? 0));
      } catch (err) {
        console.error("Error fetching small appointments count:", err);
      }
    })();
  }, [userRole]);

  // doctor-specific appointment counts are handled inside the doctor components

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Total Patients
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">
              {totalPatients}
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">Active and discharged patients</p>
          </CardFooter>
        </Card>

        {/* Total Staffs */}
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Total Staff
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <UserCheck className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">{totalStaffs}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">All registered staff members</p>
          </CardFooter>
        </Card>

        {/* Total Branches */}
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Total Branches
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">{totalBranches}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">Operating medical branches</p>
          </CardFooter>
        </Card>

        {/* Current Month Revenue - only Branch Manager & Super Admin */}
        {(userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER) && (
          <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium text-gray-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Current Month Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-gray-100">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "LKR",
                  minimumFractionDigits: 2,
                }).format(revenue ?? 0)}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardFooter>
          </Card>
        )}
      </div>

      <br />

      {userRole === Role.DOCTOR ? (
        <div>
          <h2 className="text-lg font-medium">Doctors view {doctorDetails?.name ?? ""}</h2>
          <div>
            <DoctorsAppointmentsByDoctorId />
          </div>
        </div>
      ) : null}

      {/* If revenue is hidden for this user, show a compact appointments card in the corner */}
      {!(userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER) && (
        <div className="mt-6 w-[220px]">
          <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">Appointments</CardTitle>
              <div className="p-2 rounded-full bg-neutral-800">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-gray-100">{smallAppointmentsCount}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">Appointments</p>
            </CardFooter>
          </Card>
        </div>
      )}


      {/* Charts - only visible to Super Admin and Branch Manager */}
      <div className="flex flex-col w-full">
        <Tabs defaultValue="Appointments" className="w-full">
          <div className="flex justify-center">
            <TabsList className="rounded-full">
              <TabsTrigger value="Appointments" className="rounded-full">
                Monthly Appointments
              </TabsTrigger>
              {/* Only show Revenue tab to Super Admin & Branch Manager */}
              {(userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER) && (
                <TabsTrigger value="Revenue" className="rounded-full">
                  Monthly Revenue
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="Appointments" className="mt-6">
            <MonthlyAppointmentsChart />
          </TabsContent>

          {/* Revenue chart visible only to Super Admin & Branch Manager */}
          {(userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER) && (
            <TabsContent value="Revenue" className="mt-6">
              <MonthlyRevenueChart />
            </TabsContent>
          )}
        </Tabs>
      </div>

      <br />

      <div className="flex w-full items-start gap-6">
        {/* Pie chart and appointments table are graphs - show only to Super Admin & Branch Manager */}
        {(userRole === Role.SUPER_ADMIN || userRole === Role.BRANCH_MANAGER) && (
          <>
            <div className="w-[400px] self-start pt-20">
              <BranchPatientsPieChart defaultBranchName={defaultBranchName} />
            </div>

            <div className="flex-1 self-start">
              <DoctorsAppointment />
            </div>
          </>
        )}
      </div>

    </>
  );
};

export default AdminDashboard;
