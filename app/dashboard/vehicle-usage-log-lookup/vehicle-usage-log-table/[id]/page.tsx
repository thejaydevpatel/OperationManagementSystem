"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/vehicle-usage-log-lookup/vehicle-usage-log-table/main";

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
    { href: "/", title: "Vehicle Usage Log Table" },
    { title: "Edit Vehicle Usage Log Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "vehicle_usage_log_table",
    subkeyWord: "vehicle_usage_log_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/vehicle-usage-log-lookup/vehicle-usage-log-table",
    subDirectoryEndPoint: "/api/vehicle-usage-log-lookup/vehicle-usage-log-table",
    tableEndPoint: "/api/vehicle-usage-log-lookup/vehicle-usage-log-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Edit Vehicle Usage Log
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
