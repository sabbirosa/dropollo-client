import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import type { TRole } from "@/types";
import { Navigate } from "react-router";

export const withAuth = (
  Component: React.ComponentType,
  requiredRole?: TRole
) => {
  return function AuthWrapper() {
    const { data, isLoading, isError } = useUserInfoQuery(undefined);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (requiredRole && data?.data?.role !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }

    if ((!isLoading && !data?.data?.email) || isError) {
      return <Navigate to="/login" />;
    }
    return <Component />;
  };
};
