"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

// import {
//   Home,
//   Settings,
//   Users,
//   Layers,
  // ChevronRight,
  // ChevronDown,
// } from "lucide-react"
import {
  Home,
  Settings,
  Users,
  Layers,
  MapPin,
  Globe,
  Truck,
  Car,
  Clock,
  CalendarCheck,
  Map,
  Briefcase,
  ClipboardList,
  FileText,
  Tag,
  Star,
  Shuffle,
  UserCheck,
  ChevronRight,
  ChevronDown,
  List,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

import Header from "@/components/header"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumbs"
import { Input } from "@/components/ui/input"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
//  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
    const [openMenus, setOpenMenus] = React.useState<string[]>([])
    const [search, setSearch] = React.useState("")

    const toggleMenu = (menu: string) => {
  setOpenMenus((prev) =>
    prev.includes(menu)
      ? prev.filter((m) => m !== menu)
      : [...prev, menu]
  )
}

type MenuChild = {
  label: string
  href: string
  icon?: React.ElementType
}

type MenuItem = {
  label: string
  icon: React.ElementType
  key: string
  href?: string
  children?: MenuChild[]
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    key: "Reports",
    label: "Reports",
    icon: List,
    href: "/Reports/duty-chart",
  },
  // {
  //   key: "users",
  //   label: "Users",
  //   icon: Users,
  //   href: "#",
  // },

  // MASTER
  {
    key: "master",
    label: "Master",
    icon: Layers,
    children: [
      { label: "Status Category", href: "/dashboard/status-category-lookup/status-category-table/list", icon: Clock },
      { label: "Status", href: "/dashboard/status-master-lookup/status-master-table/list", icon: ClipboardList },
      { label: "Location", href: "/dashboard/location-master-lookup/location-master-table/list", icon: MapPin },
      { label: "Language", href: "/dashboard/language-master-lookup/language-master-table/list", icon: Globe },
      { label: "Supplier", href: "/dashboard/supplier-master-lookup/supplier-master-table/list", icon: Truck },
      { label: "Vehicle Types", href: "/dashboard/vehicle-types-lookup/vehicle-types-table/list", icon: Car },
    ],
  },

  // RESOURCES
  {
    key: "resources",
    label: "Resources",
    icon: Users,
    children: [
      { label: "Drivers", href: "/dashboard/drivers-lookup/drivers-table/list", icon: UserCheck },
      { label: "Driver Duty", href: "/dashboard/driver-duty-lookup/driver-duty-table/list", icon: Clock },
      { label: "Driver Availability", href: "/dashboard/driver-availability-lookup/driver-availability-table/list", icon: CalendarCheck },
      { label: "Vehicles", href: "/dashboard/vehicles-lookup/vehicles-table/list", icon: Car },
      { label: "Vehicle Usage Log", href: "/dashboard/vehicle-usage-log-lookup/vehicle-usage-log-table/list", icon: FileText },
      { label: "Tour Guides", href: "/dashboard/tour-guides-lookup/tour-guides-table/list", icon: Map },
    ],
  },

  // OPERATION
  {
    key: "operation",
    label: "Operation",
    icon: Briefcase,
    children: [
      { label: "Operation Jobs", href: "/dashboard/operation-jobs-lookup/operation-jobs-table/list", icon: ClipboardList },
      { label: "Job Route Points", href: "/dashboard/job-route-points-lookup/job-route-points-table/list", icon: MapPin },
      { label: "Operation Logs", href: "/dashboard/operation-logs-lookup/operation-logs-table/list", icon: FileText },
      { label: "Guest Review", href: "/dashboard/guest-review-lookup/guest-review-table/list", icon: Star },
      { label: "Placard Details", href: "/dashboard/placard-details-lookup/placard-details-table/list", icon: Tag },
    ],
  },

  // SHARED GROUPS
  {
    key: "shared_groups",
    label: "Shared Groups",
    icon: Layers,
    children: [
      { label: "Shared Groupings", href: "/dashboard/shared-groupings-lookup/shared-groupings-table/list", icon: Users },
      { label: "Shared Group Route Points", href: "/dashboard/shared-group-route-points-lookup/shared-group-route-points-table/list", icon: MapPin },
      { label: "Shared Group Jobs", href: "/dashboard/shared-group-jobs-lookup/shared-group-jobs-table/list", icon: ClipboardList },
    ],
  },

  // ALLOCATIONS
  {
    key: "allocations",
    label: "Allocations",
    icon: Shuffle,
    children: [
      { label: "Driver Allocation", href: "/dashboard/driver-allocation-lookup/driver-allocation-table/list", icon: UserCheck },
      { label: "Guide Allocation", href: "/dashboard/guide-allocation-lookup/guide-allocation-table/list", icon: UserCheck },
      { label: "Allocation Rules", href: "/dashboard/allocation-rules-lookup/allocation-rules-table/list", icon: ClipboardList },
    ],
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    href: "#",
  },
]

const filteredMenu = React.useMemo(() => {
  if (!search.trim()) return menuItems

  const lowerSearch = search.toLowerCase()

  return menuItems
    .map((item) => {
      const isParentMatch = item.label.toLowerCase().includes(lowerSearch)

      if (!item.children) {
        return isParentMatch ? item : null
      }

      const matchedChildren = item.children.filter((child) =>
        child.label.toLowerCase().includes(lowerSearch)
      )

      if (isParentMatch || matchedChildren.length > 0) {
        return {
          ...item,
          children: matchedChildren,
        }
      }

      return null
    })
    .filter((item): item is MenuItem => item !== null) // ✅ FIX
}, [search])

React.useEffect(() => {
  // If search is empty → do nothing (keep manual control)
  if (!search.trim()) return

  const lowerSearch = search.toLowerCase()

  const menusToOpen: string[] = []

  menuItems.forEach((item) => {
    if (!item.children) return

    const isChildMatch = item.children.some((child) =>
      child.label.toLowerCase().includes(lowerSearch)
    )

    const isParentMatch = item.label.toLowerCase().includes(lowerSearch)

    if (isChildMatch || isParentMatch) {
      menusToOpen.push(item.key)
    }
  })

  setOpenMenus(menusToOpen)
}, [search])

React.useEffect(() => {
  if (!search.trim()) {
    setOpenMenus([])
  }
}, [search])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-full">

        <Header />

        <div className="flex flex-1">

          {/* Sidebar */}
          <Sidebar>

            <SidebarContent className="mt-14">
              <SidebarGroup>
                <SidebarGroupContent>
{/* Search Box */}
<div className="p-2">
  <Input
    placeholder="Search menu..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
               

<SidebarMenu>
  {filteredMenu.map((item) => {
    const Icon = item.icon

    // 🔹 SIMPLE MENU
    if (!item.children) {
      return (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton asChild>
            <Link href={item.href || "#"}>
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    // 🔹 DROPDOWN MENU
    return (
      <Collapsible
        key={item.key}
        open={openMenus.includes(item.key)}
        onOpenChange={() => toggleMenu(item.key)}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              <div className="flex items-center">
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </div>

              {openMenus.includes(item.key) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => {
                const ChildIcon = child.icon

                return (
                  <SidebarMenuSubItem key={child.href}>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={child.href}
                        className={
                          pathname === child.href
                            ? "font-semibold text-primary"
                            : ""
                        }
                      >
                        {ChildIcon && (
                          <ChildIcon className="mr-2 h-4 w-4" />
                        )}
                        {child.label}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  })}
</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>


            {/* Footer */}
            <SidebarFooter>
              <div className="px-4 py-2 text-sm text-muted-foreground">
                © 2026 My Company
              </div>
            </SidebarFooter>

          </Sidebar>


          {/* Main Content */}
          <main className="flex-1 p-6">
            <DynamicBreadcrumb />
            {children}
          </main>

        </div>

      </div>
    </SidebarProvider>
  )
}