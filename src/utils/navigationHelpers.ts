import { role } from "@/constant/role";

export const getDashboardUrl = (userRole: string): string => {
  switch (userRole) {
    case role.ADMIN:
      return "/admin";
    case role.SENDER:
      return "/sender";
    case role.RECEIVER:
      return "/receiver";
    default:
      return "/";
  }
};

export const navigateToDashboard = (
  userRole: string,
  navigate: (path: string) => void
): void => {
  const dashboardUrl = getDashboardUrl(userRole);
  navigate(dashboardUrl);
};
