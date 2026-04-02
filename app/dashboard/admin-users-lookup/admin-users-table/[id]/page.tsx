"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/admin-users-lookup/admin-users-table/main";

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
    { href: "/", title: "Admin Users Table" },
    { title: "Edit Admin Users Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "admin_users_table",
    subkeyWord: "admin_users_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/admin-users-lookup/admin-users-table",
    subDirectoryEndPoint: "/api/admin-users-lookup/admin-users-table",
    tableEndPoint: "/api/admin-users-lookup/admin-users-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Edit Admin Users Table</CardTitle>
           
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
