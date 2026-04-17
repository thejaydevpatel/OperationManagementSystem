"use client";


import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  User,
  UserCheck,
  CarFront,
  XCircle,
  File,
  IndianRupee
} from "lucide-react";

const reports = [
  {
    title: "Drivers Reports",
    desc: "View all Free Drivers",
    href: "/dashboard/Management/reports/driver",
    icon: User,
  },
      {
    title: "Free Drivers",
    desc: "Vehicles currently available",
    href: "/dashboard/Management/reports/free-drivers",
    icon: CarFront,
  },

  {
    title: "Vehicles Reports",
    desc: "Vehicles allocations and activity",
    href: "/dashboard/Management/reports/vehicle",
    icon: Car,
  },
  
  {
    title: "Free Vehicles",
    desc: "Vehicles currently available",
    href: "/dashboard/Management/reports/free-vehicles",
    icon: CarFront,
  },
    {
    title: "Guide Reports",
    desc: "Guide allocations and activity",
    href: "/dashboard/Management/reports/guide",
    icon: UserCheck,
  },
  {
    title: "Supplier Reports",
    desc: "Supplier Details",
    href: "/dashboard/Management/reports/supplier",
    icon: User,
  },
    {
    title: "Complete Duties",
    desc: "All completed bookings",
    href: "/dashboard/Management/reports/completed",
    icon: File,
  },
  {
    title: "Cancelled Duties",
    desc: "All cancelled bookings",
    href: "/dashboard/Management/reports/cancelled",
    icon: XCircle,
  },

];

export default function ReportsPage() {
  return (
    
    <div className="p-6 space-y-6 ">
 
      <h1 className="text-center text-2xl font-bold ">Reports</h1>
 
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {reports.map((r, i) => (
          <Link key={i} href={r.href}>
            <Card className="hover:shadow-xl transition cursor-pointer hover:-translate-y-1">
              <CardContent className="flex items-center gap-4 ">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <r.icon size={28} />
                </div>

                <div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
 
    </div>
  );
}