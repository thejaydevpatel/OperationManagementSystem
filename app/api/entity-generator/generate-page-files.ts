import fs from "fs";
import path from "path";
import { toPascalCaseText } from "./generate-list-file";

export function generatePageFiles(
  moduleName: string,
  tableName: string,
  isChildPage: boolean = false,
  parentTable?: string
) {
  const moduleSlug = moduleName.replaceAll("_", "-");
  const tableSlug = tableName.replaceAll("_", "-");
  const parentSlug = parentTable?.replaceAll("_", "-");

// Base directory aligned with your folder structure
let baseDir: string;

if (isChildPage && parentTable) {
  // CHILD STRUCTURE
  baseDir = path.join(
    process.cwd(),
    "app",
    "dashboard",
    moduleName.replaceAll("_", "-"),
    parentTable.replaceAll("_", "-"),
    "[id]",
    tableName.replaceAll("_", "-")
  );
} else {
  // NORMAL STRUCTURE
  baseDir = path.join(
    process.cwd(),
    "app",
    "dashboard",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );
}
  const newDir = path.join(baseDir, "new");
  const idDir = isChildPage
    ? path.join(baseDir, "[recordid]")
    : path.join(baseDir, "[id]");
  const listDir = path.join(baseDir, "list");

  // Ensure directories exist
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }
  if (!fs.existsSync(idDir)) {
    fs.mkdirSync(idDir, { recursive: true });
  }
  if (!fs.existsSync(listDir)) {
    fs.mkdirSync(listDir, { recursive: true });
  }

  // File paths
  const newPagePath = path.join(newDir, "page.tsx");
  const idPagePath = path.join(idDir, "page.tsx");
  const listPagePath = path.join(listDir, "page.tsx");

  const baseEndpoint =
  isChildPage && parentSlug
    ? `/api/${moduleSlug}/${parentSlug}/\${id}/${tableSlug}`
    : `/api/${moduleSlug}/${tableSlug}`;

function buildPageTemplate(
  title: string,
  mode: "new" | "edit" | "list"
) {
  return `\
"use client";

import { useParams } from "next/navigation";
import Main from "@/app/components/${moduleName.replaceAll(
    "_",
    "-"
  )}/${tableName.replaceAll("_", "-")}/main";

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
    { href: "/", title: "${toPascalCaseText(tableName)}" },
    { title: "${title}" },
  ];

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const recordid = params?.recordid;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
   serviceId: String(id ?? recordid ?? ""),
    endPoint: "${baseEndpoint}",
    subDirectoryEndPoint: "${baseEndpoint}",
    tableEndPoint: "${baseEndpoint}",
    isNew: ${mode === "new"},
    isListView: ${mode === "list"},
  };

  return (
    <div className="p-6 space-y-6">


 
      <Card>
        <CardHeader>
          <CardTitle>${title}</CardTitle>
           
        </CardHeader>

        <CardContent>
          <Main module={objModule} />
        </CardContent>
      </Card>

    </div>
  );
};

export default Page;
`;
}


const newPageContent = buildPageTemplate(
  "Add New " + toPascalCaseText(tableName),
  "new"
);

const idPageContent = buildPageTemplate(
  "Edit " + toPascalCaseText(tableName),
  "edit"
);

const listPageContent = buildPageTemplate(
  toPascalCaseText(tableName) + " List",
  "list"
);

  const writeIfNotExists = (filePath: string, content: string) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, { encoding: "utf8" });
      console.log(`✅ Created ${filePath}`);
    } else {
      console.log(`⏭️ Skipped ${filePath} (already exists)`);
    }
  };

  writeIfNotExists(newPagePath, newPageContent);
  writeIfNotExists(idPagePath, idPageContent);
  writeIfNotExists(listPagePath, listPageContent);
}