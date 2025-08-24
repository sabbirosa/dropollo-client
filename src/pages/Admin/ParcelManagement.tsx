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
  useAssignDeliveryPersonnelMutation,
  useBlockParcelMutation,
  useDeleteParcelMutation,
  useGetAllParcelsQuery,
  useUpdateParcelStatusMutation,
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
  AlertTriangle,
  CalendarIcon,
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

  // Assignment modal state
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    deliveryPersonnel: {
      name: "",
      email: "",
      phone: "",
      employeeId: "",
      vehicleInfo: {
        type: "",
        plateNumber: "",
      },
    },
    note: "",
  });

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
  const [assignDeliveryPersonnel, { isLoading: isAssigning }] =
    useAssignDeliveryPersonnelMutation();

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

  const handleAssignDeliveryPersonnel = async () => {
    if (!selectedParcel) return;

    // Validate form before submission
    if (!validateAssignmentForm()) {
      return;
    }

    try {
      await assignDeliveryPersonnel({
        id: selectedParcel._id,
        deliveryPersonnel: assignmentData.deliveryPersonnel,
        note: assignmentData.note,
      }).unwrap();
      toast.success("Delivery personnel assigned successfully!");
      setIsAssignmentModalOpen(false);
      setAssignmentData({
        deliveryPersonnel: {
          name: "",
          email: "",
          phone: "",
          employeeId: "",
          vehicleInfo: {
            type: "",
            plateNumber: "",
          },
        },
        note: "",
      });
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign delivery personnel");
    }
  };

  const handleReassignDeliveryPersonnel = async () => {
    if (!selectedParcel) return;

    // Validate form before submission
    if (!validateAssignmentForm()) {
      return;
    }

    try {
      await assignDeliveryPersonnel({
        id: selectedParcel._id,
        deliveryPersonnel: assignmentData.deliveryPersonnel,
        note: assignmentData.note,
      }).unwrap();
      toast.success("Delivery personnel reassigned successfully!");
      setIsAssignmentModalOpen(false);
      setAssignmentData({
        deliveryPersonnel: {
          name: "",
          email: "",
          phone: "",
          employeeId: "",
          vehicleInfo: {
            type: "",
            plateNumber: "",
          },
        },
        note: "",
      });
      setSelectedParcel(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reassign delivery personnel");
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentData({
      deliveryPersonnel: {
        name: "",
        email: "",
        phone: "",
        employeeId: "",
        vehicleInfo: {
          type: "",
          plateNumber: "",
        },
      },
      note: "",
    });
  };

  const validateAssignmentForm = () => {
    const { name, email, phone } = assignmentData.deliveryPersonnel;
    const { type, plateNumber } = assignmentData.deliveryPersonnel.vehicleInfo;

    if (!name.trim()) {
      toast.error("Delivery personnel name is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Delivery personnel email is required");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Delivery personnel phone is required");
      return false;
    }
    if (!type.trim()) {
      toast.error("Vehicle type is required");
      return false;
    }
    if (!plateNumber.trim()) {
      toast.error("Vehicle plate number is required");
      return false;
    }
    return true;
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

  const parcels = parcelsData?.data || [];
  const totalPages = parcelsData?.meta?.totalPage || 1;
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
                htmlFor="receiverEmail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Receiver Email
              </Label>
              <Input
                id="receiverEmail"
                placeholder="Search by receiver email"
                value={queryParams.receiverEmail || ""}
                onChange={(e) =>
                  handleFilterChange("receiverEmail", e.target.value)
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                      queryParams.startDate
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.startDate ? (
                      format(new Date(queryParams.startDate), "PPP")
                    ) : (
                      <span>Pick a start date</span>
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
                      const newDate = date ? date.toISOString() : "";
                      setFilter("startDate", newDate);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

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
                      queryParams.endDate
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {queryParams.endDate ? (
                      format(new Date(queryParams.endDate), "PPP")
                    ) : (
                      <span>Pick an end date</span>
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
                      const newDate = date ? date.toISOString() : "";
                      setFilter("endDate", newDate);
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
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${parcel.isBlocked ? "bg-red-50 dark:bg-red-900/20" : ""}`}
                    >
                      <TableCell className="font-mono text-sm py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {parcel.trackingId}
                          </span>
                          {parcel.isBlocked && (
                            <Badge
                              variant="destructive"
                              className="text-xs px-2 py-1"
                            >
                              Blocked
                            </Badge>
                          )}
                        </div>
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
                            {getStatusIcon(parcel.currentStatus)}
                          </span>
                          <Badge
                            className={`${getStatusColor(parcel.currentStatus)} font-medium`}
                          >
                            {getStatusText(parcel.currentStatus)}
                          </Badge>
                          {parcel.deliveryPersonnel && (
                            <div className="flex items-center gap-1 ml-2">
                              <Truck className="h-3 w-3 text-purple-600" />
                              <span className="text-xs text-purple-600 font-medium">
                                Assigned
                              </span>
                            </div>
                          )}
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
                            <DialogContent className="max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {parcel.receiver.phone}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {parcel.receiver.address.street},{" "}
                                      {parcel.receiver.address.city},{" "}
                                      {parcel.receiver.address.state}{" "}
                                      {parcel.receiver.address.zipCode},{" "}
                                      {parcel.receiver.address.country}
                                    </p>
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

                                {/* Delivery Personnel Information */}
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Delivery Personnel
                                  </Label>
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    {parcel.deliveryPersonnel ? (
                                      <div className="space-y-2">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                          <span className="font-medium">
                                            Name:
                                          </span>{" "}
                                          {parcel.deliveryPersonnel.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          <span className="font-medium">
                                            Email:
                                          </span>{" "}
                                          {parcel.deliveryPersonnel.email}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          <span className="font-medium">
                                            Phone:
                                          </span>{" "}
                                          {parcel.deliveryPersonnel.phone}
                                        </p>
                                        {parcel.deliveryPersonnel
                                          .employeeId && (
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">
                                              Employee ID:
                                            </span>{" "}
                                            {
                                              parcel.deliveryPersonnel
                                                .employeeId
                                            }
                                          </p>
                                        )}
                                        {parcel.deliveryPersonnel
                                          .vehicleInfo && (
                                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                              <span className="font-medium">
                                                Vehicle:
                                              </span>{" "}
                                              {
                                                parcel.deliveryPersonnel
                                                  .vehicleInfo.type
                                              }
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                              <span className="font-medium">
                                                Plate:
                                              </span>{" "}
                                              {
                                                parcel.deliveryPersonnel
                                                  .vehicleInfo.plateNumber
                                              }
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        No delivery personnel assigned yet
                                      </p>
                                    )}
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
                            className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setIsBlockModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                          >
                            <Shield className="h-4 w-4 text-orange-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              setIsDeleteModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>

                          {/* Assignment/Reassignment button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedParcel(parcel);
                              if (parcel.deliveryPersonnel) {
                                // Pre-fill form with current assignment data for reassignment
                                const dp = parcel.deliveryPersonnel;
                                setAssignmentData({
                                  deliveryPersonnel: {
                                    name: dp.name,
                                    email: dp.email,
                                    phone: dp.phone,
                                    employeeId: dp.employeeId || "",
                                    vehicleInfo: {
                                      type: dp.vehicleInfo?.type || "",
                                      plateNumber:
                                        dp.vehicleInfo?.plateNumber || "",
                                    },
                                  },
                                  note: "",
                                });
                              } else {
                                // Reset form for new assignment
                                resetAssignmentForm();
                              }
                              setIsAssignmentModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                            title={
                              parcel.deliveryPersonnel
                                ? "Reassign Delivery Personnel"
                                : "Assign Delivery Personnel"
                            }
                          >
                            <Truck className="h-4 w-4 text-purple-600" />
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Status
              </Label>
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location (Optional)
              </Label>
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Note (Optional)
              </Label>
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason
              </Label>
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

      {/* Assign Delivery Personnel Modal */}
      <Dialog
        open={isAssignmentModalOpen}
        onOpenChange={setIsAssignmentModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedParcel?.deliveryPersonnel
                ? "Reassign Delivery Personnel"
                : "Assign Delivery Personnel"}
            </DialogTitle>
            <DialogDescription>
              {selectedParcel?.deliveryPersonnel
                ? `Reassign delivery personnel for parcel ${selectedParcel?.trackingId}`
                : `Assign delivery personnel to parcel ${selectedParcel?.trackingId}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Delivery Personnel Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name *
                </Label>
                <Input
                  placeholder="Full name"
                  value={assignmentData.deliveryPersonnel.name}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      deliveryPersonnel: {
                        ...prev.deliveryPersonnel,
                        name: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={assignmentData.deliveryPersonnel.email}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      deliveryPersonnel: {
                        ...prev.deliveryPersonnel,
                        email: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone *
                </Label>
                <Input
                  placeholder="+1234567890"
                  value={assignmentData.deliveryPersonnel.phone}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      deliveryPersonnel: {
                        ...prev.deliveryPersonnel,
                        phone: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Employee ID
                </Label>
                <Input
                  placeholder="EMP001"
                  value={assignmentData.deliveryPersonnel.employeeId}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      deliveryPersonnel: {
                        ...prev.deliveryPersonnel,
                        employeeId: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Vehicle Information *
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Vehicle Type *
                  </Label>
                  <Input
                    placeholder="Motorcycle, Car, Van, etc."
                    value={assignmentData.deliveryPersonnel.vehicleInfo.type}
                    onChange={(e) =>
                      setAssignmentData((prev) => ({
                        ...prev,
                        deliveryPersonnel: {
                          ...prev.deliveryPersonnel,
                          vehicleInfo: {
                            ...prev.deliveryPersonnel.vehicleInfo,
                            type: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Plate Number *
                  </Label>
                  <Input
                    placeholder="ABC123"
                    value={
                      assignmentData.deliveryPersonnel.vehicleInfo.plateNumber
                    }
                    onChange={(e) =>
                      setAssignmentData((prev) => ({
                        ...prev,
                        deliveryPersonnel: {
                          ...prev.deliveryPersonnel,
                          vehicleInfo: {
                            ...prev.deliveryPersonnel.vehicleInfo,
                            plateNumber: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Note */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assignment Note
              </Label>
              <Textarea
                placeholder="Optional note about the assignment"
                value={assignmentData.note}
                onChange={(e) =>
                  setAssignmentData((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAssignmentModalOpen(false);
                  resetAssignmentForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  selectedParcel?.deliveryPersonnel
                    ? handleReassignDeliveryPersonnel
                    : handleAssignDeliveryPersonnel
                }
                disabled={isAssigning}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isAssigning
                  ? "Processing..."
                  : selectedParcel?.deliveryPersonnel
                    ? "Reassign Personnel"
                    : "Assign Personnel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
