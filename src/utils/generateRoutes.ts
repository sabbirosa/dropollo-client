import type { ISidebarItems } from "@/types";
import { type RouteObject } from "react-router";

export const generateRoutes = (
  sidebarItems: ISidebarItems[]
): RouteObject[] => {
  return sidebarItems.flatMap((section) => {
    const routes: RouteObject[] = [];
    
    // Handle direct component (like User Management)
    if (section.component && section.url !== "#") {
      // Convert absolute path to relative for nested routes
      const relativePath = section.url.startsWith("/admin/") 
        ? section.url.replace("/admin/", "")
        : section.url.startsWith("/sender/")
        ? section.url.replace("/sender/", "")
        : section.url.startsWith("/receiver/")
        ? section.url.replace("/receiver/", "")
        : section.url;
        
      routes.push({
        path: relativePath,
        Component: section.component,
      });
    }
    
    // Handle nested items
    if (section.items) {
      routes.push(
        ...section.items.map((route) => {
          const relativePath = route.url.startsWith("/admin/") 
            ? route.url.replace("/admin/", "")
            : route.url.startsWith("/sender/")
            ? route.url.replace("/sender/", "")
            : route.url.startsWith("/receiver/")
            ? route.url.replace("/receiver/", "")
            : route.url;
            
          return {
            path: relativePath,
            Component: route.component,
          };
        })
      );
    }
    
    return routes;
  });
};
