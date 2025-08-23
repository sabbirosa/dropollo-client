import CreateParcel from "@/pages/Sender/CreateParcel";
import type { ISidebarItems } from "@/types";
import { Bot } from "lucide-react";

export const senderSidebarItems: ISidebarItems[] = [
  {
    title: "Sender",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Create Parcel",
        url: "/sender/create-parcel",
        component: CreateParcel,
      },
    ],
  },
];
