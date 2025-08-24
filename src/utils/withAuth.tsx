import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import type { TRole } from "@/types";
import { Navigate } from "react-router";

export const withAuth = (
  Component: React.ComponentType,
  requiredRole?: TRole
) => {
  return function AuthWrapper() {
    const { data, isLoading, isError } = useUserInfoQuery(undefined);

    // Show loading skeleton while fetching user data
    if (isLoading) {
      return (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-96 bg-gray-200 dark:bg-gray-700" />
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full bg-gray-200 dark:bg-gray-700" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // If there's an error or no user data after loading, redirect to login
    if (isError || !data?.data?.email) {
      return <Navigate to="/login" replace />;
    }

    // If role is required and user doesn't have the required role, redirect to unauthorized
    if (requiredRole && data.data.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has the required role (if any), render the component
    return <Component />;
  };
};
