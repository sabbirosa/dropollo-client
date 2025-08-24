import type { TRole } from "@/types";

/**
 * Maps user role to their respective dashboard route
 */
export const getDashboardRoute = (role: TRole): string => {
  switch (role) {
    case "admin":
      return "/admin";
    case "sender":
      return "/sender";
    case "receiver":
      return "/receiver";
    default:
      return "/";
  }
};

// export const navigateToDashboard = (
//   userRole: string,
//   navigate: (path: string) => void
// ): void => {
//   const dashboardUrl = getDashboardRoute(userRole as TRole);
//   navigate(dashboardUrl);
// };
