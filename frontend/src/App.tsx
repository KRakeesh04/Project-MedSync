// Updated App.tsx
import './App.css'
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layouts/DefaultLayout';
import StaffSignIn from "./pages/Authentication/staff-sign-in";
import StaffSignUp from './pages/Authentication/staff-sign-up';
import Users from './pages/users/activeUsers';
import InactiveUsers from './pages/users/deletedUsers';
import { ThemeProvider } from './components/theme-provider';
import PatientSignIn from './pages/Authentication/patient-sign-in';
import PatientSignUp from './pages/Authentication/patient-sign-up';
import DashboardRedirect from './pages/DashboardRedirect';
import Loader from './components/Loader';
import LoginLayout from './layouts/LoginLayout';
import AllAppointments from './pages/appointments/AllAppointments';
import AddAppointments from './pages/appointments/AddAppointment';
import DoctorTimeSlots from './pages/appointments/DoctorTimeSlots';
import AddAppointment from './pages/appointments/AddAppointment';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return loading ? (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Loader />
    </ThemeProvider>
  ) : (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
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
              index
              element={<DashboardRedirect />}
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

            {/* Appointment Routes */}
            <Route
              path="/appointments"
              element={
                <>
                  <PageTitle title="All Appointments | MedSync" />
                  <AllAppointments />
                </>
              }
            />

            <Route
              path="/appointments/time-slots"
              element={
                <>
                  <PageTitle title="Doctors' Time Slots | MedSync" />
                  <DoctorTimeSlots />
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

          </Route>
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App