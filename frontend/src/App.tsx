import './App.css'
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layouts/DefaultLayout';
import StaffSignIn from "./pages/Authentication/staff-sign-in";
import StaffSignUp from './pages/Authentication/staff-sign-up';
import Users from './pages/users/activeUsers';
import DoctorsDetails from './pages/doctors/doctorsDetails';
import DoctorsPatientsHistory from './pages/doctors/doctorsPatientsHistory';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import DoctorSpeciality from './pages/doctors/doctorSpeciality';
import AddDoctor from './pages/doctors/addDoctor';
import Speciality from './pages/specialities/speciality';
import InactiveUsers from './pages/users/deletedUsers';
import PatientSignIn from './pages/Authentication/patient-sign-in';
import PatientSignUp from './pages/Authentication/patient-sign-up';
import DashboardRedirect from './pages/DashboardRedirect';
import LoginLayout from './layouts/LoginLayout';
import StaffPage from './pages/staff/staff';
import CurrentPatients from './pages/patients/currentPatients';
import ExPatients from './pages/patients/exPatients';
import Branches from './pages/branches/branches';
import Home from './pages/Home';
import MedicalHistory from './pages/patients/medicalhistory/medicalhistory';
import Treatments from './pages/patients/treatment/treatment';
import Medications from './pages/patients/medication/medication';
import PatientFullDetails from './pages/patients/patientFullDetails';
import AllAppointments from './pages/appointments/AllAppointments';
import AddAppointment from './pages/appointments/AddAppointment';
import DoctorTimeSlots from './pages/appointments/DoctorTimeSlots';

import { useNavigate } from "react-router-dom";
import {
  LOCAL_STORAGE__ROLE,
  LOCAL_STORAGE__TOKEN,
  LOCAL_STORAGE__USER,
  LOCAL_STORAGE__USER_ID,
  LOCAL_STORAGE__USERNAME,
  validateToken
} from "./services/authServices";
import DashboardSkeleton from './components/dashboard-skeleton';
import LogsTable from './pages/logs/logs';
import BranchManagerPage from './pages/managers/manager';

import MakePayment from './pages/billing/make_payment';
import AllInvoices from './pages/billing/invoice_details';
import OutstandingInvoices from './pages/billing/outstanding_balances';
import InsuranceTypesPage from './pages/insurance/insurancetypes';
import InsuranceHistory from './pages/insurance/insuranceHistory';
import Reports from './pages/reports/Reports';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const token = localStorage.getItem(LOCAL_STORAGE__TOKEN);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const path = window.location.pathname;
    const isAuthPath =
      path == "/staff/sign-in" || path == "/staff/sign-up" || path == "/sign-in" || path === "/sign-up";
    if (!token && !isAuthPath) {
      navigate("/sign-in");
      return;
    }
    validateToken().then(() => {
      setLoading(false)
    }).catch(() => {
      localStorage.removeItem(LOCAL_STORAGE__TOKEN);
      localStorage.removeItem(LOCAL_STORAGE__USER);
      localStorage.removeItem(LOCAL_STORAGE__USERNAME);
      localStorage.removeItem(LOCAL_STORAGE__ROLE);
      localStorage.removeItem(LOCAL_STORAGE__USER_ID);

      if (!isAuthPath) {
        navigate("/sign-in");
      }
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <>
        <Routes>
          <Route
            index
            element={
              <>
                <PageTitle title="Home | MedSync" />
                <Home />
              </>
            }
          />
        </Routes>

        {loading === true ? (
          <DashboardSkeleton />
        ) : (
          <>
            <Toaster position="top-right" />
            <Routes>

              <Route element={<LoginLayout />}>

                <Route
                  path="/sign-in"
                  element={
                    <>
                      <PageTitle title="Sign-in | MedSync" />
                      <PatientSignIn />
                    </>
                  }
                />

                <Route
                  path="/sign-up"
                  element={
                    <>
                      <PageTitle title="Sign-up | MedSync" />
                      <PatientSignUp />
                    </>
                  }
                />

                <Route
                  path="/staff/sign-in"
                  element={
                    <>
                      <PageTitle title="Sign-in | MedSync" />
                      <StaffSignIn />
                    </>
                  }
                />

                <Route
                  path="/staff/sign-up"
                  element={
                    <>
                      <PageTitle title="Sign-up | MedSync" />
                      <StaffSignUp />
                    </>
                  }
                />

              </Route>
              <Route element={<DefaultLayout />}>

                <Route
                  path="/dashboard"
                  element={
                    <>
                      <PageTitle title="Dashboard | MedSync" />
                      <DashboardRedirect />
                    </>
                  }
                />

                <Route
                  path="/users/active"
                  element={
                    <>
                      <PageTitle title="Active Users | MedSync" />
                      <Users />
                    </>
                  }
                />

                <Route
                  path="/users/inactive"
                  element={
                    <>
                      <PageTitle title="Deleted Users | MedSync" />
                      <InactiveUsers />
                    </>
                  }
                />

                <Route
                  path="/staff"
                  element={
                    <>
                      <PageTitle title="Staff | MedSync" />
                      <StaffPage />
                    </>
                  }
                />

                <Route
                  path="/branch-managers"
                  element={
                    <>
                      <PageTitle title="Branch Managers | MedSync" />
                      <BranchManagerPage />
                    </>
                  }
                />

                <Route
                  path="/current-patients"
                  element={
                    <>
                      <PageTitle title="Patients | MedSync" />
                      <CurrentPatients />
                    </>
                  }
                />

                <Route
                  path="/ex-patients"
                  element={
                    <>
                      <PageTitle title="Ex-Patients | MedSync" />
                      <ExPatients />
                    </>
                  }
                />

                <Route
                  path="/branches"
                  element={
                    <>
                      <PageTitle title="Branch | MedSync" />
                      <Branches />
                    </>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <>
                      <PageTitle title="Reports | MedSync" />
                      <Reports />
                    </>
                  }
                />

                <Route
                  path="/doctors"
                  element={
                    <>
                      <PageTitle title="Doctors | MedSync" />
                      <DoctorsDetails />
                    </>
                  }
                />

                {/* Appointment Routes */}
                <Route
                  path="/appointments"
                  element={
                    <>
                      <PageTitle title="Appointments | MedSync" />
                      <AllAppointments />
                    </>
                  }
                />

                <Route
                  path="/appointments/add"
                  element={
                    <>
                      <PageTitle title="Add Appointment | MedSync" />
                      <AddAppointment />
                    </>
                  }
                />

                <Route
                  path="/appointments/slots"
                  element={
                    <>
                      <PageTitle title="Available Slots | MedSync" />
                      <DoctorTimeSlots />
                    </>
                  }
                />

                {/* <Route
              path="/doctors-appointments"
              element={
                <>
                  <PageTitle title="Appointment details | MedSync" />
                  <DoctorsAppointmentDetails />
                </>
              }
            /> */}

                <Route
                  path="/doctors-patients-history"
                  element={
                    <>
                      <PageTitle title="Doctors-Patients Overview | MedSync" />
                      <DoctorsPatientsHistory />
                    </>
                  }
                />



                <Route
                  path="/doctors/specialities"
                  element={
                    <>
                      <PageTitle title="Doctors' Speciality | MedSync" />
                      <DoctorSpeciality />
                    </>
                  }
                />

                <Route
                  path="/doctors/add"
                  element={
                    <>
                      <PageTitle title="Add Doctor | MedSync" />
                      <AddDoctor />
                    </>
                  }
                />

                <Route
                  path="/speciality"
                  element={
                    <>
                      <PageTitle title="Speciality | MedSync" />
                      <Speciality />
                    </>
                  }
                />

                <Route
                  path="/logs"
                  element={
                    <>
                      <PageTitle title="Logs | MedSync" />
                      <LogsTable />
                    </>
                  }
                />

                <Route path="/patients/treatment" element={
                  <>
                    <PageTitle title="Patient Treatments | MedSync" />
                    <Treatments />
                  </>
                } />

                {/* <Route
                  path="/patients/treatment/add"
                  element={
                    <>
                      <PageTitle title="Add Treatment | MedSync" />
                      <TreatmentAdd />
                    </>
                  }
                /> */}

                <Route
                  path="/patients/medical-history"
                  element={
                    <>
                      <PageTitle title="Patient Medical History | MedSync" />
                      <MedicalHistory />
                    </>
                  }
                />

                <Route
                  path="/patients/full"
                  element={
                    <>
                      <PageTitle title="Patient Details | MedSync" />
                      <PatientFullDetails />
                    </>
                  }
                />

                <Route
                  path="/patients/medication"
                  element={
                    <>
                      <PageTitle title="Patient Medications | MedSync" />
                      <Medications />
                    </>
                  }
                />
                <Route
                  path="/make-payment"
                  element={
                    <>
                      <PageTitle title="Make Payment | MedSync" />
                      <MakePayment />
                    </>
                  }
                />
                <Route
                  path="/invoice_details"
                  element={
                    <>
                      <PageTitle title="Invoice Details | MedSync" />
                      <AllInvoices />
                    </>
                  }
                />
                <Route
                  path="/outstanding-balances"
                  element={
                    <>
                      <PageTitle title="Outstanding Balances | MedSync" />
                      <OutstandingInvoices />
                    </>
                  }
                />

                <Route
                  path="/insurance-types"
                  element={
                    <>
                      <PageTitle title="Insurance Types | MedSync" />
                      <InsuranceTypesPage />
                    </>
                  }
                />

                <Route
                  path="/insurance-history"
                  element={
                    <>
                      <PageTitle title="Insurance Claim History | MedSync" />
                      <InsuranceHistory />
                    </>
                  }
                />


              </Route>
            </Routes>
          </>
        )}
      </>
    </ThemeProvider>
  );
}

export default App;