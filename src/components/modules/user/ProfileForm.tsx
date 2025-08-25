import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/feature/user/user.api";
import type { IUser, TRole } from "@/types";
import { formatDate } from "@/utils/parcelUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Edit, Lock, Mail, MapPin, Phone, Save, Settings, Shield, User, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(3, "Zip code is required"),
    country: z.string().min(2, "Country is required"),
  }),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfileForm() {
  const { data, isLoading, error } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateMyProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const user = data?.data as IUser;

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      toast.success("Profile updated successfully");
      setIsEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch {
      toast.error("Failed to change password");
    }
  };

  const getRoleBadgeColor = (role: TRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "sender":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "receiver":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Failed to load profile. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditMode ? (
            // View Mode
            <div className="space-y-6">
              {/* Account Overview */}
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
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
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

              {/* Address Information */}
              {user.address && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Street</p>
                        <p className="font-medium">{user.address.street || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">City</p>
                        <p className="font-medium">{user.address.city || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">State</p>
                        <p className="font-medium">{user.address.state || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Zip Code</p>
                        <p className="font-medium">{user.address.zipCode || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Country</p>
                        <p className="font-medium">{user.address.country || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Edit Mode
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <FormField
                      control={profileForm.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="address.zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isUpdatingProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      {isUpdatingProfile ? "Updating..." : "Save Changes"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(false);
                        // Reset form to current values
                        profileForm.reset({
                          name: user.name,
                          phone: user.phone,
                          address: user.address,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Update your password to keep your account secure
              </p>
              <Button onClick={() => setShowPasswordForm(true)}>
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          ) : (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      passwordForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
