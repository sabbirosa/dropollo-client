import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetDeliveryHistoryQuery } from "@/redux/feature/parcel/parcel.api";
import { formatCurrency, formatDate, getParcelTypeIcon, getStatusColor, getStatusText, getUrgencyColor } from "@/utils/parcelUtils";
import { CheckCircle, Download, Eye, Filter, Package, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function DeliveryHistory() {
  const [filters, setFilters] = useState({
    trackingId: "",
    startDate: "",
    endDate: "",
    urgency: "",
  });

  const { data: parcelsData, isLoading } = useGetDeliveryHistoryQuery(filters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  const clearFilters = () => {
    setFilters({
      trackingId: "",
      startDate: "",
      endDate: "",
      urgency: "",
    });
  };

  const parcels = parcelsData?.parcels || [];
  const hasFilters = Object.values(filters).some(value => value !== "");

  // Calculate statistics
  const totalDeliveries = parcels.length;
  const totalValue = parcels.reduce((sum, p) => sum + (p.parcelDetails.value || 0), 0);
  const urgentDeliveries = parcels.filter(p => p.deliveryInfo.urgency === "urgent").length;
  const expressDeliveries = parcels.filter(p => p.deliveryInfo.urgency === "express").length;

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
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-green-600">{totalDeliveries}</p>
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
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalValue)}</p>
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
                <p className="text-2xl font-bold text-red-600">{urgentDeliveries}</p>
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
                <p className="text-2xl font-bold text-purple-600">{expressDeliveries}</p>
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
            Filter your delivery history by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                id="trackingId"
                placeholder="Search by tracking ID"
                value={filters.trackingId}
                onChange={(e) => handleFilterChange("trackingId", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={filters.urgency}
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

      {/* Delivery History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>
                {isLoading ? "Loading history..." : `Showing ${parcels.length} delivered parcels`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading delivery history...</div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No delivery history found. {hasFilters && "Try adjusting your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Delivered</TableHead>
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
                          <div className="text-sm text-gray-500">ID: {parcel.sender}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getParcelTypeIcon(parcel.parcelDetails.type)}</span>
                          <span className="capitalize">{parcel.parcelDetails.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUrgencyColor(parcel.deliveryInfo.urgency)}>
                          {parcel.deliveryInfo.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {parcel.parcelDetails.value ? formatCurrency(parcel.parcelDetails.value) : "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(parcel.pricing.totalFee)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(parcel.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(parcel.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Delivery Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about delivered parcel {parcel.trackingId}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-500">Tracking ID</Label>
                                  <p className="font-mono text-sm">{parcel.trackingId}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                                  <Badge className={getStatusColor(parcel.currentStatus)}>
                                    {getStatusText(parcel.currentStatus)}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium text-gray-500">Parcel Details</Label>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm"><span className="font-medium">Type:</span> {parcel.parcelDetails.type}</p>
                                  <p className="text-sm"><span className="font-medium">Weight:</span> {parcel.parcelDetails.weight} kg</p>
                                  <p className="text-sm"><span className="font-medium">Description:</span> {parcel.parcelDetails.description}</p>
                                  {parcel.parcelDetails.value && (
                                    <p className="text-sm"><span className="font-medium">Value:</span> {formatCurrency(parcel.parcelDetails.value)}</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium text-gray-500">Delivery Information</Label>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm"><span className="font-medium">Urgency:</span> {parcel.deliveryInfo.urgency}</p>
                                  {parcel.deliveryInfo.deliveryInstructions && (
                                    <p className="text-sm"><span className="font-medium">Instructions:</span> {parcel.deliveryInfo.deliveryInstructions}</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium text-gray-500">Pricing</Label>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm"><span className="font-medium">Base Fee:</span> {formatCurrency(parcel.pricing.baseFee)}</p>
                                  <p className="text-sm"><span className="font-medium">Weight Fee:</span> {formatCurrency(parcel.pricing.weightFee)}</p>
                                  <p className="text-sm"><span className="font-medium">Urgency Fee:</span> {formatCurrency(parcel.pricing.urgencyFee)}</p>
                                  <p className="text-sm font-medium"><span className="font-medium">Total:</span> {formatCurrency(parcel.pricing.totalFee)}</p>
                                </div>
                              </div>

                              {parcel.statusHistory.length > 0 && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-500">Status History</Label>
                                  <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                                    {parcel.statusHistory.map((status, index) => (
                                      <div key={index} className="text-sm mb-2 last:mb-0">
                                        <div className="flex items-center gap-2">
                                          <Badge className={getStatusColor(status.status)}>
                                            {getStatusText(status.status)}
                                          </Badge>
                                          <span className="text-gray-500">
                                            {formatDate(status.timestamp)}
                                          </span>
                                        </div>
                                        {status.location && (
                                          <p className="text-gray-600 ml-4">
                                            📍 {status.location}
                                          </p>
                                        )}
                                        {status.note && (
                                          <p className="text-gray-600 ml-4">
                                            📝 {status.note}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
