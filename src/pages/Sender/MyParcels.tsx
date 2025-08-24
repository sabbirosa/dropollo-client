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
import { Skeleton } from "@/components/ui/skeleton";
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
} from "@/redux/feature/parcel/parcel.api";
import type { IParcel } from "@/types";
import { ParcelStatus } from "@/types/parcel.type";
import {
    formatCurrency,
    getStatusColor,
    getStatusText,
    getUrgencyColor,
} from "@/utils/parcelUtils";
import { format } from "date-fns";
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Filter,
    X,
} from "lucide-react";
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

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all" || value === "") {
      removeFilter(key);
    } else {
      setFilter(key, value);
    }
  };

  const handleCancelParcel = async () => {
    if (!selectedParcel) return;

    try {
      await cancelParcel({
        id: selectedParcel._id,
        reason: cancelReason,
      }).unwrap();
      toast.success("Parcel cancelled successfully");
      setIsCancelModalOpen(false);
      setSelectedParcel(null);
      setCancelReason("");
      refetch();
    } catch (error) {
      console.error("Cancel parcel error:", error);
      toast.error("Failed to cancel parcel");
    }
  };

  const clearFilters = () => {
    resetQuery();
  };

  const parcels = parcelsData?.data || [];
  const totalPages = parcelsData?.meta?.totalPage || 1;
  const currentPage = queryParams.page;
  const hasFilters =
    queryParams.search ||
    Object.keys(queryParams).some(
      (key) => !["page", "limit", "sort"].includes(key) && queryParams[key]
    );

  // Calculate statistics
  const totalParcels = parcels.length;
  const requestedParcels = parcels.filter(
    (p) => p.currentStatus === ParcelStatus.REQUESTED
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
            <div className="text-2xl font-bold text-blue-600">
              {totalParcels}
            </div>
            <p className="text-sm text-gray-600">Total Parcels</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {requestedParcels}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {inTransitParcels}
            </div>
            <p className="text-sm text-gray-600">In Transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {deliveredParcels}
            </div>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalRevenue)}
            </div>
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
            Filter your sent parcels by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label
              htmlFor="globalSearch"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Search
            </Label>
            <Input
              id="globalSearch"
              placeholder="Search parcels..."
              value={queryParams.search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </Label>
              <Select
                value={queryParams.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-full">
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

            <div className="space-y-2">
              <Label
                htmlFor="trackingId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tracking ID
              </Label>
              <Input
                id="trackingId"
                placeholder="Search by tracking ID"
                value={queryParams.trackingId || ""}
                onChange={(e) =>
                  handleFilterChange("trackingId", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="urgency"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Urgency
              </Label>
              <Select
                value={queryParams.urgency || "all"}
                onValueChange={(value) => handleFilterChange("urgency", value)}
              >
                <SelectTrigger className="w-full">
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

            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      queryParams.startDate ? "text-primary" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.startDate ? (
                      format(new Date(queryParams.startDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      queryParams.startDate
                        ? new Date(queryParams.startDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setFilter("startDate", date.toISOString());
                      } else {
                        removeFilter("startDate");
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      queryParams.endDate ? "text-primary" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.endDate ? (
                      format(new Date(queryParams.endDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      queryParams.endDate
                        ? new Date(queryParams.endDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setFilter("endDate", date.toISOString());
                      } else {
                        removeFilter("endDate");
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
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
          <CardTitle>
            {isLoading ? (
              <Skeleton className="h-8 w-56" />
            ) : (
              `My Sent Parcels (${parcels.length})`
            )}
          </CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              `Showing ${parcels.length} parcels`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Tracking ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Receiver
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Urgency
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Total Fee
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-4">
                        <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
                          <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 bg-gray-200 dark:bg-gray-700" />
                          <Skeleton className="h-8 w-8 bg-gray-200 dark:bg-gray-700" />
                          <Skeleton className="h-8 w-8 bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No parcels found. {hasFilters && "Try adjusting your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Tracking ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Receiver
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Urgency
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Total Fee
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcels.map((parcel) => (
                    <TableRow
                      key={parcel._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="font-mono text-sm py-4">
                        <span className="font-medium">{parcel.trackingId}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {parcel.receiver.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {parcel.receiver.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="capitalize font-medium text-gray-900 dark:text-white">
                            {parcel.parcelDetails.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {/* Assuming getStatusIcon is defined elsewhere or will be added */}
                            {/* <span>{getStatusIcon(parcel.currentStatus)}</span> */}
                          </span>
                          <Badge
                            className={`${getStatusColor(parcel.currentStatus)} font-medium`}
                          >
                            {getStatusText(parcel.currentStatus)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`${getUrgencyColor(
                            parcel.deliveryInfo.urgency
                          )} font-medium`}
                        >
                          {parcel.deliveryInfo.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(parcel.pricing.totalFee)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedParcel(parcel)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
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
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Tracking ID
                                    </Label>
                                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                                      {parcel.trackingId}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Receiver
                                  </Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {parcel.receiver.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {parcel.receiver.email}
                                    </p>
                                    {parcel.receiver.phone && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {parcel.receiver.phone}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Parcel Details
                                  </Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">Type:</span>{" "}
                                      {parcel.parcelDetails.type}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">
                                        Weight:
                                      </span>{" "}
                                      {parcel.parcelDetails.weight} kg
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">
                                        Description:
                                      </span>{" "}
                                      {parcel.parcelDetails.description}
                                    </p>
                                    {parcel.parcelDetails.value && (
                                      <p className="text-sm text-gray-900 dark:text-white">
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
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Delivery Information
                                  </Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">
                                        Urgency:
                                      </span>{" "}
                                      {parcel.deliveryInfo.urgency}
                                    </p>
                                    {parcel.deliveryInfo
                                      .deliveryInstructions && (
                                      <p className="text-sm text-gray-900 dark:text-white">
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
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pricing
                                  </Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">
                                        Base Fee:
                                      </span>{" "}
                                      {formatCurrency(parcel.pricing.baseFee)}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">
                                        Weight Fee:
                                      </span>{" "}
                                      {formatCurrency(parcel.pricing.weightFee)}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      <span className="font-medium">
                                        Urgency Fee:
                                      </span>{" "}
                                      {formatCurrency(
                                        parcel.pricing.urgencyFee
                                      )}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setIsCancelModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          )}

                          {parcel.currentStatus === ParcelStatus.REQUESTED && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setIsEditModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                            >
                              <Edit className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
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
                  onChange={() => {
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
                  disabled={isCancelling}
                >
                  {isCancelling ? "Updating..." : "Update"}
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
