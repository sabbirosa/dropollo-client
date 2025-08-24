import type { ISidebarItems } from "@/types";
import {
  FileText,
  Package,
  Settings2,
  SquareTerminal,
  User,
  Users
} from "lucide-react";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));
const ParcelManagement = lazy(() => import("@/pages/Admin/ParcelManagement"));
const Reports = lazy(() => import("@/pages/Admin/Reports"));
const Settings = lazy(() => import("@/pages/Admin/Settings"));
const Profile = lazy(() => import("@/pages/Admin/Profile"));

export const adminSidebarItems: ISidebarItems[] = [
  {
    title: "Dashboard",
    url: "#",
    icon: SquareTerminal,
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
    icon: Users,
    isActive: true,
    items: [
      {
        title: "All Users",
        url: "/admin/user-management",
        component: UserManagement,
      },
    ],
  },
  {
    title: "Parcel Management",
    url: "#",
    icon: Package,
    items: [
      {
        title: "All Parcels",
        url: "/admin/parcel-management",
        component: ParcelManagement,
      },
      {
        title: "Pending Deliveries",
        url: "/admin/pending-deliveries",
        component: ParcelManagement,
      },
      {
        title: "Delivery Issues",
        url: "/admin/delivery-issues",
        component: ParcelManagement,
      },
    ],
  },
  {
    title: "Reports & Analytics",
    url: "#",
    icon: FileText,
    items: [
      {
        title: "Delivery Reports",
        url: "/admin/reports",
        component: Reports,
      },
      {
        title: "Financial Reports",
        url: "/admin/financial-reports",
        component: Reports,
      },
      {
        title: "Performance Metrics",
        url: "/admin/performance",
        component: Reports,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        component: Settings,
      },
      {
        title: "Security",
        url: "/admin/security",
        component: Settings,
      },
      {
        title: "Notifications",
        url: "/admin/notifications",
        component: Settings,
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    icon: User,
    items: [
      {
        title: "My Profile",
        url: "/admin/profile",
        component: Profile,
      },
    ],
  },
];
