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

          </Route>
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App
