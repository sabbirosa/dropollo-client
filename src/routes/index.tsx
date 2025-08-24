import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constant/role";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Pricing from "@/pages/Pricing";
import Registration from "@/pages/Registration";
import Services from "@/pages/Services";
import TrackParcel from "@/pages/TrackParcel";
import Unauthorized from "@/pages/Unauthorized";
import type { TRole } from "@/types";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { receiverSidebarItems } from "./receiverSidebarItems";
import { senderSidebarItems } from "./senderSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        Component: About,
        path: "about",
      },
      {
        Component: Services,
        path: "services",
      },
      {
        Component: Pricing,
        path: "pricing",
      },
      {
        Component: TrackParcel,
        path: "track",
      },
      {
        Component: Contact,
        path: "contact",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.ADMIN as TRole),
    path: "/admin",
    children: [
      {
        index: true,
        element: <Navigate to="/admin/analytics" />,
      },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.SENDER as TRole),
    path: "/sender",
    children: [
      {
        index: true,
        element: <Navigate to="/sender/my-parcels" />,
      },
      ...generateRoutes(senderSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.RECEIVER as TRole),
    path: "/receiver",
    children: [
      {
        index: true,
        element: <Navigate to="/receiver/incoming-parcels" />,
      },
      ...generateRoutes(receiverSidebarItems),
    ],
  },
  {
    Component: Login,
    path: "login",
  },
  {
    Component: Registration,
    path: "registration",
  },
  {
    Component: Unauthorized,
    path: "unauthorized",
  },
]);
