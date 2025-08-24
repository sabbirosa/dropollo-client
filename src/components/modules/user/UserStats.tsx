import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserStatsQuery } from "@/redux/feature/user/user.api";
import { Package, Send, Shield, UserCheck, Users, UserX } from "lucide-react";

export function UserStats() {
  const { data, isLoading, error } = useGetUserStatsQuery(undefined);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <h3 className="font-semibold mb-2">Failed to load user statistics</h3>
        <p className="text-sm">
          {error && typeof error === 'object' && 'status' in error 
            ? `Error ${(error as any).status}: ${(error as any).data?.message || 'Unknown error'}`
            : 'Please try again or check your connection.'}
        </p>
      </div>
    );
  }

  const stats = data?.data;

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "All registered users",
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      description: "Currently active",
      color: "text-green-600",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      description: "Currently blocked",
      color: "text-red-600",
    },
    {
      title: "Admins",
      value: stats.adminCount,
      icon: Shield,
      description: "Administrator accounts",
      color: "text-purple-600",
    },
    {
      title: "Senders",
      value: stats.senderCount,
      icon: Send,
      description: "Sender accounts",
      color: "text-orange-600",
    },
    {
      title: "Receivers",
      value: stats.receiverCount,
      icon: Package,
      description: "Receiver accounts",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
