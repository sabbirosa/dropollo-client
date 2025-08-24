export enum ParcelStatus {
  REQUESTED = "requested",
  APPROVED = "approved",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  FAILED_DELIVERY = "failed_delivery",
}

export interface IStatusLog {
  status: ParcelStatus;
  timestamp: Date;
  updatedBy: string;
  location?: string;
  note?: string;
}

export interface IParcelReceiver {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface IParcelDetails {
  type: "document" | "package" | "fragile" | "electronics" | "other";
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  value?: number;
}

export interface IDeliveryPersonnel {
  name: string;
  email: string;
  phone: string;
  employeeId?: string;
  vehicleInfo?: {
    type: string;
    plateNumber: string;
  };
}

export interface IDeliveryInfo {
  preferredDeliveryDate?: Date;
  deliveryInstructions?: string;
  urgency: "standard" | "express" | "urgent";
}

export interface IPricing {
  baseFee: number;
  weightFee: number;
  urgencyFee: number;
  totalFee: number;
  discount?: number;
  couponCode?: string;
}

export interface IParcel {
  _id: string;
  trackingId: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  receiver: IParcelReceiver;
  parcelDetails: IParcelDetails;
  deliveryInfo: IDeliveryInfo;
  pricing: IPricing;
  currentStatus: ParcelStatus;
  statusHistory: IStatusLog[];
  isBlocked: boolean;
  isCancelled: boolean;
  deliveryPersonnel?: IDeliveryPersonnel;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateParcel {
  receiver: IParcelReceiver;
  parcelDetails: IParcelDetails;
  deliveryInfo: IDeliveryInfo;
}

export interface IUpdateParcelStatus {
  status: ParcelStatus;
  location?: string;
  note?: string;
}

export interface IUpdateParcel {
  receiver?: Partial<IParcelReceiver>;
  parcelDetails?: Partial<IParcelDetails>;
  deliveryInfo?: Partial<IDeliveryInfo>;
}

export interface IParcelFilters {
  status?: ParcelStatus;
  currentStatus?: ParcelStatus;
  sender?: string;
  receiverEmail?: string;
  trackingId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  urgency?: "standard" | "express" | "urgent";
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IParcelStats {
  totalParcels: number;
  deliveredParcels: number;
  inTransitParcels: number;
  pendingParcels: number;
  cancelledParcels: number;
  averageDeliveryTime: string;
  revenueThisMonth: number;
  statusBreakdown: {
    requested: number;
    approved: number;
    picked_up: number;
    in_transit: number;
    out_for_delivery: number;
    delivered: number;
    cancelled: number;
    returned: number;
    failed_delivery: number;
  };
}
