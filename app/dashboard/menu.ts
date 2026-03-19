// menu.ts
import {
  Home,
  Users,
  Layers,
  Clock,
  ClipboardList,
  MapPin,
  Globe,
  Truck,
  Car,
  UserCheck,
  CalendarCheck,
  FileText,
  Map,
  Briefcase,
  Star,
  Tag,
  Shuffle,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export const menuStructure = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Users", href: "/users", icon: Users },
  {
    name: "Master",
    icon: Layers,
    children: [
      { name: "Status Category", href: "/dashboard/status-category-lookup/status-category-table/list", icon: Clock },
      { name: "Status", href: "/dashboard/status-master-lookup/status-master-table/list", icon: ClipboardList },
      { name: "Location", href: "/dashboard/location-master-lookup/location-master-table/list", icon: MapPin },
      { name: "Language", href: "/dashboard/language-master-lookup/language-master-table/list", icon: Globe },
      { name: "Supplier", href: "/dashboard/supplier-master-lookup/supplier-master-table/list", icon: Truck },
      { name: "Vehicle types", href: "/dashboard/vehicle-types-lookup/vehicle-types-table/list", icon: Car },
    ],
  },
  {
    name: "Resources",
    icon: Users,
    children: [
      { name: "Drivers", href: "/dashboard/drivers-lookup/drivers-table/list", icon: UserCheck },
      { name: "Driver Duty", href: "/dashboard/driver-duty-lookup/driver-duty-table/list", icon: Clock },
      { name: "Driver Availability", href: "/dashboard/driver-availability-lookup/driver-availability-table/list", icon: CalendarCheck },
      { name: "Vehicles", href: "/dashboard/vehicles-lookup/vehicles-table/list", icon: Car },
      { name: "Vehicle Usage Log", href: "/dashboard/vehicle-usage-log-lookup/vehicle-usage-log-table/list", icon: FileText },
      { name: "Tour Guides", href: "/dashboard/tour-guides-lookup/tour-guides-table/list", icon: Map },
    ],
  },
  {
    name: "Operation",
    icon: Briefcase,
    children: [
      { name: "Operation Jobs", href: "/dashboard/operation-jobs-lookup/operation-jobs-table/list", icon: ClipboardList },
      { name: "Job Route Points", href: "/dashboard/job-route-points-lookup/job-route-points-table/list", icon: MapPin },
      { name: "Operation Logs", href: "/dashboard/operation-logs-lookup/operation-logs-table/list", icon: FileText },
      { name: "Guest Review", href: "/dashboard/guest-review-lookup/guest-review-table/list", icon: Star },
      { name: "Placard Details", href: "/dashboard/placard-details-lookup/placard-details-table/list", icon: Tag },
    ],
  },
  {
    name: "Shared Groups",
    icon: Layers,
    children: [
      { name: "Shared Groupings", href: "/dashboard/shared-groupings-lookup/shared-groupings-table/list", icon: Users },
      { name: "Shared Group Route Points", href: "/dashboard/shared-group-route-points-lookup/shared-group-route-points-table/list", icon: MapPin },
      { name: "Shared Group Jobs", href: "/dashboard/shared-group-jobs-lookup/shared-group-jobs-table/list", icon: ClipboardList },
    ],
  },
  {
    name: "Allocations",
    icon: Shuffle,
    children: [
      { name: "Driver Allocation", href: "/dashboard/driver-allocation-lookup/driver-allocation-table/list", icon: UserCheck },
      { name: "Guide Allocation", href: "/dashboard/guide-allocation-lookup/guide-allocation-table/list", icon: UserCheck },
      { name: "Allocation Rules", href: "/dashboard/allocation-rules-lookup/allocation-rules-table/list", icon: ClipboardList },
    ],
  },
  { name: "Settings", href: "/settings", icon: Settings },
];


export const filterMenu = (items: any[], search: string) => {
  // if no search, return full menu
  if (!search) return items;

  return items
    .map(item => {
      // if item has children, filter them recursively
      if (item.children) {
        const filteredChildren = filterMenu(item.children, search);
        // if parent matches or any children match, keep it
        if (filteredChildren.length > 0 || item.name.toLowerCase().includes(search.toLowerCase())) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }

      // if item name matches search, keep it
      if (item.name.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }

      // otherwise, exclude
      return null;
    })
    .filter(Boolean); // remove nulls
};