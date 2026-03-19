"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/shared-group-route-points-lookup/shared-group-route-points-table/main";

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
    { href: "/", title: "Shared Group Route Points Table" },
    { title: "Shared Group Route Points Table List" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "shared_group_route_points_table",
    subkeyWord: "shared_group_route_points_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/shared-group-route-points-lookup/shared-group-route-points-table",
    subDirectoryEndPoint: "/api/shared-group-route-points-lookup/shared-group-route-points-table",
    tableEndPoint: "/api/shared-group-route-points-lookup/shared-group-route-points-table",
    isNew: false,
    isListView: true,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Shared Group Route Points
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
