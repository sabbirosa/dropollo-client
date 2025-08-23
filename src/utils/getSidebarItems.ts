import { role } from "@/constant/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { receiverSidebarItems } from "@/routes/receiverSidebarItems";
import { senderSidebarItems } from "@/routes/senderSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.ADMIN:
      return [...adminSidebarItems];
    case role.SENDER:
      return [...senderSidebarItems];
    case role.RECEIVER:
      return [...receiverSidebarItems];
    default:
      return [...senderSidebarItems];
  }
};
