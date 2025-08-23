import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { Link } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const { isMobile, open, openMobile } = useSidebar();

  const isOpen = isMobile ? openMobile : open;

  const { data: userData } = useUserInfoQuery(undefined);
  const data = {
    user: {
      name: userData?.data.name,
      email: userData?.data.email,
      avatar: userData?.data.avatar,
    },
    navMain: getSidebarItems(userData?.data.role),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link to="/">
          <div className="h-10 mx-2 flex items-center">
            <img
              src={
                theme === "dark"
                  ? "/dropollo-icon-dark.png"
                  : "/dropollo-icon.png"
              }
              alt="Dropollo Logo"
              className={`h-8 w-auto ${!isOpen && "h-fit w-fit"}`}
            />
            {isOpen && (
              <span className="text-primary ml-2 mt-2 text-lg font-bold">
                Dropollo Dashboard
              </span>
            )}
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
