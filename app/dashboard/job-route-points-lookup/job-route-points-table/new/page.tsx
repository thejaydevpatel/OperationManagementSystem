"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/job-route-points-lookup/job-route-points-table/main";

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
    { href: "/", title: "Job Route Points Table" },
    { title: "Add New Job Route Points Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "job_route_points_table",
    subkeyWord: "job_route_points_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/job-route-points-lookup/job-route-points-table",
    subDirectoryEndPoint: "/api/job-route-points-lookup/job-route-points-table",
    tableEndPoint: "/api/job-route-points-lookup/job-route-points-table",
    isNew: true,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Add New Job Route Point
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
