import Logo from "@/components/layout/Logo";
import { LoginForm } from "@/components/modules/authentication/LoginForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import { navigateToDashboard } from "@/utils/navigationHelpers";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

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

  if (data?.data?.role && !isLoading) {
    navigateToDashboard(data?.data?.role, navigate);
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
          src="src/assets/images/parcel-delivery-image2.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
