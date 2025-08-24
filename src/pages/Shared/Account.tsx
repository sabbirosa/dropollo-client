import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import { formatDate } from "@/utils/parcelUtils";
import { Calendar, Key, Mail, Phone, Settings, Shield, User, UserCheck } from "lucide-react";

export default function Account() {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const user = userData?.data;

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Page Header Skeleton */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-96 bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="space-y-6">
          {/* Account Overview Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-700" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-700" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                ))}
                <div className="pt-4">
                  <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and security preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Overview
            </CardTitle>
            <CardDescription>
              Your basic account information and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Phone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <UserCheck className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Role</p>
                    <Badge variant="outline" className="mt-1">
                      {user?.role || "User"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Settings className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <Badge variant="default" className="mt-1 bg-green-600">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">Delete Account</h4>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
