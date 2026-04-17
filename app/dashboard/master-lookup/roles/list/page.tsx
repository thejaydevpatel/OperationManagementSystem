"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/master-lookup/roles/main";

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
    { href: "/", title: "Roles" },
    { title: "Roles List" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "roles",
    subkeyWord: "master_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/master-lookup/roles",
    subDirectoryEndPoint: "/api/master-lookup/roles",
    tableEndPoint: "/api/master-lookup/roles",
    isNew: false,
    isListView: true,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
           
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
