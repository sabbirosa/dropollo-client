import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableQuery } from "@/hooks/useTableQuery";
import {
  useBlockUnblockUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/feature/user/user.api";
import type { IUser, TRole } from "@/types";
import {
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserModal } from "./";
import { RoleSelectionModal } from "./RoleSelectionModal";

export function UserTable() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<IUser | null>(null);

  // Use query string for table state
  const { queryParams, setSearch, setFilter, setPage } = useTableQuery({
    defaultLimit: 10,
    defaultFilters: {
      role: "all",
      status: "all",
    },
  });

  // Build API query params
  const apiQueryParams = {
    page: queryParams.page,
    limit: queryParams.limit,
    ...(queryParams.search && { search: queryParams.search }),
    ...(queryParams.role !== "all" && { role: queryParams.role }),
    ...(queryParams.status !== "all" && {
      isBlocked: queryParams.status === "blocked",
    }),
  };

  const { data, isLoading, error } = useGetAllUsersQuery(apiQueryParams);
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [blockUnblockUser] = useBlockUnblockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleRoleUpdate = async (userId: string, newRole: TRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const openRoleModal = (user: IUser) => {
    setUserToChangeRole(user);
    setIsRoleModalOpen(true);
  };

  const handleBlockUnblock = async (
    userId: string,
    isBlocked: boolean,
    reason?: string
  ) => {
    try {
      await blockUnblockUser({
        id: userId,
        isBlocked,
        reason:
          reason || (isBlocked ? "Blocked by admin" : "Unblocked by admin"),
      }).unwrap();
      toast.success(`User ${isBlocked ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${isBlocked ? "block" : "unblock"} user`);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user");
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

  const openUserModal = (user: IUser) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <h3 className="font-semibold mb-2">Failed to load users</h3>
            <p className="text-sm">
              {error && typeof error === 'object' && 'status' in error 
                ? `Error ${(error as any).status}: ${(error as any).data?.message || 'Unknown error'}`
                : 'Please try again or check your connection.'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={queryParams.search || ""}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={queryParams.role || "all"}
                onValueChange={(value: TRole | "all") => setFilter("role", value)}
              >
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sender">Sender</SelectItem>
                  <SelectItem value="receiver">Receiver</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={queryParams.status || "all"}
                onValueChange={(value: "all" | "active" | "blocked") =>
                  setFilter("status", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: IUser) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                                                <Badge
                           variant={user.isBlocked ? "destructive" : "default"}
                         >
                           {user.isBlocked ? "Blocked" : user.status || "Active"}
                         </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openUserModal(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openRoleModal(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleBlockUnblock(user._id, !user.isBlocked)
                              }
                            >
                              {user.isBlocked ? (
                                <UserCheck className="mr-2 h-4 w-4" />
                              ) : (
                                <UserX className="mr-2 h-4 w-4" />
                              )}
                              {user.isBlocked ? "Unblock" : "Block"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setUserToDelete(user);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(queryParams.page - 1)}
                disabled={queryParams.page <= 1}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {queryParams.page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(queryParams.page + 1)}
                disabled={queryParams.page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserModal
        user={selectedUser}
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        onRoleUpdate={handleRoleUpdate}
        onBlockUnblock={handleBlockUnblock}
      />

      {/* Role Selection Modal */}
      <RoleSelectionModal
        user={userToChangeRole}
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        onRoleUpdate={handleRoleUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account for <strong>{userToDelete?.name}</strong> and remove
              all of their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
