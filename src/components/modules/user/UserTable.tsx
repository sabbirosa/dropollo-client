import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useBlockUnblockUserMutation, useDeleteUserMutation } from "@/redux/feature/user/user.api";
import type { IUser, TRole } from "@/types";
import { CalendarIcon, Filter, Shield, Trash2, Eye, UserCog, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { UserModal } from "./";
import { RoleSelectionModal } from "./RoleSelectionModal";

export function UserTable() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<IUser | null>(null);
  const [userToBlockUnblock, setUserToBlockUnblock] = useState<IUser | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);

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
    ...(queryParams.userStatus !== "all" && {
      isBlocked: queryParams.userStatus === "blocked",
    }),
    ...(queryParams.startDate && { startDate: queryParams.startDate }),
    ...(queryParams.endDate && { endDate: queryParams.endDate }),
  };

  const { data, isLoading, error } = useGetAllUsersQuery(apiQueryParams);
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [blockUnblockUser] = useBlockUnblockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;
  const hasFilters = Object.values(queryParams).some(
    (value) => value !== "all" && value !== null && value !== ""
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilter(key, value);
  };

  const clearFilters = () => {
    setFilter("role", "all");
    setFilter("status", "all");
    setFilter("startDate", "");
    setFilter("endDate", "");
    setSearch("");
  };

  const handleRoleUpdate = async (userId: string, newRole: TRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success("User role updated successfully");
    } catch {
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
    } catch {
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
    } catch {
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
                ? `Error ${(error as { status: number }).status}: ${(error as { data?: { message?: string } }).data?.message || 'Unknown error'}`
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
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="globalSearch" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </Label>
            <Input
              id="globalSearch"
              placeholder="Search users..."
              value={queryParams.search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </Label>
              <Select
                value={queryParams.role || "all"}
                onValueChange={(value) => handleFilterChange("role", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sender">Sender</SelectItem>
                  <SelectItem value="receiver">Receiver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <Select
                value={queryParams.userStatus || "all"}
                onValueChange={(value) => handleFilterChange("userStatus", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      queryParams.startDate ? "text-gray-900 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.startDate ? format(queryParams.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={queryParams.startDate ? new Date(queryParams.startDate) : undefined}
                    onSelect={(date) => {
                      setFilter("startDate", date ? format(date, "yyyy-MM-dd") : "");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      queryParams.endDate ? "text-gray-900 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.endDate ? format(new Date(queryParams.endDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={queryParams.endDate ? new Date(queryParams.endDate) : undefined}
                    onSelect={(date) => {
                      setFilter("endDate", date ? format(date, "yyyy-MM-dd") : "");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading users..."
              : `Showing ${users.length} users`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found. {hasFilters && "Try adjusting your filters."}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="w-12 font-semibold text-gray-900 dark:text-white">Avatar</TableHead>
                    <TableHead className="w-40 font-semibold text-gray-900 dark:text-white">Name</TableHead>
                    <TableHead className="w-48 font-semibold text-gray-900 dark:text-white">Email</TableHead>
                    <TableHead className="w-32 font-semibold text-gray-900 dark:text-white">Role</TableHead>
                    <TableHead className="w-32 font-semibold text-gray-900 dark:text-white">Status</TableHead>
                    <TableHead className="w-32 font-semibold text-gray-900 dark:text-white">Created</TableHead>
                    <TableHead className="w-40 font-semibold text-gray-900 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="py-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatar}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`${getRoleBadgeColor(user.role)} font-medium`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              user.status === "active"
                                ? "bg-green-500"
                                : user.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="font-medium"
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-600 dark:text-gray-400">
                        {format(user.createdAt, "PPP")}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUserModal(user)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openRoleModal(user)}
                            className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                          >
                            <UserCog className="h-4 w-4 text-green-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUserToBlockUnblock(user);
                              setBlockDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                          >
                            <Shield className="h-4 w-4 text-orange-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {queryParams.page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(queryParams.page - 1)}
                  disabled={queryParams.page <= 1}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(queryParams.page + 1)}
                  disabled={queryParams.page >= totalPages}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
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

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently block/unblock the
              user account for <strong>{userToBlockUnblock?.name}</strong> and remove
              all of their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleBlockUnblock(userToBlockUnblock!._id, !userToBlockUnblock!.isBlocked);
                setBlockDialogOpen(false);
                setUserToBlockUnblock(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {userToBlockUnblock?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
