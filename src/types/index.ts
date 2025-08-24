import type { LucideProps } from "lucide-react";
import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";

export type {
  ICreateParcel,
  IParcel,
  IParcelFilters,
  IParcelStats,
  IUpdateParcel,
  IUpdateParcelStatus,
} from "./parcel.type";
export type {
  IChangePasswordData,
  IUpdateProfileData,
  IUser,
  IUserStats,
  TRole,
} from "./user.type";

export interface IMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}

export interface ISidebarItems {
  title: string;
  url: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  isActive?: boolean;
  items?: ISidebarItem[];
  component?: ComponentType;
  showInSidebar?: boolean;
}

export interface ISidebarItem {
  title: string;
  url: string;
  component?: ComponentType;
}
