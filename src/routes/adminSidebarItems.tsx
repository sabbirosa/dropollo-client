import type { ISidebarItems } from "@/types";
import {
  Bell,
  Package,
  Settings,
  SquareTerminal,
  User,
  Users,
} from "lucide-react";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));
const ParcelManagement = lazy(() => import("@/pages/Admin/ParcelManagement"));
const Profile = lazy(() => import("@/pages/Admin/Profile"));
const Account = lazy(() => import("@/pages/Shared/Account"));
const Notifications = lazy(() => import("@/pages/Shared/Notifications"));

export const adminSidebarItems: ISidebarItems[] = [
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: SquareTerminal,
    component: Analytics,
    isActive: true,
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "User Management",
    url: "/admin/user-management",
    isActive: true,
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/admin/user-management/all-users",
        component: UserManagement,
      },
    ],
  },
  {
    title: "Parcel Management",
    url: "/admin/parcel-management",
    isActive: true,
    icon: Package,
    items: [
      {
        title: "All Parcels",
        url: "/admin/parcel-management/all-parcels",
        component: ParcelManagement,
      },
    ],
  },
  {
    title: "My Profile",
    url: "/admin/profile",
    icon: User,
    component: Profile,
    showInSidebar: false,
  },
  {
    title: "Account Settings",
    url: "/admin/account",
    icon: Settings,
    component: Account,
    showInSidebar: false,
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    component: Notifications,
    showInSidebar: false,
  },
];
