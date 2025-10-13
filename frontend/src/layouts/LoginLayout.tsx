import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const TOAST_LIMIT = 3; // max toasts visible at once

export default function LoginLayout() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <>
      <Toaster position="top-right" />
      <main className="flex-1 p-4 md:p-6 2xl:p-10">
        <Outlet />
      </main>
    </>
  );
}