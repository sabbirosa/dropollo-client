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
  useConfirmDeliveryMutation,
  useGetMyReceivedParcelsQuery,
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
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Package
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function IncomingParcels() {
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");

  const {
    data: parcelsData,
    isLoading,
    refetch,
  } = useGetMyReceivedParcelsQuery(queryParams);
  const [confirmDelivery, { isLoading: isConfirming }] =
    useConfirmDeliveryMutation();

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all" || value === "") {
      removeFilter(key);
    } else {
      setFilter(key, value);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!selectedParcel) return;

    try {
      await confirmDelivery({
        id: selectedParcel._id,
        note: deliveryNote,
      }).unwrap();
      toast.success("Delivery confirmed successfully!");
      setIsConfirmModalOpen(false);
      setDeliveryNote("");
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      toast.error("Failed to confirm delivery");
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
      !['page', 'limit'].includes(key) && queryParams[key]
    );

  // Calculate statistics
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) =>
    [
      ParcelStatus.REQUESTED,
      ParcelStatus.APPROVED,
      ParcelStatus.PICKED_UP,
      ParcelStatus.IN_TRANSIT,
      ParcelStatus.OUT_FOR_DELIVERY,
    ].includes(p.currentStatus)
  ).length;
  const deliveredParcels = parcels.filter(
    (p) => p.currentStatus === ParcelStatus.DELIVERED
  ).length;
  const urgentParcels = parcels.filter(
    (p) => p.deliveryInfo.urgency === "urgent"
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Incoming Parcels
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all parcels addressed to you
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                <p className="text-2xl font-bold text-gray-900">
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
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">
                  {urgentParcels}
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
          <CardDescription>
            Filter your incoming parcels by various criteria
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
          <CardTitle>Incoming Parcels ({parcels.length})</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading parcels..."
              : `Showing ${parcels.length} parcels`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading incoming parcels...</div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No incoming parcels found.{" "}
              {hasFilters && "Try adjusting your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Sender</TableHead>
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
                          <div className="font-medium">Sender</div>
                          <div className="text-sm text-gray-500">
                            ID: {parcel.sender}
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
                                    Delivery Information
                                  </Label>
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Urgency:
                                      </span>{" "}
                                      {parcel.deliveryInfo.urgency}
                                    </p>
                                    {parcel.deliveryInfo
                                      .deliveryInstructions && (
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Instructions:
                                        </span>{" "}
                                        {
                                          parcel.deliveryInfo
                                            .deliveryInstructions
                                        }
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

                          {parcel.currentStatus ===
                            ParcelStatus.OUT_FOR_DELIVERY && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setIsConfirmModalOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm
                            </Button>
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

      {/* Confirm Delivery Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>
              Confirm that you have received parcel {selectedParcel?.trackingId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Delivery Note (Optional)</Label>
              <Textarea
                placeholder="Add any notes about the delivery..."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setDeliveryNote("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmDelivery} disabled={isConfirming}>
                {isConfirming ? "Confirming..." : "Confirm Delivery"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
