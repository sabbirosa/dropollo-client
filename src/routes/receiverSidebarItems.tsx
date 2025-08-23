import ConfirmDelivery from "@/pages/Receiver/ConfirmDelivery";
import type { ISidebarItems } from "@/types";
import { BookOpen } from "lucide-react";

export const receiverSidebarItems: ISidebarItems[] = [
  {
    title: "Receiver",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Confirm Delivery",
        url: "/receiver/confirm-delivery",
        component: ConfirmDelivery,
      },
    ],
  },
];
