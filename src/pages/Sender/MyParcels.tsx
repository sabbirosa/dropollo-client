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
    useCancelParcelMutation,
    useGetMySentParcelsQuery,
    useUpdateParcelMutation,
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
import { ChevronLeft, ChevronRight, Edit, Eye, Filter, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MyParcels() {
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
    defaultSort: "-createdAt",
  });
  const [selectedParcel, setSelectedParcel] = useState<IParcel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const {
    data: parcelsData,
    isLoading,
    refetch,
  } = useGetMySentParcelsQuery(queryParams);
  const [cancelParcel, { isLoading: isCancelling }] = useCancelParcelMutation();
  const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelMutation();

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all" || value === "") {
      removeFilter(key);
    } else {
      setFilter(key, value);
    }
  };

  const handleCancelParcel = async () => {
    if (!selectedParcel || !cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      await cancelParcel({
        id: selectedParcel._id,
        reason: cancelReason,
      }).unwrap();
      toast.success("Parcel cancelled successfully");
      setIsCancelModalOpen(false);
      setCancelReason("");
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      toast.error("Failed to cancel parcel");
    }
  };

  const handleUpdateParcel = async (updatedData: Partial<IParcel>) => {
    if (!selectedParcel) return;

    try {
      await updateParcel({
        id: selectedParcel._id,
        data: updatedData,
      }).unwrap();
      toast.success("Parcel updated successfully");
      setIsEditModalOpen(false);
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update parcel");
    }
  };

  const clearFilters = () => {
    resetQuery();
  };

  const parcels = parcelsData?.parcels || [];
  const totalPages = parcelsData?.meta?.totalPages || 1;
  const currentPage = queryParams.page;
  const hasFilters = queryParams.search || 
    Object.keys(queryParams).some(key => 
      !['page', 'limit', 'sort'].includes(key) && queryParams[key]
    );

  // Calculate statistics
  const totalParcels = parcels.length;
  const requestedParcels = parcels.filter(p => p.currentStatus === ParcelStatus.REQUESTED).length;
  const inTransitParcels = parcels.filter(p => 
    [ParcelStatus.PICKED_UP, ParcelStatus.IN_TRANSIT, ParcelStatus.OUT_FOR_DELIVERY].includes(p.currentStatus)
  ).length;
  const deliveredParcels = parcels.filter(p => p.currentStatus === ParcelStatus.DELIVERED).length;
  const totalRevenue = parcels.reduce((sum, p) => sum + p.pricing.totalFee, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Parcels
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create, track, and manage all your parcels in one place
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalParcels}</div>
            <p className="text-sm text-gray-600">Total Parcels</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{requestedParcels}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{inTransitParcels}</div>
            <p className="text-sm text-gray-600">In Transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{deliveredParcels}</div>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalRevenue)}</div>
            <p className="text-sm text-gray-600">Total Spent</p>
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
          <CardDescription>
            Filter your parcels by various criteria
          </CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={queryParams.currentStatus || "all"}
                onValueChange={(value) => handleFilterChange("currentStatus", value)}
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

          {hasFilters && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parcels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parcels ({parcels.length})</CardTitle>
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
                    <TableRow key={parcel._id}>
                      <TableCell className="font-mono text-sm">
                        {parcel.trackingId}
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
                        <Badge className={getStatusColor(parcel.currentStatus)}>
                          {getStatusText(parcel.currentStatus)}
                        </Badge>
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
                                    <Label className="text-sm font-medium">
                                      Tracking ID
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {parcel.trackingId}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
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
                                  <Label className="text-sm font-medium">
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
                                  <Label className="text-sm font-medium">
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
                                  <Label className="text-sm font-medium">
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

                          {parcel.currentStatus === ParcelStatus.REQUESTED && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedParcel(parcel);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedParcel(parcel);
                                  setIsCancelModalOpen(true);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Parcel</DialogTitle>
            <DialogDescription>
              Update parcel details for {selectedParcel?.trackingId}
            </DialogDescription>
          </DialogHeader>
          {selectedParcel && (
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <Textarea
                  defaultValue={selectedParcel.parcelDetails.description}
                  onChange={(e) => {
                    // Handle description update
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle update
                    setIsEditModalOpen(false);
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Parcel</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel parcel{" "}
              {selectedParcel?.trackingId}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason for cancellation</Label>
              <Textarea
                placeholder="Please provide a reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancelReason("");
                }}
              >
                No, Keep It
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelParcel}
                disabled={isCancelling || !cancelReason.trim()}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
