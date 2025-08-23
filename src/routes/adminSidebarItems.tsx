import Analytics from "@/pages/Admin/Analytics";
import type { ISidebarItems } from "@/types";
import { SquareTerminal } from "lucide-react";

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
