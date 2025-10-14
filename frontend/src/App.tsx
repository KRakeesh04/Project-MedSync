import './App.css'
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layouts/DefaultLayout';
import StaffSignIn from "./pages/Authentication/staff-sign-in";
import StaffSignUp from './pages/Authentication/staff-sign-up';
import Users from './pages/users/activeUsers';
import DoctorsDetails from './pages/doctors/doctorsDetails';
import { ThemeProvider } from './components/theme-provider';
import DoctorsAppointmentDetails from './pages/doctors/doctorsAppointmentDetails';
import DoctorsPatientsHistory from './pages/doctors/doctorsPatientsHistory';
import DoctorSpeciality from './pages/doctors/doctorSpeciality';
import AddDoctor from './pages/doctors/addDoctor';
import Speciality from './pages/doctors/speciality';
import AddSpeciality from './pages/doctors/addSpeciality';
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

  return loading ? (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DashboardSkeleton />
    </ThemeProvider>
  ) : (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
              path="/doctors"
              element={
                <>
                  <PageTitle title="Doctors | MedSync" />
                  <DoctorsDetails />
                </>
              }
            />

            <Route
              path="/doctors-appointments"
              element={
                <>
                  <PageTitle title="Appointment details | MedSync" />
                  <DoctorsAppointmentDetails />
                </>
              }
            />

            <Route
              path="/doctors-patients-history"
              element={
                <>
                  <PageTitle title="Patients' history | MedSync" />
                  <DoctorsPatientsHistory />
                </>
              }
            />

        

          <Route
              path="/doctors-specialities"
              element={
                <>
                  <PageTitle title="Doctors' specialities | MedSync" />
                  <DoctorSpeciality />
                </>
              }
            />

            <Route
                path="/doctor-add"
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
                    <PageTitle title="Specialities | MedSync" />
                    <Speciality />
                  </>
                }
              />

              <Route
                path="/speciality-add"
                element={
                  <>
                    <PageTitle title="Add Speciality | MedSync" />
                    <AddSpeciality />
                  </>
                }
              />

          </Route>
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App;
