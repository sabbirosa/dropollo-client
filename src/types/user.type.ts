export type TRole = "admin" | "sender" | "receiver";
export type TUserStatus = "active" | "inactive" | "pending";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: IAddress;
  role: TRole;
  isBlocked: boolean;
  isVerified: boolean;
  status: TUserStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface IUserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  adminCount: number;
  senderCount: number;
  receiverCount: number;
  newUsersThisMonth: number;
  registrationTrend: Array<{
    month: string;
    count: number;
  }>;
}

export interface IUpdateProfileData {
  name?: string;
  phone?: string;
  address?: Partial<IAddress>;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
