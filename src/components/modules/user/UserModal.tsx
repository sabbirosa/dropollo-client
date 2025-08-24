import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { IUser, TRole } from "@/types";
import {
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";

interface UserModalProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdate: (userId: string, newRole: TRole) => Promise<void>;
  onBlockUnblock: (
    userId: string,
    isBlocked: boolean,
    reason?: string
  ) => Promise<void>;
}

export function UserModal({
  user,
  open,
  onOpenChange,
  onRoleUpdate,
  onBlockUnblock,
}: UserModalProps) {
  const [selectedRole, setSelectedRole] = useState<TRole>("sender");
  const [blockReason, setBlockReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const handleRoleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onRoleUpdate(user._id, selectedRole);
      onOpenChange(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlockUnblock = async () => {
    setIsUpdating(true);
    try {
      await onBlockUnblock(user._id, !user.isBlocked, blockReason);
      onOpenChange(false);
    } finally {
      setIsUpdating(false);
      setBlockReason("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{user.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{user.phone || "N/A"}</span>
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
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent>
              {user.address ? (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div className="space-y-1">
                    <div>{user.address.street || "N/A"}</div>
                    <div>
                      {user.address.city || "N/A"}, {user.address.state || "N/A"}{" "}
                      {user.address.zipCode || "N/A"}
                    </div>
                    <div>{user.address.country || "N/A"}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>No address information available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={user.isBlocked ? "destructive" : "default"}>
                    {user.isBlocked ? "Blocked" : user.status || "Active"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verified</Label>
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Created At</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Change Role */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Change Role</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedRole}
                    onValueChange={(value: TRole) => setSelectedRole(value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="sender">Sender</SelectItem>
                      <SelectItem value="receiver">Receiver</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRoleUpdate}
                    disabled={selectedRole === user.role || isUpdating}
                    size="sm"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Update Role
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Block/Unblock User */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {user.isBlocked ? "Unblock User" : "Block User"}
                </Label>
                {!user.isBlocked && (
                  <div className="space-y-2">
                    <Label htmlFor="blockReason" className="text-sm">
                      Reason for blocking
                    </Label>
                    <Textarea
                      id="blockReason"
                      placeholder="Enter reason for blocking this user..."
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
                <Button
                  onClick={handleBlockUnblock}
                  disabled={
                    (!user.isBlocked && !blockReason.trim()) || isUpdating
                  }
                  variant={user.isBlocked ? "default" : "destructive"}
                  size="sm"
                >
                  {user.isBlocked ? (
                    <UserCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <UserX className="mr-2 h-4 w-4" />
                  )}
                  {user.isBlocked ? "Unblock User" : "Block User"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
