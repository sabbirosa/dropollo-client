import { ParcelStatus } from "@/types/parcel.type";

export const calculateParcelFees = (
  weight: number,
  urgency: "standard" | "express" | "urgent",
  type: "document" | "package" | "fragile" | "electronics" | "other"
) => {
  // Base fees for different parcel types
  const baseFees = {
    document: 50,
    package: 100,
    fragile: 150,
    electronics: 200,
    other: 120,
  };

  // Weight fee: 20 per kg
  const weightFee = weight * 20;

  // Urgency fees
  const urgencyFees = {
    standard: 0,
    express: 100,
    urgent: 200,
  };

  const baseFee = baseFees[type];
  const urgencyFee = urgencyFees[urgency];
  const totalFee = baseFee + weightFee + urgencyFee;

  return {
    baseFee,
    weightFee,
    urgencyFee,
    totalFee,
  };
};

export const getStatusColor = (status: ParcelStatus) => {
  const statusColors = {
    [ParcelStatus.REQUESTED]: "bg-blue-100 text-blue-800",
    [ParcelStatus.APPROVED]: "bg-green-100 text-green-800",
    [ParcelStatus.PICKED_UP]: "bg-purple-100 text-purple-800",
    [ParcelStatus.IN_TRANSIT]: "bg-yellow-100 text-yellow-800",
    [ParcelStatus.OUT_FOR_DELIVERY]: "bg-orange-100 text-orange-800",
    [ParcelStatus.DELIVERED]: "bg-green-100 text-green-800",
    [ParcelStatus.CANCELLED]: "bg-red-100 text-red-800",
    [ParcelStatus.RETURNED]: "bg-gray-100 text-gray-800",
    [ParcelStatus.FAILED_DELIVERY]: "bg-red-100 text-red-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const getStatusText = (status: ParcelStatus) => {
  const statusTexts = {
    [ParcelStatus.REQUESTED]: "Requested",
    [ParcelStatus.APPROVED]: "Approved",
    [ParcelStatus.PICKED_UP]: "Picked Up",
    [ParcelStatus.IN_TRANSIT]: "In Transit",
    [ParcelStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
    [ParcelStatus.DELIVERED]: "Delivered",
    [ParcelStatus.CANCELLED]: "Cancelled",
    [ParcelStatus.RETURNED]: "Returned",
    [ParcelStatus.FAILED_DELIVERY]: "Failed Delivery",
  };

  return statusTexts[status] || status;
};

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(amount);
};

export const getUrgencyColor = (urgency: string) => {
  const colors = {
    standard: "bg-gray-100 text-gray-800",
    express: "bg-blue-100 text-blue-800",
    urgent: "bg-red-100 text-red-800",
  };

  return colors[urgency as keyof typeof colors] || "bg-gray-100 text-gray-800";
};
