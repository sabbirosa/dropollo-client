import type { LucideProps } from "lucide-react";
import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";

export type { IUser, TRole } from "./user.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
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
}

export interface ISidebarItem {
  title: string;
  url: string;
  component?: ComponentType;
}
