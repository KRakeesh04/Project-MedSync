import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { Role } from "@/services/utils";

export function getCurrentRole(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LOCAL_STORAGE__ROLE) || "";
}

export function hasAnyRole(roles: string[]): boolean {
  const role = getCurrentRole();
  return typeof role === "string" && roles.includes(role);
}

// Common capabilities aligned with sidebar rules
export const can = {
  addBranch: () => hasAnyRole([Role.SUPER_ADMIN]),
  deleteBranch: () => hasAnyRole([Role.SUPER_ADMIN]),

  addDoctor: () => hasAnyRole([Role.BRANCH_MANAGER, Role.SUPER_ADMIN]),

  addAppointment: () => hasAnyRole([
    Role.RECEPTIONIST,
    Role.DOCTOR,
    Role.ADMIN_STAFF,
    Role.BRANCH_MANAGER,
    Role.SUPER_ADMIN,
  ]),
  editAppointment: () => hasAnyRole([
    Role.RECEPTIONIST,
    Role.DOCTOR,
    Role.ADMIN_STAFF,
    Role.BRANCH_MANAGER,
    Role.SUPER_ADMIN,
  ]),
  deleteAppointment: () => hasAnyRole([Role.BRANCH_MANAGER, Role.SUPER_ADMIN]),

  addInsuranceType: () => hasAnyRole([Role.BRANCH_MANAGER, Role.SUPER_ADMIN]),
};

export default { getCurrentRole, hasAnyRole, can };
