import ConfirmDelivery from "@/pages/Receiver/ConfirmDelivery";
import type { ISidebarItems } from "@/types";
import {
    Bell,
    CheckSquare,
    History,
    Inbox,
    User
} from "lucide-react";
import { lazy } from "react";

const IncomingParcels = lazy(() => import("@/pages/Receiver/IncomingParcels"));
const DeliveryHistory = lazy(() => import("@/pages/Receiver/DeliveryHistory"));
const Profile = lazy(() => import("@/pages/Receiver/Profile"));

export const receiverSidebarItems: ISidebarItems[] = [
  {
    title: "Deliveries",
    url: "#",
    icon: CheckSquare,
    isActive: true,
    items: [
      {
        title: "Confirm Delivery",
        url: "/receiver/confirm-delivery",
        component: ConfirmDelivery,
      },
      {
        title: "Pending Confirmations",
        url: "/receiver/pending",
        component: ConfirmDelivery,
      },
    ],
  },
  {
    title: "Incoming Parcels",
    url: "#",
    icon: Inbox,
    items: [
      {
        title: "Expected Deliveries",
        url: "/receiver/incoming-parcels",
        component: IncomingParcels,
      },
      {
        title: "Track Incoming",
        url: "/receiver/track-incoming",
        component: IncomingParcels,
      },
      {
        title: "Delivery Schedule",
        url: "/receiver/schedule",
        component: IncomingParcels,
      },
    ],
  },
  {
    title: "History",
    url: "#",
    icon: History,
    items: [
      {
        title: "Delivery History",
        url: "/receiver/delivery-history",
        component: DeliveryHistory,
      },
      {
        title: "Photos & Signatures",
        url: "/receiver/proof",
        component: DeliveryHistory,
      },
      {
        title: "Delivery Ratings",
        url: "/receiver/ratings",
        component: DeliveryHistory,
      },
    ],
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
    items: [
      {
        title: "Delivery Alerts",
        url: "/receiver/alerts",
        component: IncomingParcels,
      },
      {
        title: "SMS Notifications",
        url: "/receiver/sms",
        component: IncomingParcels,
      },
      {
        title: "Email Updates",
        url: "/receiver/email",
        component: IncomingParcels,
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
        url: "/receiver/profile",
        component: Profile,
      },
      {
        title: "Delivery Addresses",
        url: "/receiver/addresses",
        component: Profile,
      },
      {
        title: "Preferences",
        url: "/receiver/preferences",
        component: Profile,
      },
    ],
  },
];
