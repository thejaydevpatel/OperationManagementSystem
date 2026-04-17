// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarMenuSub,
//   SidebarMenuSubItem,
//   SidebarMenuSubButton,
// } from "@/components/ui/sidebar"
 
// import * as Icons from "lucide-react"
// import {
//   Collapsible,
//   CollapsibleTrigger,
//   CollapsibleContent,
// } from "@/components/ui/collapsible"

// import Header from "@/components/header"
// import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumbs"
// import { Input } from "@/components/ui/input"


// type MenuChild = {
//   label: string
//   href: string
//   icon?: React.ElementType
// }

// type MenuItem = {
//   label: string
//   icon: React.ElementType
//   key: string
//   href?: string
//   children?: MenuChild[]
// }


// const menuItems: MenuItem[] = [
//   {
//     key: "dashboard",
//     label: "Dashboard",
//     icon: Icons.Home,
//     href: "/dashboard",
//   },
//   {
//     key: "Operations",
//     label: "Operations",
//     icon: Icons.List,
//     href: "/dashboard/Management/duty-chart",
//   },
//   {
//     key: "reports",
//     label: "Reports",
//     icon: Icons.BarChart3  ,
//     href: "/dashboard/Management/reports",
//   },
//   // {
//   //   key: "users",
//   //   label: "Admin Users",
//   //   icon: Icons.Users,
//   //   href: "/dashboard/admin-users-lookup/admin-users-table/list",
//   // },


//   // MASTER
//   {
//     key: "users",
//     label: "Users",
//     icon: Icons.Layers,
//     children: [
//       { label: "role", href: "/dashboard/master-lookup/roles/list", icon: Icons.Map },
//       { label: "Admin Users", href: "/dashboard/master-lookup/admin-users/list", icon: Icons.Users,},
//       { label: "Status Category", href: "/dashboard/status-category-lookup/status-category-table/list", icon: Icons.Clock },
//       { label: "Status", href: "/dashboard/status-master-lookup/status-master-table/list", icon: Icons.ClipboardList },
//       { label: "Location", href: "/dashboard/location-master-lookup/location-master-table/list", icon: Icons.MapPin },
//       { label: "Language", href: "/dashboard/language-master-lookup/language-master-table/list", icon: Icons.Globe },
//       { label: "Supplier", href: "/dashboard/supplier-master-lookup/supplier-master-table/list", icon: Icons.Truck },
//       { label: "Supplier Types", href: "/dashboard/supplier-types-lookup/supplier-types-table/list", icon: Icons.Truck },
//       { label: "Vehicle Types", href: "/dashboard/vehicle-types-lookup/vehicle-types-table/list", icon: Icons.Car },
//     ],
//   },

//   // RESOURCES
//   {
//     key: "resources",
//     label: "Resources",
//     icon: Icons.Users,
//     children: [
//       { label: "Users", href: "/dashboard/users-lookup/users-table/list", icon: Icons.Users },
//       { label: "Agents", href: "/dashboard/agents-lookup/agents-table/list", icon: Icons.Users },
//       { label: "Drivers", href: "/dashboard/drivers-lookup/drivers-table/list", icon: Icons.UserCheck },
//       // { label: "Driver Duty", href: "/dashboard/driver-duty-lookup/driver-duty-table/list", icon: Icons.Clock },
//       // { label: "Driver Availability", href: "/dashboard/driver-availability-lookup/driver-availability-table/list", icon: Icons.CalendarCheck },
//       { label: "Vehicles", href: "/dashboard/vehicles-lookup/vehicles-table/list", icon: Icons.Car },
//       // { label: "Vehicle Usage Log", href: "/dashboard/vehicle-usage-log-lookup/vehicle-usage-log-table/list", icon: Icons.FileText },
//       { label: "Tour Guides", href: "/dashboard/tour-guides-lookup/tour-guides-table/list", icon: Icons.Map },
//       // { label: "Guide language Price", href: "/dashboard/lookup/guide-language-price/list", icon: Icons.Map },
//       // { label: "test", href: "/dashboard/lookup/test/list", icon: Icons.Map },
//       // { label: "Guide language Price", href: "/dashboard/guide-price-lookup/guide-price-table/list", icon: Icons.Map },
//     ],
//   },

//   // OPERATION
//   {
//     key: "operation",
//     label: "Operation",
//     icon: Icons.Briefcase,
//     children: [
//       { label: "Operation Jobs", href: "/dashboard/operation-jobs-lookup/operation-jobs-table/list", icon: Icons.ClipboardList },
//       // { label: "Job Route Points", href: "/dashboard/job-route-points-lookup/job-route-points-table/list", icon: Icons.MapPin },
//       { label: "Operation Logs", href: "/dashboard/operation-logs-lookup/operation-logs-table/list", icon: Icons.FileText },
//       { label: "Guest Review", href: "/dashboard/guest-review-lookup/guest-review-table/list", icon: Icons.Star },
//       { label: "Placard Details", href: "/dashboard/placard-details-lookup/placard-details-table/list", icon: Icons.Tag },
//     ],
//   },

//   // SHARED GROUPS
//   // {
//   //   key: "shared_groups",
//   //   label: "Shared Groups",
//   //   icon: Icons.Layers,
//   //   children: [
//   //     { label: "Shared Groupings", href: "/dashboard/shared-groupings-lookup/shared-groupings-table/list", icon: Icons.Users },
//   //     { label: "Shared Group Route Points", href: "/dashboard/shared-group-route-points-lookup/shared-group-route-points-table/list", icon: Icons.MapPin },
//   //     { label: "Shared Group Jobs", href: "/dashboard/shared-group-jobs-lookup/shared-group-jobs-table/list", icon: Icons.ClipboardList },
//   //   ],
//   // },

//   // ALLOCATIONS
//   {
//     key: "allocations",
//     label: "Allocations",
//     icon: Icons.Shuffle,
//     children: [
//       // { label: "Driver Allocation", href: "/dashboard/driver-allocation-lookup/driver-allocation-table/list", icon: Icons.UserCheck },
//       // { label: "Guide Allocation", href: "/dashboard/guide-allocation-lookup/guide-allocation-table/list", icon: Icons.UserCheck },
//       { label: "Allocation Rules", href: "/dashboard/allocation-rules-lookup/allocation-rules-table/list", icon: Icons.ClipboardList },
//     ],
//   },

//   {
//     key: "settings",
//     label: "Settings",
//     icon: Icons.Settings,
//     href: "#",
//   },
// ]



// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {


//   const [dbModules, setDbModules] = React.useState<any[]>([])

//   const pathname = usePathname()
// //  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
//     const [openMenus, setOpenMenus] = React.useState<string[]>([])
//     const [search, setSearch] = React.useState("")

//     const toggleMenu = (menu: string) => {
//   setOpenMenus((prev) =>
//     prev.includes(menu)
//       ? prev.filter((m) => m !== menu)
//       : [...prev, menu]
//   )
// }

// const [role, setRole] = React.useState<string | null>(null);

// React.useEffect(() => {
//   const cookie = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("admin_role="));

//   if (cookie) {
//     setRole(cookie.split("=")[1]);
//   }
// }, []);


// React.useEffect(() => {
//   fetch("/api/sidebar")
//     .then((res) => res.json())
//     .then((data) => setDbModules(data))
//     .catch((err) => console.error("Sidebar API error:", err))
// }, [])


// const dynamicMenu: MenuItem[] = React.useMemo(() => {
//   return (dbModules || []).map((mod) => {

//     const ModuleIcon = (
//       mod.icon && Icons[mod.icon as keyof typeof Icons]
//         ? Icons[mod.icon as keyof typeof Icons]
//         : Icons.Layers
//     ) as React.ElementType

//     return {
//       key: `db-${mod.id}`,
//       label: mod.module_name,
//       icon: ModuleIcon,

//       children: (mod.pages || []).map((p: any) => {

//         const PageIcon = (
//           p.icon && Icons[p.icon as keyof typeof Icons]
//             ? Icons[p.icon as keyof typeof Icons]
//             : undefined
//         ) as React.ElementType | undefined

//         return {
//           label: p.page_name,
//           href: p.path,
//           icon: PageIcon,
//         }
//       }),
//     }
//   })
// }, [dbModules])

// const combinedMenu = React.useMemo(() => {
//   if (!role) return []

// let baseMenu: MenuItem[] = []

//   if (role === "user") {
//     baseMenu = menuItems.filter(
//       (item) =>
//         item.key === "dashboard" ||
//         item.key === "Operations" ||
//         item.key === "reports"
//     )
//   }

//   // 🔥 Merge DB menu here
//   return [...baseMenu, ...dynamicMenu]

// }, [role, dynamicMenu])

// const filteredMenu = React.useMemo(() => {
//   if (!search.trim()) return combinedMenu;

//   const lowerSearch = search.toLowerCase();

//   return combinedMenu
//     .map((item) => {
//       const isParentMatch = item.label.toLowerCase().includes(lowerSearch);

//       if (!item.children) {
//         return isParentMatch ? item : null;
//       }

//       const matchedChildren = item.children.filter((child) =>
//         child.label.toLowerCase().includes(lowerSearch)
//       );

//       if (isParentMatch || matchedChildren.length > 0) {
//         return {
//           ...item,
//           children: matchedChildren,
//         };
//       }

//       return null;
//     })
//     .filter((item): item is MenuItem => item !== null);
// }, [search, combinedMenu]); // ✅ FIXED

// React.useEffect(() => {
//   // If search is empty → do nothing (keep manual control)
//   if (!search.trim()) return

//   const lowerSearch = search.toLowerCase()

//   const menusToOpen: string[] = []

//   combinedMenu.forEach((item) => {
//     if (!item.children) return

//     const isChildMatch = item.children.some((child) =>
//       child.label.toLowerCase().includes(lowerSearch)
//     )

//     const isParentMatch = item.label.toLowerCase().includes(lowerSearch)

//     if (isChildMatch || isParentMatch) {
//       menusToOpen.push(item.key)
//     }
//   })

//   setOpenMenus(menusToOpen)
// }, [search, combinedMenu])

// React.useEffect(() => {
//   if (!search.trim()) {
//     setOpenMenus([])
//   }
// }, [search])

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen flex-col w-full rtl:flex-col-reverse">

//         <Header />

//         <div className="flex flex-1">

//           {/* Sidebar */}
//           <Sidebar className="rtl:right-auto rtl:left-auto">

//             <SidebarContent className="mt-14">
//               <SidebarGroup>
//                 <SidebarGroupContent>
//                   {/* Search Box */}
//                   <div className="p-2">
//                     <Input
//                       placeholder="Search menu..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                     />
//                   </div>
//                   <SidebarMenu>
//                     {filteredMenu.map((item) => {
//                       const Icon = item.icon

//                       // 🔹 SIMPLE MENU
//                       if (!item.children) {
//                         return (
//                           <SidebarMenuItem key={item.key}>
//                             <SidebarMenuButton asChild>
//                               <Link href={item.href || "#"}>
//                                 <Icon className="me-2 h-4 w-4" />
//                                 {item.label}
//                               </Link>
//                             </SidebarMenuButton>
//                           </SidebarMenuItem>
//                         )
//                       }

//                       // 🔹 DROPDOWN MENU
//                       return (
//                         <Collapsible
//                           key={item.key}
//                           open={openMenus.includes(item.key)}
//                           onOpenChange={() => toggleMenu(item.key)}
//                         >
//                           <SidebarMenuItem>
//                             <CollapsibleTrigger asChild>
//                               <SidebarMenuButton className="w-full justify-between">
//                                 <div className="flex items-center">
//                                   <Icon className="me-2 h-4 w-4" />
//                                   {item.label}
//                                 </div>

//                                 {openMenus.includes(item.key) ? (
//                                   <Icons.ChevronDown className="h-4 w-4" />
//                                 ) : (
//                                   <Icons.ChevronRight className="h-4 w-4" />
//                                 )}
//                               </SidebarMenuButton>
//                             </CollapsibleTrigger>

//                             <CollapsibleContent>
//                               <SidebarMenuSub>
//                                 {item.children.map((child) => {
//                                   const ChildIcon = child.icon

//                                   return (
//                                     <SidebarMenuSubItem key={child.href}>
//                                       <SidebarMenuSubButton asChild>
//                                         <Link
//                                           href={child.href}
//                                           className={
//                                             pathname === child.href
//                                               ? "font-semibold text-primary"
//                                               : ""
//                                           }
//                                         >
//                                           {ChildIcon && (
//                                             <ChildIcon className="me-2 h-4 w-4" />
//                                           )}
//                                           {child.label}
//                                         </Link>
//                                       </SidebarMenuSubButton>
//                                     </SidebarMenuSubItem>
//                                   )
//                                 })}
//                               </SidebarMenuSub>
//                             </CollapsibleContent>
//                           </SidebarMenuItem>
//                         </Collapsible>
//                       )
//                     })}
//                   </SidebarMenu>
//                 </SidebarGroupContent>
//               </SidebarGroup>
//             </SidebarContent>


//             {/* Footer */}
//             <SidebarFooter>
//               <div className="px-4 py-2 text-sm text-muted-foreground">
//                 © 2026 Technoheaven
//               </div>
//             </SidebarFooter>

//           </Sidebar>


//           {/* Main Content */}
//           <main className="flex-1 p-6 mt-1 overflow-hidden">
//             <DynamicBreadcrumb />
//             {children}
//           </main>

//         </div>

//       </div>
//     </SidebarProvider>
//   )
// }


import DashboardLayout from "./DashboardLayoutClient"
import { cookies } from "next/headers"


export default async function Layout({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies()
  const role = cookieStore.get("admin_role")?.value || null

const res = await fetch("http://localhost:3000/api/sidebar", {
  cache: "force-cache",
  next: { revalidate: 3600 }, // 1 hour cache
})

  const dbModules = await res.json()

  return (
    <DashboardLayout role={role} dbModules={dbModules}>
      {children}
    </DashboardLayout>
  )
}