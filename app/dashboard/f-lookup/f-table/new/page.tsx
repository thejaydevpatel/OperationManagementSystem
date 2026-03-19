"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/f-lookup/f-table/main";

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
    { href: "/", title: "F Table" },
    { title: "Add New F Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "f_table",
    subkeyWord: "f_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/f-lookup/f-table",
    subDirectoryEndPoint: "/api/f-lookup/f-table",
    tableEndPoint: "/api/f-lookup/f-table",
    isNew: true,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader>
          <CardTitle>Add New F Table</CardTitle>
           
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
