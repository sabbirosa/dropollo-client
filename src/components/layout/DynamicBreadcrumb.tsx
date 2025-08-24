import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { receiverSidebarItems } from "@/routes/receiverSidebarItems";
import { senderSidebarItems } from "@/routes/senderSidebarItems";
import type { ISidebarItems } from "@/types";
import { useLocation } from "react-router";

interface BreadcrumbItemData {
  title: string;
  url: string;
}

export function DynamicBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine which sidebar items to use based on the current path
  const getSidebarItems = () => {
    if (pathname.startsWith("/admin")) {
      return adminSidebarItems;
    } else if (pathname.startsWith("/sender")) {
      return senderSidebarItems;
    } else if (pathname.startsWith("/receiver")) {
      return receiverSidebarItems;
    }
    return [];
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItemData[] => {
    const sidebarItems = getSidebarItems();
    const breadcrumbs: BreadcrumbItemData[] = [];

    // Add dashboard root
    if (pathname.startsWith("/admin")) {
      breadcrumbs.push({ title: "Admin Dashboard", url: "/admin" });
    } else if (pathname.startsWith("/sender")) {
      breadcrumbs.push({ title: "Sender Dashboard", url: "/sender" });
    } else if (pathname.startsWith("/receiver")) {
      breadcrumbs.push({ title: "Receiver Dashboard", url: "/receiver" });
    } else if (pathname === "/") {
      breadcrumbs.push({ title: "Home", url: "/" });
    }

    // Find the current page in sidebar items and its parent
    const findCurrentPage = (items: ISidebarItems[]): { current: BreadcrumbItemData; parent?: BreadcrumbItemData } | null => {
      for (const item of items) {
        if (item.url === pathname || (item.url !== "#" && pathname.startsWith(item.url))) {
          return { current: { title: item.title, url: item.url } };
        }
        if (item.items) {
          for (const subItem of item.items) {
            if (subItem.url === pathname || pathname.startsWith(subItem.url)) {
              return { 
                current: { title: subItem.title, url: subItem.url },
                parent: { title: item.title, url: item.url }
              };
            }
          }
        }
      }
      return null;
    };

    const currentPage = findCurrentPage(sidebarItems);
    if (currentPage) {
      if (currentPage.parent) {
        breadcrumbs.push(currentPage.parent);
      }
      breadcrumbs.push(currentPage.current);
    } else {
      // Fallback: try to create breadcrumbs from the URL path
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        const title = lastSegment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ title, url: pathname });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

      // If no breadcrumbs found, show a default
    if (breadcrumbs.length === 0) {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    // If we're on the dashboard root, don't show additional breadcrumbs
    if (breadcrumbs.length === 1 && (pathname === "/admin" || pathname === "/sender" || pathname === "/receiver")) {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbs[0].title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <div key={item.url} className="flex items-center">
            {index > 0 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
            <BreadcrumbItem className="hidden md:block">
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.url}>
                  {item.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
