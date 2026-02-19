"use client"

import * as React from "react"
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
  // SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers } from "lucide-react"
// import { RouteProgress } from "@/components/route-progress"
import { Home, Settings, Users } from "lucide-react"
// import { Bell, User } from "lucide-react"
 import Header from "@/components/header"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumbs"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-full rtl:flex-col-reverse">


       <Header/>
      <div className="flex flex-1 ">
        {/* Sidebar */}
        <Sidebar className="rtl:right-auto rtl:left-auto">

          <SidebarContent className="mt-15">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Users className="mr-2 h-4 w-4" />
                        Users
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Link
                    href="/dashboard/status-category"
                    className={ `flex items-center gap-2 ${
                      pathname === "/dashboard/status-category"
                        ? "font-bold text-blue-600"
                        : ""
                    }`}
                  >
                    <Layers className="ml-2 mr-2 h-4 w-4" />
                    Status Category
                  </Link>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

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
