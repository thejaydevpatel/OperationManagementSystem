"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/allocation-rules-lookup/allocation-rules-table/main";

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
    { href: "/", title: "Allocation Rules Table" },
    { title: "Edit Allocation Rules Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "allocation_rules_table",
    subkeyWord: "allocation_rules_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/allocation-rules-lookup/allocation-rules-table",
    subDirectoryEndPoint: "/api/allocation-rules-lookup/allocation-rules-table",
    tableEndPoint: "/api/allocation-rules-lookup/allocation-rules-table",
    isNew: false,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
              Edit Allocation Rule
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
