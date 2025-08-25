import CreateParcel from "@/pages/Sender/CreateParcel";
import type { ISidebarItems } from "@/types";
import { Bell, Package, Plus, Settings, User } from "lucide-react";
import { lazy } from "react";

const MyParcels = lazy(() => import("@/pages/Sender/MyParcels"));
const Profile = lazy(() => import("@/pages/Sender/Profile"));
const Notifications = lazy(() => import("@/pages/Shared/Notifications"));

export const senderSidebarItems: ISidebarItems[] = [
  {
    title: "Create Parcel",
    url: "/sender/create-parcel",
    isActive: true,
    icon: Plus,
    items: [
      {
        title: "New Parcel",
        url: "/sender/create-parcel",
        component: CreateParcel,
      },
    ],
  },
  {
    title: "My Parcels",
    url: "/sender/my-parcels",
    isActive: true,
    icon: Package,
    items: [
      {
        title: "All Parcels",
        url: "/sender/my-parcels",
        component: MyParcels,
      },
    ],
  },
  {
    title: "My Profile",
    url: "/sender/profile",
    icon: User,
    component: Profile,
    showInSidebar: false,
  },
  {
    title: "Account Settings",
    url: "/sender/profile",
    icon: Settings,
    component: Profile,
    showInSidebar: false,
  },
  {
    title: "Notifications",
    url: "/sender/notifications",
    icon: Bell,
    component: Notifications,
    showInSidebar: false,
  },
];
