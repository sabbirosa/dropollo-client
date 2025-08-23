import type { LucideProps } from "lucide-react";
import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";

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
}

export interface ISidebarItem {
  title: string;
  url: string;
  component?: ComponentType;
}

export type TRole = "admin" | "sender" | "receiver";
