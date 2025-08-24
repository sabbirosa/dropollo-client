import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Label } from "@/components/ui/label";
import {
    AlertCircle,
    Bell,
    Check,
    Mail,
    MessageSquare,
    Package,
    Settings,
    Truck,
    X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "success",
    title: "Parcel Delivered",
    message: "Your parcel #DP12345 has been successfully delivered to the recipient.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Parcel In Transit",
    message: "Your parcel #DP12346 is now in transit and will arrive soon.",
    time: "4 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Delivery Delayed",
    message: "Your parcel #DP12347 delivery has been delayed due to weather conditions.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "error",
    title: "Payment Failed",
    message: "Payment for parcel #DP12348 has failed. Please update your payment method.",
    time: "2 days ago",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    parcelUpdates: true,
    promotions: false,
    securityAlerts: true,
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success("Notification deleted");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success("Notification settings updated");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your notification preferences and view recent alerts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Your latest updates and alerts
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div className={`p-4 rounded-lg border transition-all ${
                        notification.read 
                          ? "bg-gray-50 border-gray-200" 
                          : "bg-white border-blue-200 shadow-sm"
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${
                                notification.read ? "text-gray-600" : "text-gray-900"
                              }`}>
                                {notification.title}
                              </h4>
                              <Badge className={getBadgeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                            </div>
                            <p className={`text-sm ${
                              notification.read ? "text-gray-500" : "text-gray-700"
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
              <CardDescription>
                Customize your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Badge variant={settings.emailNotifications ? "default" : "secondary"}>
                    {settings.emailNotifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Badge variant={settings.pushNotifications ? "default" : "secondary"}>
                    {settings.pushNotifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <Label>SMS Notifications</Label>
                  </div>
                  <Badge variant={settings.smsNotifications ? "default" : "secondary"}>
                    {settings.smsNotifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <Label>Parcel Updates</Label>
                  </div>
                  <Badge variant={settings.parcelUpdates ? "default" : "secondary"}>
                    {settings.parcelUpdates ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <Label>Promotions</Label>
                  </div>
                  <Badge variant={settings.promotions ? "default" : "secondary"}>
                    {settings.promotions ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <Label>Security Alerts</Label>
                  </div>
                  <Badge variant={settings.securityAlerts ? "default" : "secondary"}>
                    {settings.securityAlerts ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="pt-4">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
