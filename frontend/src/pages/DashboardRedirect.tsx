import { Navigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import PatientDashboard from "./patientDashboard";
import AdminDashboard from "./adminDashboard/adminDashboard";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import DoctorDashboard from "./doctorDashboard";

const DashboardRedirect = () => {
  const user = localStorage.getItem(LOCAL_STORAGE__USER);

  if (!user) {
    // if no user in localStorage, redirect to patient login
    return <Navigate to="/sign-in" replace />;
  }

  const parsedUser = JSON.parse(user);
  const user_role = parsedUser.role;

  return (
    <>
      <PageTitle title="Dashboard | MedSync" />
      {user_role === "Patient" && <PatientDashboard />}
      {user_role === "Doctor" && <DoctorDashboard />}
      {user_role !== "Patient" && user_role !== "Doctor" && <AdminDashboard />}
    </>
  );
};

export default DashboardRedirect;
