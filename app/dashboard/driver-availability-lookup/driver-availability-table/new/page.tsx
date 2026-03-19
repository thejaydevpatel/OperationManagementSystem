"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/driver-availability-lookup/driver-availability-table/main";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";


  const BCrumb = [
    { href: "/", title: "Driver Availability Table" },
    { title: "Add New Driver Availability Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "driver_availability_table",
    subkeyWord: "driver_availability_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/driver-availability-lookup/driver-availability-table",
    subDirectoryEndPoint: "/api/driver-availability-lookup/driver-availability-table",
    tableEndPoint: "/api/driver-availability-lookup/driver-availability-table",
    isNew: true,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Add New Driver Availability
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
