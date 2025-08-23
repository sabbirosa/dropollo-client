import CreateParcel from "@/pages/Sender/CreateParcel";
import type { ISidebarItems } from "@/types";
import {
    History,
    MapPin,
    Package,
    Plus,
    User
} from "lucide-react";
import { lazy } from "react";

const MyParcels = lazy(() => import("@/pages/Sender/MyParcels"));
const TrackParcel = lazy(() => import("@/pages/Sender/TrackParcel"));
const ShippingHistory = lazy(() => import("@/pages/Sender/ShippingHistory"));
const Profile = lazy(() => import("@/pages/Sender/Profile"));

export const senderSidebarItems: ISidebarItems[] = [
  {
    title: "Shipping",
    url: "#",
    icon: Plus,
    isActive: true,
    items: [
      {
        title: "Create Parcel",
        url: "/sender/create-parcel",
        component: CreateParcel,
      },
      {
        title: "Calculate Shipping",
        url: "/sender/calculate-shipping",
        component: CreateParcel,
      },
    ],
  },
  {
    title: "My Parcels",
    url: "#",
    icon: Package,
    items: [
      {
        title: "All Parcels",
        url: "/sender/my-parcels",
        component: MyParcels,
      },
      {
        title: "In Transit",
        url: "/sender/in-transit",
        component: MyParcels,
      },
      {
        title: "Delivered",
        url: "/sender/delivered",
        component: MyParcels,
      },
    ],
  },
  {
    title: "Tracking",
    url: "#",
    icon: MapPin,
    items: [
      {
        title: "Track Parcel",
        url: "/sender/track-parcel",
        component: TrackParcel,
      },
      {
        title: "Live Map",
        url: "/sender/live-map",
        component: TrackParcel,
      },
    ],
  },
  {
    title: "History & Reports",
    url: "#",
    icon: History,
    items: [
      {
        title: "Shipping History",
        url: "/sender/shipping-history",
        component: ShippingHistory,
      },
      {
        title: "Delivery Reports",
        url: "/sender/reports",
        component: ShippingHistory,
      },
      {
        title: "Export Data",
        url: "/sender/export",
        component: ShippingHistory,
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
        url: "/sender/profile",
        component: Profile,
      },
      {
        title: "Addresses",
        url: "/sender/addresses",
        component: Profile,
      },
      {
        title: "Preferences",
        url: "/sender/preferences",
        component: Profile,
      },
    ],
  },
];
