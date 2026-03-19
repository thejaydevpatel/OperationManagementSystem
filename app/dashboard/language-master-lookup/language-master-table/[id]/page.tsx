"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/language-master-lookup/language-master-table/main";

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
    { href: "/", title: "Language Master Table" },
    { title: "Edit Language Master Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "language_master_table",
    subkeyWord: "language_master_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/language-master-lookup/language-master-table",
    subDirectoryEndPoint: "/api/language-master-lookup/language-master-table",
    tableEndPoint: "/api/language-master-lookup/language-master-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
             Edit Language
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
