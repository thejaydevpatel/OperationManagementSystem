"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/driver-allocation-lookup/driver-allocation-table/main";

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
    { href: "/", title: "Driver Allocation Table" },
    { title: "Driver Allocation Table List" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "driver_allocation_table",
    subkeyWord: "driver_allocation_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/driver-allocation-lookup/driver-allocation-table",
    subDirectoryEndPoint: "/api/driver-allocation-lookup/driver-allocation-table",
    tableEndPoint: "/api/driver-allocation-lookup/driver-allocation-table",
    isNew: false,
    isListView: true,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Driver Allocatios</CardTitle>
           
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
