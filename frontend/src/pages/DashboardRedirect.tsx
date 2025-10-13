import { Navigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import PatientDashboard from "./patientDashboard";
import AdminDashboard from "./adminDashboard";

const DashboardRedirect = () => {
  const user = localStorage.getItem("user");

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
      {user_role !== "Patient" && <AdminDashboard />}
    </>
  );
};

export default DashboardRedirect;
