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
import { useTableQuery } from "@/hooks/useTableQuery";
import { useGetDeliveryHistoryQuery } from "@/redux/feature/parcel/parcel.api";
import { ParcelStatus } from "@/types/parcel.type";
import {
    formatCurrency,
    formatDate,
    getStatusColor,
    getStatusText,
    getUrgencyColor,
} from "@/utils/parcelUtils";
import { format } from "date-fns";
import {
    CalendarIcon,
    CheckCircle,
    Eye,
    Filter,
    Package,
    TrendingUp,
} from "lucide-react";

export default function DeliveryHistory() {
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

  const { data: parcelsData, isLoading } = useGetDeliveryHistoryQuery(queryParams);
  console.log(parcelsData);

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all" || value === "") {
      removeFilter(key);
    } else {
      setFilter(key, value);
    }
  };

  const clearFilters = () => {
    resetQuery();
  };

  const parcels = parcelsData?.data || [];
  const totalPages = parcelsData?.meta?.totalPage || 1;
  const currentPage = queryParams.page;
  const hasFilters = queryParams.search || 
    Object.keys(queryParams).some(key => 
      !['page', 'limit'].includes(key) && queryParams[key]
    );

  // Calculate statistics
  const totalDeliveries = parcels.length;
  const totalValue = parcels.reduce(
    (sum, p) => sum + (p.parcelDetails.value || 0),
    0
  );
  const urgentDeliveries = parcels.filter(
    (p) => p.deliveryInfo.urgency === "urgent"
  ).length;
  const expressDeliveries = parcels.filter(
    (p) => p.deliveryInfo.urgency === "express"
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Delivery History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your complete delivery history and statistics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Deliveries
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {totalDeliveries}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">
                  {urgentDeliveries}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Express</p>
                <p className="text-2xl font-bold text-purple-600">
                  {expressDeliveries}
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
            Filter delivery history by various criteria
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
                      queryParams.startDate ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.startDate ? format(new Date(queryParams.startDate), "PPP") : <span>Pick a start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={queryParams.startDate ? new Date(queryParams.startDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        handleFilterChange("startDate", date.toISOString());
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
                      queryParams.endDate ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.endDate ? format(new Date(queryParams.endDate), "PPP") : <span>Pick an end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={queryParams.endDate ? new Date(queryParams.endDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        handleFilterChange("endDate", date.toISOString());
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

      {/* Delivery History Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              `Delivery History (${parcels.length})`
            )}
          </CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              `Showing ${parcels.length} delivered parcels`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Tracking ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Sender
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
                        <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700" />
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
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No delivery history found.{" "}
              {hasFilters && "Try adjusting your filters."}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Tracking ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Sender
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
                            {parcel.sender.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {parcel.sender.email}
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
                        <Badge
                          className={`${getUrgencyColor(parcel.deliveryInfo.urgency)} font-medium`}
                        >
                          {parcel.deliveryInfo.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                        {parcel.parcelDetails.value
                          ? formatCurrency(parcel.parcelDetails.value)
                          : "-"}
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
                                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Delivery Details</DialogTitle>
                                <DialogDescription>
                                  Detailed information about delivered parcel{" "}
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
                                    Sender
                                  </Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {parcel.sender.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {parcel.sender.email}
                                    </p>
                                    {parcel.sender.phone && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {parcel.sender.phone}
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

                                {parcel.statusHistory.length > 0 && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Status History
                                    </Label>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md max-h-40 overflow-y-auto">
                                      {parcel.statusHistory.map(
                                        (status, index) => (
                                          <div
                                            key={index}
                                            className="text-sm mb-2 last:mb-0"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                className={getStatusColor(
                                                  status.status
                                                )}
                                              >
                                                {getStatusText(status.status)}
                                              </Badge>
                                              <span className="text-gray-500 dark:text-gray-400">
                                                {formatDate(status.timestamp)}
                                              </span>
                                            </div>
                                            {status.note && (
                                              <p className="text-gray-600 dark:text-gray-400 mt-1 ml-4">
                                                {status.note}
                                              </p>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
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
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
