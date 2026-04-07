"use client";
import {
  Frame,
  Home,
  Map,
  PieChart,
  ShoppingBag,
  ShoppingCart,
  UserStar,
} from "lucide-react";

import { NavMain } from "@/components/admin/nav-main";
import { NavAnalytics } from "@/components/admin/nav-analytics";
import { NavUser } from "@/components/admin/nav-user";
import { AdminSideHeader } from "@/components/admin/sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { type LucideIcon } from "lucide-react";

// 1. User Profile Type
export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

// 2. Sub-navigation Item (Nested Links)
export interface SidebarSubItem {
  title: string;
  url: string;
}

// 3. Main Navigation Item (Can have sub-items)
export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SidebarSubItem[];
}

// 4. Project/Secondary Navigation Item
export interface SidebarAnalyticsItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

// 5. THE MASTER INTERFACE (Entire Data Object)
export interface SidebarData {
  user: SidebarUser;
  navMain: SidebarNavItem[];
  analytics: SidebarAnalyticsItem[];
}

// This is sample data.
const data: SidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      isActive: true,
      icon: Home,
    },
    {
      title: "Products",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "Inventory",
          url: "/admin/inventory",
        },
      ],
    },
    {
      title: "Manager Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    // {
    //   title: "Users",
    //   url: "/admin/users",
    //   icon: User,
    // },
  ],
  analytics: [
    {
      name: "Product Sales",
      url: "/admin/analytics/product-sales",
      icon: Frame,
    },
    {
      name: "Product Reviews",
      url: "/admin/analytics/product-reviews",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="">
        <AdminSideHeader
          sidebarHeader={{
            title: "Admin Panel",
            logo: UserStar,
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavAnalytics projects={data.analytics} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
