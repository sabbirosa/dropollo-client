import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { receiverSidebarItems } from "./receiverSidebarItems";
import { senderSidebarItems } from "./senderSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [...generateRoutes(adminSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/sender",
    children: [...generateRoutes(senderSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/receiver",
    children: [...generateRoutes(receiverSidebarItems)],
  },
  {
    Component: Login,
    path: "login",
  },
  {
    Component: Registration,
    path: "registration",
  },
]);
