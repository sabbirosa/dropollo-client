import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { IUser, TRole } from "@/types";
import { Shield, UserCog } from "lucide-react";
import { useState } from "react";

interface RoleSelectionModalProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdate: (userId: string, newRole: TRole) => Promise<void>;
}

export function RoleSelectionModal({ 
  user, 
  open, 
  onOpenChange, 
  onRoleUpdate 
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<TRole>("sender");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const handleRoleUpdate = async () => {
    if (selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onRoleUpdate(user._id, selectedRole);
      onOpenChange(false);
    } finally {
      setIsUpdating(false);
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

  const getRoleDescription = (role: TRole) => {
    switch (role) {
      case "admin":
        return "Full system access with user and parcel management capabilities";
      case "sender":
        return "Can create and manage parcel delivery requests";
      case "receiver":
        return "Can receive parcels and confirm deliveries";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Change User Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current User Info */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">User Information</Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select New Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value: TRole) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="sender">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <span>Sender</span>
                  </div>
                </SelectItem>
                <SelectItem value="receiver">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-teal-600" />
                    <span>Receiver</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Role Description */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}:</strong>{" "}
                {getRoleDescription(selectedRole)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleRoleUpdate}
              disabled={selectedRole === user.role || isUpdating}
              className="flex-1"
            >
              {isUpdating ? "Updating..." : "Update Role"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
