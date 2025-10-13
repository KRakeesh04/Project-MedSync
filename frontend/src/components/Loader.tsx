import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../services/authServices";
import { Skeleton } from "./ui/skeleton";

const Loader = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    const isAuthPath =
      path == "/staff/sign-in" || path == "/staff/sign-up" || path == "/sign-in" || path === "/sign-up";
    if (!token && !isAuthPath) {
      navigate("/sign-in");
      return;
    }
    validateToken().catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");

      if (!isAuthPath) {
        navigate("/sign-in");
      }
    });
  }, []);

  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[200px] w-[500px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[500px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
};

export default Loader;
