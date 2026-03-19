"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/status-category-lookup/status-category-table/main";

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
    { href: "/", title: "Status Category Table" },
    { title: "Status Category Table List" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "status_category_table",
    subkeyWord: "status_category_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/status-category-lookup/status-category-table",
    subDirectoryEndPoint: "/api/status-category-lookup/status-category-table",
    tableEndPoint: "/api/status-category-lookup/status-category-table",
    isNew: false,
    isListView: true,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Status Categories
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
