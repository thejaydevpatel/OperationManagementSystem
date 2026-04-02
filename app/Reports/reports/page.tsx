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
    href: "/Reports/reports/driver",
    icon: User,
  },
      {
    title: "Free Drivers",
    desc: "Vehicles currently available",
    href: "/Reports/reports/free-drivers",
    icon: CarFront,
  },

  {
    title: "Vehicles Reports",
    desc: "Vehicles allocations and activity",
    href: "/Reports/reports/vehicle",
    icon: Car,
  },
  
  {
    title: "Free Vehicles",
    desc: "Vehicles currently available",
    href: "/Reports/reports/free-vehicles",
    icon: CarFront,
  },
    {
    title: "Guide Reports",
    desc: "Guide allocations and activity",
    href: "/Reports/reports/guide",
    icon: UserCheck,
  },
  {
    title: "Supplier Reports",
    desc: "Supplier Details",
    href: "/Reports/reports/supplier",
    icon: User,
  },
    {
    title: "Complete Duties",
    desc: "All completed bookings",
    href: "/Reports/reports/completed",
    icon: File,
  },
  {
    title: "Cancelled Duties",
    desc: "All cancelled bookings",
    href: "/Reports/reports/cancelled",
    icon: XCircle,
  },

];

export default function ReportsPage() {
  return (
    
    <div className="p-6 space-y-6 mx-20">
<div className="flex items-center gap-3 my-5">
{/* 
  <Link href="/Reports/duty-chart">
    <Button variant="outline" className="flex items-center gap-2">
      <ClipboardList size={16} />
      Operation
    </Button>
  </Link> */}
<Label>Back to Dashboard : </Label>
  <Link href="/dashboard">
    <Button variant="outline" className="flex items-center gap-2">
      <LayoutDashboard size={16} />
      Dashboard
    </Button>
  </Link>

</div>
      <h1 className="text-2xl font-bold">Reports</h1>
<Card>
      <div className="grid gap-5 my-10 mx-15 sm:grid-cols-2 lg:grid-cols-2">
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
</Card>

    </div>
  );
}