"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/guide-price-lookup/guide-price-table/main";

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
    { href: "/", title: "Guide Price Table" },
    { title: "Add New Guide Price Table" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "guide_price_table",
    subkeyWord: "guide_price_lookup",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "/api/guide-price-lookup/guide-price-table",
    subDirectoryEndPoint: "/api/guide-price-lookup/guide-price-table",
    tableEndPoint: "/api/guide-price-lookup/guide-price-table",
    isNew: true,
    isListView: false,
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader>
          <CardTitle>Add New Guide Price Table</CardTitle>
           
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
