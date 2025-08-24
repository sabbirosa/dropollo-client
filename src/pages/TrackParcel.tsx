import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTrackParcelQuery } from "@/redux/feature/parcel/parcel.api";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface TrackingForm {
  trackingId: string;
}

export default function TrackParcel() {
  const [trackingId, setTrackingId] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingForm>();

  // Use the actual API query
  const { data: apiResponse, error, isLoading, refetch } = useTrackParcelQuery(
    trackingId,
    {
      skip: !trackingId || !isTracking,
    }
  );

  // Extract the actual parcel data from the API response
  const trackingResult = (apiResponse as any)?.data;

  const handleTracking = async (data: TrackingForm) => {
    setTrackingId(data.trackingId);
    setIsTracking(true);
    await refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in_transit":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "requested":
      case "approved":
      case "picked_up":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed_delivery":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "requested":
      case "approved":
      case "picked_up":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
      case "failed_delivery":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "returned":
        return <Package className="h-5 w-5 text-orange-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusDisplayName = (status: string) => {
    if (!status) return "Unknown Status";
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAddress = (address: any) => {
    if (!address) return "N/A";
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            📦 Track Your Parcel
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real-Time Parcel Tracking
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enter your tracking ID to get live updates on your parcel's journey.
            Stay informed every step of the way with our comprehensive tracking
            system.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="mb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Track Your Parcel</CardTitle>
              <CardDescription>
                Enter your tracking ID to get real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleTracking)}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <Input
                    {...register("trackingId", {
                      required: "Tracking ID is required",
                      minLength: {
                        value: 3,
                        message: "Tracking ID must be at least 3 characters",
                      },
                    })}
                    placeholder="Enter your tracking ID"
                    className="text-lg"
                  />
                  <Button type="submit" disabled={isLoading} className="px-8">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Tracking...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Track
                      </div>
                    )}
                  </Button>
                </div>
                {errors.trackingId && (
                  <p className="text-red-500 text-sm">
                    {errors.trackingId.message || "Tracking ID is required"}
                  </p>
                )}
                {Boolean(error) && (
                  <p className="text-red-500 text-sm">
                    Failed to track parcel. Please check your tracking ID and try again.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tracking Results */}
      {isLoading && (
        <section className="mb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Tracking Your Parcel...</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Please wait while we fetch your parcel information...</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {trackingResult && !isLoading && (
        <section className="mb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Tracking Results</CardTitle>
                    <CardDescription>
                      Tracking ID: {trackingResult.trackingId}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`px-4 py-2 text-lg ${getStatusColor(trackingResult.currentStatus)}`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trackingResult.currentStatus)}
                      {getStatusDisplayName(trackingResult.currentStatus)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Parcel Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Sender Information
                      </h3>
                      <div className="space-y-2">
                        {trackingResult.sender && (
                          <>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{trackingResult.sender.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{trackingResult.sender.email}</span>
                            </div>
                            {trackingResult.sender.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{trackingResult.sender.phone}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Parcel Details
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {trackingResult.parcelDetails && (
                          <>
                            <div>Type: {trackingResult.parcelDetails.type}</div>
                            <div>Weight: {trackingResult.parcelDetails.weight} kg</div>
                            <div>Description: {trackingResult.parcelDetails.description}</div>
                            {trackingResult.parcelDetails.value && (
                              <div>Value: ${trackingResult.parcelDetails.value}</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Receiver Information
                      </h3>
                      <div className="space-y-2">
                        {trackingResult.receiver && (
                          <>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{trackingResult.receiver.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{trackingResult.receiver.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{trackingResult.receiver.phone}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Delivery Address
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {trackingResult.receiver && trackingResult.receiver.address 
                            ? formatAddress(trackingResult.receiver.address) 
                            : "Address not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                {trackingResult.pricing && (
                  <div className="mb-8 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Total Cost:</span>
                      </div>
                      <span className="text-primary font-medium text-xl">
                        ${trackingResult.pricing.totalFee}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Base: ${trackingResult.pricing.baseFee} | 
                      Weight: ${trackingResult.pricing.weightFee} | 
                      Urgency: ${trackingResult.pricing.urgencyFee}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">
                    Delivery Timeline
                  </h3>
                  <div className="space-y-4">
                    {trackingResult.statusHistory && trackingResult.statusHistory.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          {index < trackingResult.statusHistory.length - 1 && (
                            <div className="w-0.5 h-8 bg-muted mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">
                              {getStatusDisplayName(event.status)}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {new Date(event.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Badge>
                          </div>
                          {event.location && (
                            <p className="text-muted-foreground text-sm mb-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {event.location}
                            </p>
                          )}
                          {event.note && (
                            <p className="text-muted-foreground text-sm">
                              {event.note}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated by: {event.updatedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Tracking System?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced tracking technology that keeps you informed every step of
              the way
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get instant notifications and live updates on your parcel's
                  location and status
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Precise Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your parcel with pinpoint accuracy using our advanced
                  GPS technology
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Delivery Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Accurate delivery time estimates based on real-time traffic
                  and weather conditions
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
