import parcelImg2 from "@/assets/images/parcel-delivery-image2.jpg";
import Logo from "@/components/layout/Logo";
import { LoginForm } from "@/components/modules/authentication/LoginForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import { getDashboardRoute } from "@/utils/navigationHelpers";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router";

export default function Login() {
  const { data, isLoading, error } = useUserInfoQuery(undefined, {
    // Skip the query if we're on the login page to avoid unnecessary API calls
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-32 mx-auto bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-48 mx-auto bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
            <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  // If user is already authenticated and has valid data, redirect to their role-based dashboard
  // Also check if the data is fresh (not stale cache)
  if (data?.data?.role && data?.data?._id && !isLoading && !error) {
    const dashboardRoute = getDashboardRoute(data.data.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <div className="flex justify-center gap-2">
            <Logo />
          </div>
          <div className="w-8" /> {/* Spacer for symmetry */}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={parcelImg2}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
