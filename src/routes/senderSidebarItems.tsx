import CreateParcel from "@/pages/Sender/CreateParcel";
import type { ISidebarItems } from "@/types";
import { Bell, Package, Plus, Settings, User } from "lucide-react";
import { lazy } from "react";

const MyParcels = lazy(() => import("@/pages/Sender/MyParcels"));
const Profile = lazy(() => import("@/pages/Sender/Profile"));
const Account = lazy(() => import("@/pages/Shared/Account"));
const Notifications = lazy(() => import("@/pages/Shared/Notifications"));

export const senderSidebarItems: ISidebarItems[] = [
  {
    title: "Create Parcel",
    url: "/sender/create-parcel",
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
  },
  {
    title: "Account Settings",
    url: "/sender/account",
    icon: Settings,
    component: Account,
  },
  {
    title: "Notifications",
    url: "/sender/notifications",
    icon: Bell,
    component: Notifications,
  },
];
