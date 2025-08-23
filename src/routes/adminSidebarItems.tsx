import type { ISidebarItems } from "@/types";
import { SquareTerminal } from "lucide-react";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems: ISidebarItems[] = [
  {
    title: "Admin",
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
];
