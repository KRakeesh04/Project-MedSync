import {
  Hospital,
  Receipt,
  ClipboardClock,
  Stethoscope,
  User,
  Users,
  HeartPulse,
  HandCoins,
  type LucideIcon,
  FileClock,
  FileStack,
  IdCardLanyard,
  BookOpen,
  FileUser,
  BookUser,
  UserSearch,
  ClipboardPlus,
  ClipboardList,
  CalendarSync,
  CalendarX2,
  CreditCard,
  ReceiptText,
  ClockPlus,
  BanknoteX,
  ClipboardPenLine,
  ChevronRight,
  LogOut,
  PanelRightOpen,
  UsersRound,
  UserRoundX,
  UserRoundCheck
} from "lucide-react"
// billing and paments - Receipt
// patient - Users
// doctor - Stethoscope
// insurance - HandCoins
// appointments - ClipboardClock
// home - Hospital
// user - user

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Role } from "@/utils";
import { LOCAL_STORAGE__ROLE, LOCAL_STORAGE__TOKEN, LOCAL_STORAGE__USER, LOCAL_STORAGE__USER_ID, LOCAL_STORAGE__USERNAME } from "@/services/authServices";
import { formatRole } from "@/services/utils";


const ROLE_SUPER_ADMIN = Role.SUPER_ADMIN;
const ROLE_BRANCH_MANAGER = Role.BRANCH_MANAGER;
const ROLE_DOCTOR = Role.DOCTOR;
const ROLE_ADMIN_STAFF = Role.ADMIN_STAFF;
const ROLE_NURSE = Role.NURSE;
const ROLE_RECEPTIONIST = Role.RECEPTIONIST;
const ROLE_BILLING_STAFF = Role.BILLING_STAFF;
const ROLE_INSURANCE_AGENT = Role.INSURANCE_AGENT;
const ROLE_PATIENT = Role.PATIENT;
const ROLE_USER = "User";


export interface LocalStorage_User {
  user_id: number;
  username: string;
  role: string;
  name: string;
  approved: boolean;
  created_at: string;
}

interface SidebarItemLink {
  type: "child";
  title: string;
  url: string;
  icon: LucideIcon;
  hideIf?: (role: string) => boolean;
}

interface SidebarItemGroup {
  type: "parent";
  title: string;
  icon: LucideIcon;
  children: Array<SidebarItemLink>;
  hideIf?: (role: string) => boolean;
}

const items: Array<SidebarItemLink | SidebarItemGroup> = [
  {
    type: "child",
    title: "Dashboard",
    url: "/",
    icon: Hospital,
    // hideIf: (role) => typeof role !== "string" ||
    //   ![ROLE_RECEPTIONIST, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
  },
  {
    type: "parent",
    title: "Users",
    icon: UsersRound,
    children: [
      {
        type: "child",
        title: "Active Users",
        url: "/users/active",
        icon: UserRoundCheck,
      },
      {
        type: "child",
        title: "Deleted Users",
        url: "/users/inactive",
        icon: UserRoundX,
      },
    ],
  },
  {
    type: "parent",
    title: "Patients",
    icon: HeartPulse,
    // hideIf: (role) => typeof role !== "string" || role != ROLE_PATIENT,
    children: [
      {
        type: "child",
        title: "In-Patients",
        url: "",
        icon: HeartPulse,
        // hideIf: (role) => typeof role !== "string" ||
        //   [ROLE_PATIENT, ROLE_INSURANCE_AGENT].includes(role),
      },
      {
        type: "child",
        title: "Ex-Patients",
        url: "",
        icon: HeartPulse,
        // hideIf: (role) => typeof role !== "string" ||
        //   [ROLE_PATIENT, ROLE_INSURANCE_AGENT].includes(role),
      },
      {
        type: "child",
        title: "Medical History",
        url: "",
        icon: BookOpen,
        // hideIf: (role) => typeof role !== "string" ||
        //   [ROLE_PATIENT, ROLE_INSURANCE_AGENT, ROLE_RECEPTIONIST, ROLE_BILLING_STAFF].includes(role),
      },
      {
        type: "child",
        title: "Treatments details",
        url: "",
        icon: FileClock,
        // hideIf: (role) => typeof role !== "string" ||
        //   [ROLE_PATIENT, ROLE_INSURANCE_AGENT, ROLE_RECEPTIONIST, ROLE_BILLING_STAFF].includes(role),
      },
      {
        type: "child",
        title: "Medication details",
        url: "",
        icon: FileClock,
        // hideIf: (role) => typeof role !== "string" ||
        //   [ROLE_PATIENT, ROLE_INSURANCE_AGENT, ROLE_RECEPTIONIST, ROLE_BILLING_STAFF].includes(role),
      }
    ],
  },
  // {
  //   type: "parent",
  //   title: "Patients",
  //   icon: HeartPulse,
  //   hideIf: (role) => typeof role !== "string" || role != ROLE_PATIENT,
  //   children: [
  //     {
  //       type: "child",
  //       title: "Medical History",
  //       url: "",
  //       icon: BookOpen,
  //       hideIf: (role) => typeof role !== "string" ||
  //         ![ROLE_PATIENT, ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
  //     },
  //     {
  //       type: "child",
  //       title: "Outstanding bills",
  //       url: "",
  //       icon: FileStack,
  //       hideIf: (role) => typeof role !== "string" ||
  //         ![ROLE_PATIENT, ROLE_BILLING_STAFF, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
  //     },
  //     {
  //       type: "child",
  //       title: "Insurances info",
  //       url: "",
  //       icon: IdCardLanyard,
  //       hideIf: (role) => typeof role !== "string" ||
  //         ![ROLE_PATIENT, ROLE_INSURANCE_AGENT, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
  //     },
  //     {
  //       type: "child",
  //       title: "Payment history",
  //       url: "",
  //       icon: FileClock,
  //       hideIf: (role) => typeof role !== "string" ||
  //         ![ROLE_PATIENT, ROLE_BILLING_STAFF, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
  //     }
  //   ],
  // },
  {
    type: "parent",
    title: "Doctors",
    icon: Stethoscope,
    hideIf: (role) => typeof role !== "string",
    children: [
      {
        type: "child",
        title: "All Doctors",
        url: "",
        icon: HeartPulse,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Doctors' Specialities",
        url: "",
        icon: FileUser,
        hideIf: (role) => typeof role !== "string",
      },
      {
        type: "child",
        title: "All Specialities",
        url: "",
        icon: BookUser,
        // hideIf: (role) => typeof role !== "string" ||
        //   [ROLE_PATIENT, ROLE_INSURANCE_AGENT].includes(role),
      },
    ],
  },
  {
    type: "parent",
    title: "Staff",
    icon: Users,
    children: [
      {
        type: "child",
        title: "All Staffs",
        url: "",
        icon: UserSearch,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_ADMIN_STAFF, ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      // {
      //   type: "child",
      //   title: "Reports",
      //   url: "",
      //   icon: ClipboardPenLine,
      //   hideIf: (role) => typeof role !== "string" ||
      //     ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      // },
    ],
  },
  {
    type: "parent",
    title: "Appointments",
    icon: ClipboardClock,
    // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "All Appointments",
        url: "",
        icon: ClipboardList,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Doctors' avilable time",
        url: "",
        icon: ClockPlus,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Add Appointment",
        url: "",
        icon: ClipboardPlus,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      // {
      //   type: "child",
      //   title: "Schedule/Reschedule",
      //   url: "",
      //   icon: CalendarSync,
      //   hideIf: (role) => typeof role !== "string" ||
      //     ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      // },
      // {
      //   type: "child",
      //   title: "Cancelled",
      //   url: "",
      //   icon: CalendarX2,
      //   hideIf: (role) => typeof role !== "string" ||
      //     ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      // },
    ],
  },
  {
    type: "parent",
    title: "Billing & Payment",
    icon: Receipt,
    // hideIf:(role) => typeof role !== "string" || ![ROLE_DOCTOR].includes(role),
    children: [
      {
        type: "child",
        title: "Invoice details",
        url: "",
        icon: ReceiptText,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Outstanding balances",
        url: "",
        icon: BanknoteX,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Make payment",
        url: "",
        icon: CreditCard,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
  {
    type: "parent",
    title: "Insurance info",
    icon: HandCoins,
    // hideIf: (role) => typeof role !== "string" ||
    //   ![ROLE_BILLING_STAFF, ROLE_INSURANCE_AGENT, ROLE_DOCTOR, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
    children: [
      {
        type: "child",
        title: "Claimed History",
        url: "",
        icon: HandCoins,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_BILLING_STAFF, ROLE_INSURANCE_AGENT, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Requests",
        url: "",
        icon: HandCoins,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Insurance Types",
        url: "",
        icon: HandCoins,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_BILLING_STAFF, ROLE_INSURANCE_AGENT, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
      {
        type: "child",
        title: "Available Patient",
        url: "",
        icon: HandCoins,
        // hideIf: (role) => typeof role !== "string" ||
        //   ![ROLE_DOCTOR, ROLE_ADMIN_STAFF, ROLE_BRANCH_MANAGER, ROLE_SUPER_ADMIN].includes(role),
      },
    ],
  },
]

export function AppSidebar() {
  const [loading, setLoading] = useState<boolean>(false);
  const { toggleSidebar, open } = useSidebar();
  const navigate = useNavigate();
  const userStringified = localStorage.getItem(LOCAL_STORAGE__USER);
  const user: LocalStorage_User | null = userStringified
    ? JSON.parse(userStringified)
    : null;
  const role = localStorage.getItem(LOCAL_STORAGE__ROLE) || "";
  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE__USER);
    localStorage.removeItem(LOCAL_STORAGE__ROLE);
    localStorage.removeItem(LOCAL_STORAGE__USER_ID);
    localStorage.removeItem(LOCAL_STORAGE__USERNAME);
    localStorage.removeItem(LOCAL_STORAGE__TOKEN);
    navigate("/sign-in");
  };

  return loading ? (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  ) : (
    <Sidebar
      collapsible="icon"
      onClick={!open ? toggleSidebar : undefined}
    >
      <SidebarHeader>
        <SidebarMenu>
          {open ?
            <SidebarMenuItem className="flex flex-row">
              <div>
                <img src="/logo.svg" />
              </div>
              <div>
                <PanelRightOpen size={20} className="cursor-pointer" onClick={toggleSidebar} />
              </div>
            </SidebarMenuItem>
            :
            <SidebarMenuItem>
              <img src="/favicon.svg" />
            </SidebarMenuItem>
          }
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) =>
              item.type !== "child" || item.hideIf?.(role) ? null : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon size={25} className="size-40" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
        {items.map((item) =>
          item.type !== "parent" || item.hideIf?.(role) ? null : (
            <SidebarGroup>
              <SidebarMenu>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon size={25} className="size-40" />
                        {item.title}
                        <ChevronRight className="ml-auto duration-200 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((child) =>
                          item.hideIf?.(role) ? null : (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink to={child.url}>
                                  <child.icon size={25} className="size-40" />
                                  <span>{child.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroup>
          ),
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-15">
                  {user ? (
                    <>
                      <User />
                      <div className="flex flex-col pl-1">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs">
                          {formatRole(user.role)}
                        </span>
                      </div>
                    </>
                  ) : null}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                // className="w-[--radix-popper-anchor-width]"
                className="w-full w-(--sidebar-width)"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                {/* <DropdownMenuItem>Team</DropdownMenuItem> */}
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive"
                  onClick={logout}>
                  <LogOut />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}