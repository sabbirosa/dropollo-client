import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { useTableQuery } from "@/hooks/useTableQuery";
import {
  useBlockParcelMutation,
  useDeleteParcelMutation,
  useGetAllParcelsQuery,
  useUpdateParcelStatusMutation,
} from "@/redux/feature/parcel/parcel.api";
import type { IParcel } from "@/types";
import { ParcelStatus } from "@/types/parcel.type";
import {
  formatCurrency,
  formatDate,
  getParcelTypeIcon,
  getStatusColor,
  getStatusText,
  getUrgencyColor,
} from "@/utils/parcelUtils";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Filter,
  Package,
  Shield,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ParcelManagement() {
  const {
    queryParams,
    setSearch,
    setFilter,
    removeFilter,
    resetQuery,
    setPage,
  } = useTableQuery({
    defaultLimit: 10,
    defaultPage: 1,
  });
  const [selectedParcel, setSelectedParcel] = useState<IParcel | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: ParcelStatus.REQUESTED,
    location: "",
    note: "",
  });
  const [blockReason, setBlockReason] = useState("");

  const {
    data: parcelsData,
    isLoading,
    refetch,
  } = useGetAllParcelsQuery(queryParams);
  console.log("parcelsData:", parcelsData);
  const [updateParcelStatus, { isLoading: isUpdatingStatus }] =
    useUpdateParcelStatusMutation();
  const [blockParcel, { isLoading: isBlocking }] = useBlockParcelMutation();
  const [deleteParcel, { isLoading: isDeleting }] = useDeleteParcelMutation();

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all" || value === "") {
      removeFilter(key);
    } else {
      setFilter(key, value);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedParcel) return;

    try {
      await updateParcelStatus({
        id: selectedParcel._id,
        data: statusUpdate,
      }).unwrap();
      toast.success("Parcel status updated successfully!");
      setIsStatusModalOpen(false);
      setStatusUpdate({
        status: ParcelStatus.REQUESTED,
        location: "",
        note: "",
      });
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update parcel status");
    }
  };

  const handleBlockParcel = async () => {
    if (!selectedParcel) return;

    try {
      await blockParcel({
        id: selectedParcel._id,
        isBlocked: !selectedParcel.isBlocked,
        reason: blockReason,
      }).unwrap();
      toast.success(
        `Parcel ${selectedParcel.isBlocked ? "unblocked" : "blocked"} successfully!`
      );
      setIsBlockModalOpen(false);
      setBlockReason("");
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to block/unblock parcel");
    }
  };

  const handleDeleteParcel = async () => {
    if (!selectedParcel) return;

    try {
      await deleteParcel(selectedParcel._id).unwrap();
      toast.success("Parcel deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete parcel");
    }
  };

  const clearFilters = () => {
    resetQuery();
  };

  const parcels = parcelsData?.parcels || [];
  const totalPages = parcelsData?.meta?.totalPages || 1;
  const currentPage = queryParams.page;
  const hasFilters =
    queryParams.search ||
    Object.keys(queryParams).some(
      (key) => !["page", "limit"].includes(key) && queryParams[key]
    );

  // Calculate statistics
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) =>
    [ParcelStatus.REQUESTED, ParcelStatus.APPROVED].includes(p.currentStatus)
  ).length;
  const inTransitParcels = parcels.filter((p) =>
    [
      ParcelStatus.PICKED_UP,
      ParcelStatus.IN_TRANSIT,
      ParcelStatus.OUT_FOR_DELIVERY,
    ].includes(p.currentStatus)
  ).length;
  const deliveredParcels = parcels.filter(
    (p) => p.currentStatus === ParcelStatus.DELIVERED
  ).length;
  const blockedParcels = parcels.filter((p) => p.isBlocked).length;

  const getStatusIcon = (status: ParcelStatus) => {
    const icons = {
      [ParcelStatus.REQUESTED]: <Clock className="h-4 w-4" />,
      [ParcelStatus.APPROVED]: <CheckCircle className="h-4 w-4" />,
      [ParcelStatus.PICKED_UP]: <Truck className="h-4 w-4" />,
      [ParcelStatus.IN_TRANSIT]: <Truck className="h-4 w-4" />,
      [ParcelStatus.OUT_FOR_DELIVERY]: <Truck className="h-4 w-4" />,
      [ParcelStatus.DELIVERED]: <CheckCircle className="h-4 w-4" />,
      [ParcelStatus.CANCELLED]: <AlertTriangle className="h-4 w-4" />,
      [ParcelStatus.RETURNED]: <AlertTriangle className="h-4 w-4" />,
      [ParcelStatus.FAILED_DELIVERY]: <AlertTriangle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Parcel Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all parcels in the system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Parcels
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-purple-600">
                  {inTransitParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {deliveredParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked</p>
                <p className="text-2xl font-bold text-red-600">
                  {blockedParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter parcels by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="globalSearch">Search</Label>
            <Input
              id="globalSearch"
              placeholder="Search parcels..."
              value={queryParams.search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={queryParams.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(ParcelStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                id="trackingId"
                placeholder="Search by tracking ID"
                value={queryParams.trackingId || ""}
                onChange={(e) =>
                  handleFilterChange("trackingId", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="receiverEmail">Receiver Email</Label>
              <Input
                id="receiverEmail"
                placeholder="Search by receiver email"
                value={queryParams.receiverEmail || ""}
                onChange={(e) =>
                  handleFilterChange("receiverEmail", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={queryParams.urgency || "all"}
                onValueChange={(value) => handleFilterChange("urgency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Urgencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgencies</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={queryParams.startDate || ""}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={queryParams.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            <div className="flex items-end">
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parcels Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Parcels ({parcels.length})</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading parcels..."
              : `Showing ${parcels.length} parcels`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading parcels...</div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No parcels found. {hasFilters && "Try adjusting your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcels.map((parcel) => (
                    <TableRow
                      key={parcel._id}
                      className={parcel.isBlocked ? "bg-red-50" : ""}
                    >
                      <TableCell className="font-mono text-sm">
                        {parcel.trackingId}
                        {parcel.isBlocked && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Blocked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          ID: {parcel.sender}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {parcel.receiver.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {parcel.receiver.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {getParcelTypeIcon(parcel.parcelDetails.type)}
                          </span>
                          <span className="capitalize">
                            {parcel.parcelDetails.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(parcel.currentStatus)}
                          <Badge
                            className={getStatusColor(parcel.currentStatus)}
                          >
                            {getStatusText(parcel.currentStatus)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getUrgencyColor(
                            parcel.deliveryInfo.urgency
                          )}
                        >
                          {parcel.deliveryInfo.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(parcel.pricing.totalFee)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(parcel.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedParcel(parcel)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Parcel Details</DialogTitle>
                                <DialogDescription>
                                  Detailed information about parcel{" "}
                                  {parcel.trackingId}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">
                                      Tracking ID
                                    </Label>
                                    <p className="font-mono text-sm">
                                      {parcel.trackingId}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">
                                      Status
                                    </Label>
                                    <Badge
                                      className={getStatusColor(
                                        parcel.currentStatus
                                      )}
                                    >
                                      {getStatusText(parcel.currentStatus)}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-500">
                                    Receiver
                                  </Label>
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="font-medium">
                                      {parcel.receiver.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {parcel.receiver.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {parcel.receiver.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {parcel.receiver.address.street},{" "}
                                      {parcel.receiver.address.city},{" "}
                                      {parcel.receiver.address.state}{" "}
                                      {parcel.receiver.address.zipCode},{" "}
                                      {parcel.receiver.address.country}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-500">
                                    Parcel Details
                                  </Label>
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm">
                                      <span className="font-medium">Type:</span>{" "}
                                      {parcel.parcelDetails.type}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Weight:
                                      </span>{" "}
                                      {parcel.parcelDetails.weight} kg
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Description:
                                      </span>{" "}
                                      {parcel.parcelDetails.description}
                                    </p>
                                    {parcel.parcelDetails.value && (
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Value:
                                        </span>{" "}
                                        {formatCurrency(
                                          parcel.parcelDetails.value
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-500">
                                    Pricing
                                  </Label>
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Base Fee:
                                      </span>{" "}
                                      {formatCurrency(parcel.pricing.baseFee)}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Weight Fee:
                                      </span>{" "}
                                      {formatCurrency(parcel.pricing.weightFee)}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Urgency Fee:
                                      </span>{" "}
                                      {formatCurrency(
                                        parcel.pricing.urgencyFee
                                      )}
                                    </p>
                                    <p className="text-sm font-medium">
                                      <span className="font-medium">
                                        Total:
                                      </span>{" "}
                                      {formatCurrency(parcel.pricing.totalFee)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setStatusUpdate({
                                status: parcel.currentStatus,
                                location: "",
                                note: "",
                              });
                              setIsStatusModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setIsBlockModalOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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
            <div className="flex items-center justify-between px-2 mt-4">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Parcel Status</DialogTitle>
            <DialogDescription>
              Update the status for parcel {selectedParcel?.trackingId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Status</Label>
              <Select
                value={statusUpdate.status}
                onValueChange={(value) =>
                  setStatusUpdate((prev) => ({
                    ...prev,
                    status: value as ParcelStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ParcelStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location (Optional)</Label>
              <Input
                placeholder="Current location"
                value={statusUpdate.location}
                onChange={(e) =>
                  setStatusUpdate((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Note (Optional)</Label>
              <Textarea
                placeholder="Status update note"
                value={statusUpdate.note}
                onChange={(e) =>
                  setStatusUpdate((prev) => ({ ...prev, note: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Modal */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedParcel?.isBlocked ? "Unblock Parcel" : "Block Parcel"}
            </DialogTitle>
            <DialogDescription>
              {selectedParcel?.isBlocked
                ? `Unblock parcel ${selectedParcel.trackingId}?`
                : `Block parcel ${selectedParcel?.trackingId}? This will prevent further operations.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Reason for blocking/unblocking"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBlockModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={selectedParcel?.isBlocked ? "default" : "destructive"}
                onClick={handleBlockParcel}
                disabled={isBlocking}
              >
                {isBlocking
                  ? "Processing..."
                  : selectedParcel?.isBlocked
                    ? "Unblock"
                    : "Block"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Parcel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete parcel{" "}
              {selectedParcel?.trackingId}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteParcel}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
