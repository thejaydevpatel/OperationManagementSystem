"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/tour-guides-lookup/tour-guides-table/main";

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
    { href: "/", title: "Tour Guides Table" },
    { title: "Tour Guides Table List" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "tour_guides_table",
    subkeyWord: "tour_guides_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/tour-guides-lookup/tour-guides-table",
    subDirectoryEndPoint: "/api/tour-guides-lookup/tour-guides-table",
    tableEndPoint: "/api/tour-guides-lookup/tour-guides-table",
    isNew: false,
    isListView: true,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Tour Guides
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
