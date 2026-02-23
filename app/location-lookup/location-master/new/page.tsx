"use client";
//types
export interface ModuleDetailsString {
  moduleId: number;
  keyWord: string;
  subkeyWord: string;
  serviceId: string;
  endPoint: string;
  subDirectoryEndPoint: string;
  tableEndPoint: string;
  isNew: boolean;
}

// utils
export function getStringFromParam(
  param: string | string[] | undefined
): string {
  if (!param) return "";
  return Array.isArray(param) ? param[0] : param;
}



import { useParams } from "next/navigation";
// import { getStringFromParam } from 
// import { ModuleDetailsString } from 
// import Main from "@/app/components/location-lookup/location-master/main";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

const BCrumb = [
  {
    href: "/",
    title: "Location Master",
  },
  {
    title: "Add New",
  },
];

const NewPage = () => {
  const params = useParams();
  const someId = params.someId;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "location_master",
    subkeyWord: "location_lookup",
    serviceId: getStringFromParam(someId),
    endPoint: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-lookup/location-master`,
    subDirectoryEndPoint: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-lookup/location-master`,
    tableEndPoint: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-lookup/location-master`,
    isNew: true,
  };

  return (
  <div className="p-6 space-y-6">

    {/* 🔹 Breadcrumb */}
    <Breadcrumb>
      <BreadcrumbList>
        {BCrumb.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>
                  {item.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < BCrumb.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>

    <Separator />

    {/* 🔹 Page Card */}
    <Card>
      <CardHeader>
        <CardTitle>
          Add New {objModule.subkeyWord}
        </CardTitle>
        <CardDescription>
          Add new {objModule.subkeyWord}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* 🔹 Your Main Component */}
        {/* <Main module={objModule} /> */}
      </CardContent>
    </Card>

  </div>
)
};

export default NewPage;
