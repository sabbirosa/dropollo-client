import type { ISidebarItems } from "@/types";
import { type RouteObject } from "react-router";

export const generateRoutes = (
  sidebarItems: ISidebarItems[]
): RouteObject[] => {
  return sidebarItems.flatMap(
    (section) =>
      section.items?.map((route) => ({
        path: route.url,
        Component: route.component,
      })) ?? []
  );
};
