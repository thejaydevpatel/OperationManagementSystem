"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/driver-duty-lookup/driver-duty-table/main";

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
    { href: "/", title: "Driver Duty Table" },
    { title: "Edit Driver Duty Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "driver_duty_table",
    subkeyWord: "driver_duty_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/driver-duty-lookup/driver-duty-table",
    subDirectoryEndPoint: "/api/driver-duty-lookup/driver-duty-table",
    tableEndPoint: "/api/driver-duty-lookup/driver-duty-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Edit Driver Duty
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
