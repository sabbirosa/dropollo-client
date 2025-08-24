import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetParcelStatsQuery } from "@/redux/feature/parcel/parcel.api";
import { formatCurrency } from "@/utils/parcelUtils";
import { AlertTriangle, BarChart3, CheckCircle, DollarSign, MapPin, Package, TrendingUp, Truck, Users } from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading, error } = useGetParcelStatsQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const statusBreakdown = stats.statusBreakdown;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive overview of parcel delivery system performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Parcels</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalParcels}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.deliveredParcels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inTransitParcels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.revenueThisMonth)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Delivery Performance</p>
                <p className="text-sm text-gray-600">Key performance indicators</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delivery Rate</span>
                <span className="font-semibold">
                  {stats.totalParcels > 0 
                    ? `${((stats.deliveredParcels / stats.totalParcels) * 100).toFixed(1)}%`
                    : "0%"
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Rate</span>
                <span className="font-semibold">
                  {stats.totalParcels > 0 
                    ? `${((stats.pendingParcels / stats.totalParcels) * 100).toFixed(1)}%`
                    : "0%"
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancellation Rate</span>
                <span className="font-semibold">
                  {stats.totalParcels > 0 
                    ? `${((stats.cancelledParcels / stats.totalParcels) * 100).toFixed(1)}%`
                    : "0%"
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Delivery Time</span>
                <span className="font-semibold">{stats.averageDeliveryTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Revenue Analysis</p>
                <p className="text-sm text-gray-600">Financial performance overview</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(stats.revenueThisMonth)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Parcels</span>
                <span className="font-semibold">
                  {stats.totalParcels - stats.deliveredParcels - stats.cancelledParcels}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">
                  {stats.totalParcels > 0 
                    ? `${((stats.deliveredParcels / (stats.totalParcels - stats.cancelledParcels)) * 100).toFixed(1)}%`
                    : "0%"
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Parcel Status Breakdown
          </CardTitle>
          <CardDescription>
            Distribution of parcels across different statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Requested</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.requested}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.approved}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Picked Up</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.picked_up}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">In Transit</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.in_transit}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Out for Delivery</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.out_for_delivery}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium">Delivered</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.delivered}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Cancelled</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.cancelled}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Returned</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.returned}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium">Failed Delivery</span>
                </div>
                <Badge variant="secondary">{statusBreakdown.failed_delivery}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Manage Parcels</h4>
                  <p className="text-sm text-blue-700">View and manage all parcels</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">User Management</h4>
                  <p className="text-sm text-green-700">Manage system users</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-purple-50">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-purple-900">Reports</h4>
                  <p className="text-sm text-purple-700">Generate detailed reports</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
