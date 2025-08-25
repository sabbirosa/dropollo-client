"use client";

import { Bell, ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/feature/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: userData } = useUserInfoQuery(undefined);

  // const fallbackAvatar = user?.name[0] || "S";
  const avatarFallback = user.name ? user?.name[0] : "D";

  // Get user role for dynamic routing
  const userRole = userData?.data?.role?.toLowerCase() || "user";

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      dispatch(authApi.util.resetApiState());
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleProfileClick = () => {
    // Navigate to profile based on user role
    navigate(`/${userRole}/profile`);
  };

  const handleAccountClick = () => {
    // Navigate to profile settings based on user role
    navigate(`/${userRole}/profile`);
  };

  const handleNotificationsClick = () => {
    // Navigate to notifications based on user role
    navigate(`/${userRole}/notifications`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotificationsClick}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
