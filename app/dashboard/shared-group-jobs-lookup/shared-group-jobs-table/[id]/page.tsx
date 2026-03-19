"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/shared-group-jobs-lookup/shared-group-jobs-table/main";

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
    { href: "/", title: "Shared Group Jobs Table" },
    { title: "Edit Shared Group Jobs Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "shared_group_jobs_table",
    subkeyWord: "shared_group_jobs_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/shared-group-jobs-lookup/shared-group-jobs-table",
    subDirectoryEndPoint: "/api/shared-group-jobs-lookup/shared-group-jobs-table",
    tableEndPoint: "/api/shared-group-jobs-lookup/shared-group-jobs-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Edit Shared Group Job
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
