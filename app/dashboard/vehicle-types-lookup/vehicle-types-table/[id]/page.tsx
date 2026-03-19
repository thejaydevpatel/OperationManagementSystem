"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/vehicle-types-lookup/vehicle-types-table/main";

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
    { href: "/", title: "Vehicle Types Table" },
    { title: "Edit Vehicle Types Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "vehicle_types_table",
    subkeyWord: "vehicle_types_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/vehicle-types-lookup/vehicle-types-table",
    subDirectoryEndPoint: "/api/vehicle-types-lookup/vehicle-types-table",
    tableEndPoint: "/api/vehicle-types-lookup/vehicle-types-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Edit Vehicle Type
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
