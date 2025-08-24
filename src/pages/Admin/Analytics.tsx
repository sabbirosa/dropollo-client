import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetParcelStatsQuery } from "@/redux/feature/parcel/parcel.api";
import { formatCurrency } from "@/utils/parcelUtils";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  DollarSign,
  MapPin,
  Package,
  Target,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function Analytics() {
  const { data: response, isLoading, error } = useGetParcelStatsQuery();

  // Debug logging to see what we're getting from the API
  console.log("Analytics API Response:", { response, isLoading, error });

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

  if (error || !response || !response.data) {
    console.error("Analytics Error:", error);
    return (
      <div className="p-6">
        <div className="text-center py-8 text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to Load Analytics
          </h3>
          <p>Please try again later.</p>
          {error && (
            <details className="mt-4 text-left max-w-md mx-auto">
              <summary className="cursor-pointer text-sm">Error Details</summary>
              <pre className="text-xs mt-2 bg-red-50 p-2 rounded">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Extract the actual stats data from the response
  const stats = response.data;

  // Add null checks and provide fallback values
  const statusBreakdown = stats.statusBreakdown || {
    requested: 0,
    approved: 0,
    picked_up: 0,
    in_transit: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    failed_delivery: 0,
  };

  // Ensure all required fields have fallback values
  const safeStats = {
    totalParcels: stats.totalParcels || 0,
    deliveredParcels: stats.deliveredParcels || 0,
    inTransitParcels: stats.inTransitParcels || 0,
    pendingParcels: stats.pendingParcels || 0,
    cancelledParcels: stats.cancelledParcels || 0,
    averageDeliveryTime: stats.averageDeliveryTime || "N/A",
    revenueThisMonth: stats.revenueThisMonth || 0,
  };

  console.log("Processed Stats:", { statusBreakdown, safeStats });

  // Chart data preparation
  const statusChartData = [
    { name: "Requested", value: statusBreakdown.requested, color: "#3B82F6" },
    { name: "Approved", value: statusBreakdown.approved, color: "#10B981" },
    { name: "Picked Up", value: statusBreakdown.picked_up, color: "#8B5CF6" },
    { name: "In Transit", value: statusBreakdown.in_transit, color: "#F59E0B" },
    {
      name: "Out for Delivery",
      value: statusBreakdown.out_for_delivery,
      color: "#F97316",
    },
    { name: "Delivered", value: statusBreakdown.delivered, color: "#059669" },
    { name: "Cancelled", value: statusBreakdown.cancelled, color: "#EF4444" },
    { name: "Returned", value: statusBreakdown.returned, color: "#6B7280" },
    {
      name: "Failed Delivery",
      value: statusBreakdown.failed_delivery,
      color: "#DC2626",
    },
  ].filter((item) => item.value > 0);

  const monthlyRevenueData = [
    { month: "Jan", revenue: 12500, parcels: 45 },
    { month: "Feb", revenue: 15800, parcels: 52 },
    { month: "Mar", revenue: 14200, parcels: 48 },
    { month: "Apr", revenue: 18900, parcels: 61 },
    { month: "May", revenue: 22100, parcels: 73 },
    { month: "Jun", revenue: 19800, parcels: 65 },
    { month: "Jul", revenue: 24500, parcels: 81 },
    { month: "Aug", revenue: 26700, parcels: 89 },
    { month: "Sep", revenue: 28900, parcels: 95 },
    { month: "Oct", revenue: 31200, parcels: 103 },
    { month: "Nov", revenue: 29800, parcels: 98 },
    { month: "Dec", revenue: 34500, parcels: 115 },
  ];

  const deliveryPerformanceData = [
    {
      metric: "Delivery Rate",
      value:
        safeStats.totalParcels > 0
          ? (safeStats.deliveredParcels / safeStats.totalParcels) * 100
          : 0,
      target: 95,
      color: "#10B981",
    },
    {
      metric: "Pending Rate",
      value:
        safeStats.totalParcels > 0
          ? (safeStats.pendingParcels / safeStats.totalParcels) * 100
          : 0,
      target: 15,
      color: "#F59E0B",
    },
    {
      metric: "Cancellation Rate",
      value:
        safeStats.totalParcels > 0
          ? (safeStats.cancelledParcels / safeStats.totalParcels) * 100
          : 0,
      target: 5,
      color: "#EF4444",
    },
    {
      metric: "Success Rate",
      value:
        safeStats.totalParcels > 0
          ? (safeStats.deliveredParcels /
              (safeStats.totalParcels - safeStats.cancelledParcels)) *
            100
          : 0,
      target: 90,
      color: "#3B82F6",
    },
  ];

  const urgencyDistributionData = [
    {
      urgency: "Standard",
      count: Math.floor(safeStats.totalParcels * 0.6),
      color: "#3B82F6",
    },
    {
      urgency: "Express",
      count: Math.floor(safeStats.totalParcels * 0.3),
      color: "#F59E0B",
    },
    {
      urgency: "Urgent",
      count: Math.floor(safeStats.totalParcels * 0.1),
      color: "#EF4444",
    },
  ];

  const chartConfig = {
    status: {
      label: "Status",
      color: "#3B82F6",
    },
    revenue: {
      label: "Revenue",
      color: "#8B5CF6",
    },
    parcels: {
      label: "Parcels",
      color: "#10B981",
    },
    performance: {
      label: "Performance",
      color: "#F59E0B",
    },
  };

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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Parcels
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {safeStats.totalParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {safeStats.deliveredParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Truck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Transit
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {safeStats.inTransitParcels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(safeStats.revenueThisMonth)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Parcel Status Distribution
            </CardTitle>
            <CardDescription>
              Current distribution of parcels across different statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  ></ChartTooltip>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <ChartLegend>
              <ChartLegendContent />
            </ChartLegend>
          </CardContent>
        </Card>

        {/* Urgency Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Urgency Distribution
            </CardTitle>
            <CardDescription>
              Distribution of parcels by delivery urgency level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={urgencyDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="urgency" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  ></ChartTooltip>
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue & Parcel Trends
          </CardTitle>
          <CardDescription>
            Monthly revenue and parcel volume trends over the year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />}></ChartTooltip>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  yAxisId="left"
                />
                <Line
                  type="monotone"
                  dataKey="parcels"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  yAxisId="right"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartLegend>
            <ChartLegendContent />
          </ChartLegend>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delivery Performance
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Key performance indicators
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {deliveryPerformanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.metric}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.value.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(item.value, 100)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>Target: {item.target}%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Average Delivery Time
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {safeStats.averageDeliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Analysis
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Financial performance overview
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Revenue
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(safeStats.revenueThisMonth)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Parcels
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {safeStats.totalParcels -
                    safeStats.deliveredParcels -
                    safeStats.cancelledParcels}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {safeStats.totalParcels > 0
                    ? `${((safeStats.deliveredParcels / (safeStats.totalParcels - safeStats.cancelledParcels)) * 100).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Revenue per Parcel
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {safeStats.totalParcels > 0
                      ? formatCurrency(
                          safeStats.revenueThisMonth / safeStats.totalParcels
                        )
                      : formatCurrency(0)}
                  </span>
                </div>
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
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Requested
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.requested}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Approved
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.approved}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Picked Up
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.picked_up}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    In Transit
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.in_transit}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Out for Delivery
                  </span>
                </div>
                <Badge variant="secondary">
                  {statusBreakdown.out_for_delivery}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Delivered
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.delivered}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Cancelled
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.cancelled}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Returned
                  </span>
                </div>
                <Badge variant="secondary">{statusBreakdown.returned}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Failed Delivery
                  </span>
                </div>
                <Badge variant="secondary">
                  {statusBreakdown.failed_delivery}
                </Badge>
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
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    Manage Parcels
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    View and manage all parcels
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    User Management
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Manage system users
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                    Reports
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Generate detailed reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
