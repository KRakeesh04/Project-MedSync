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
import { getPatientsCountPerBranch } from "@/services/patientServices";
import { BranchPatientsPieChart } from "./piechartbranchesandpatients";
import DoctorsAppointment from "./doctorsAppointmenttable";
import DoctorsAppointmentsByDoctorId from "./doctorsAppointmentByDcotor_id";
import { getAppointmentsByDoctorIdCount} from "@/services/appoinmentServices";

const AdminDashboard: React.FC = () => {
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const [totalBranches, setTotalBranches] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [patientsCountPerBranch, setPatientsCountPerBranch] = useState<
    { branch_name: string; patient_count: number }[]
  >([]);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDashboardDetails | null>(null);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);

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

        setTotalPatients(Number(patientsRes?.total_count ?? 0));
        setTotalStaffs(Number(staffsRes?.total_count ?? 0));
        setTotalBranches(Number(branchesRes?.total_count ?? 0));
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

      try {
        const counts = await getPatientsCountPerBranch();
        setPatientsCountPerBranch(Array.isArray(counts) ? counts : []);
      } catch (error) {
        console.error("Error fetching patients count per branch:", error);
      }

      try {
        const details = await doctorDashboardDetails();
        setDoctorDetails(details ?? null);
      } catch (error) {
        console.error("Error fetching doctor dashboard details:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!doctorDetails?.doctor_id) return;
    (async () => {
      try {
        const res = await getAppointmentsByDoctorIdCount(doctorDetails.doctor_id);
        setAppointmentsCount(res ?? 0);
      } catch (error) {
        console.error("Error fetching doctor's appointments count:", error);
      }
    })();
  }, [doctorDetails?.doctor_id]);

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
              Total Staffs
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

        {/* Current Month Revenue */}
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
      </div>

      <br />

      {/* Charts */}
      <div className="flex flex-col w-full">
        <Tabs defaultValue="Appointments" className="w-full">
          <div className="flex justify-center">
            <TabsList className="rounded-full">
              <TabsTrigger value="Appointments" className="rounded-full">
                Monthly Appointments
              </TabsTrigger>
              <TabsTrigger value="Revenue" className="rounded-full">
                Monthly Revenue
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="Appointments" className="mt-6">
            <MonthlyAppointmentsChart />
          </TabsContent>

          <TabsContent value="Revenue" className="mt-6">
            <MonthlyRevenueChart />
          </TabsContent>
        </Tabs>
      </div>

      <br />

      <div className="flex w-full items-start gap-6">
        <div className="w-[400px] self-start pt-20">
          <BranchPatientsPieChart />
        </div>

        <div className="flex-1 self-start">
          <DoctorsAppointment />
        </div>
      </div>

      <h2 className="text-lg font-medium">
        Doctors view {doctorDetails?.name ?? ""}
      </h2>

      <div>
        <DoctorsAppointmentsByDoctorId />
      </div>

      {/* Appointments count card */}
      <div className="mt-6 w-[400px]">
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Appointments
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">
              {appointmentsCount}
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">Appointments</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
