import type { ISidebarItems } from "@/types";
import { Bell, History, Inbox, Settings, User } from "lucide-react";
import { lazy } from "react";

const IncomingParcels = lazy(() => import("@/pages/Receiver/IncomingParcels"));
const DeliveryHistory = lazy(() => import("@/pages/Receiver/DeliveryHistory"));
const Profile = lazy(() => import("@/pages/Receiver/Profile"));
const Account = lazy(() => import("@/pages/Shared/Account"));
const Notifications = lazy(() => import("@/pages/Shared/Notifications"));

export const receiverSidebarItems: ISidebarItems[] = [
  {
    title: "Incoming Parcels",
    url: "/receiver/incoming-parcels",
    isActive: true,
    icon: Inbox,
    items: [
      {
        title: "All Parcels",
        url: "/receiver/incoming-parcels",
        component: IncomingParcels,
      },
    ],
  },
  {
    title: "Delivery History",
    url: "/receiver/delivery-history",
    isActive: true,
    icon: History,
    items: [
      {
        title: "All History",
        url: "/receiver/delivery-history",
        component: DeliveryHistory,
      },
    ],
  },
  {
    title: "My Profile",
    url: "/receiver/profile",
    icon: User,
    component: Profile,
    showInSidebar: false,
  },
  {
    title: "Account Settings",
    url: "/receiver/account",
    icon: Settings,
    component: Account,
    showInSidebar: false,
  },
  {
    title: "Notifications",
    url: "/receiver/notifications",
    icon: Bell,
    component: Notifications,
    showInSidebar: false,
  },
];
