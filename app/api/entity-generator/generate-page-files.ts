import fs from "fs";
import path from "path";
import { toPascalCaseText } from "./generate-list-file";

export function generatePageFiles(
  moduleName: string,
  tableName: string,
  isChildPage: boolean,
  mainTable: string
) {
  // Base directory aligned with your folder structure
  let baseDir = path.join(
    process.cwd(),
    "app",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );

  let newDir = path.join(baseDir, "new");
  let idDir = path.join(baseDir, "[id]");
  let listDir = path.join(baseDir, "list");

  if (isChildPage) {
    baseDir = path.join(
      process.cwd(),
      "src",
      moduleName.replaceAll("_", "-"),
      isChildPage ? mainTable : tableName.replaceAll("_", "-"),
      "[id]",
      tableName.replaceAll("_", "-")
    );

    newDir = path.join(baseDir, "new");
    idDir = path.join(baseDir, "[recordid]");
    listDir = path.join(baseDir, "list");
  }

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

  // Contents for new/page.tsx
  let newPageContent = `\
"use client";

import Main from "@/app/components/${moduleName.replaceAll(
    "_",
    "-"
  )}/${tableName.replaceAll("_", "-")}/main";

const BCrumb = [
  {
    to: "/",
    title: "${toPascalCaseText(tableName)}",
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
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
    serviceId: getStringFromParam(someId),
    endPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    subDirectoryEndPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    tableEndPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    isNew: true,
  };

  return (
    <PageContainer
      title={\`Add New \${objModule.subkeyWord}\`}
      description={\`Add new \${objModule.subkeyWord}\`}
    >
      <Breadcrumb title={\`Add New \${objModule.subkeyWord}\`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default NewPage;
`;
  if (isChildPage) {
    newPageContent = `\
"use client";

 import Main from "@/app/components/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}/main";
import { useParams } from "next/navigation";
 
const BCrumb = [
  {
    to: "/",
    title: "${toPascalCaseText(tableName)}",
  },
  {
    title: "Add New",
  },
];

const NewPage = () => {
    const params = useParams();
    const id = Number(params.id || 0);
    const recordId = String(params.recordid || "0");

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
    serviceId: String(recordId),
    endPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    subDirectoryEndPoint:  \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    tableEndPoint:  \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    isNew: true,
    mainServiceId: id,
  };

  return (
    <PageContainer
      title={\`Add New \${objModule.subkeyWord}\`}
      description={\`Add new \${objModule.subkeyWord}\`}
    >
      <Breadcrumb title={\`Add New \${objModule.subkeyWord}\`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default NewPage;
`;
  }

  // Contents for [id]/page.tsx
  let idPageContent = `\
"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import Main from "@/app/components/${moduleName.replaceAll(
    "_",
    "-"
  )}/${tableName.replaceAll("_", "-")}/main";
import { useParams } from "next/navigation";
import { getStringFromParam } from "@/app/components/utils/data-type-parser";

const BCrumb = [
  {
    to: "/",
    title: "${toPascalCaseText(moduleName)}",
  },
  {
    title: "Edit ${toPascalCaseText(tableName)}",
  },
];

const EditPage = () => {
  const params = useParams();
  const id = params.id;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
    serviceId: getStringFromParam(id),
    endPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    subDirectoryEndPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    tableEndPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    isNew: false,
  };

  return (
    <PageContainer
      title={\`Manage \${objModule.subkeyWord}\`}
      description={\`Manage \${objModule.subkeyWord}\`}
    >
      <Breadcrumb title={\`Manage \${objModule.subkeyWord}\`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default EditPage;
`;

  if (isChildPage) {
    idPageContent = `\
"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import Main from "@/app/components/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}/main";
import { useParams } from "next/navigation";
import { getStringFromParam } from "@/app/components/utils/data-type-parser";

const BCrumb = [
  {
    to: "/",
    title: "${toPascalCaseText(moduleName)}",
  },
  {
    title: "Edit ${toPascalCaseText(tableName)}",
  },
];

const EditPage = () => {
   const params = useParams();
    const id = Number(params.id || 0);
    const recordId = String(params.recordid || "0");

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
    serviceId: String(recordId),
    endPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    subDirectoryEndPoint:  \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    tableEndPoint:  \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    isNew: false,
    mainServiceId: id,
  };

  return (
    <PageContainer
      title={\`Manage \${objModule.subkeyWord}\`}
      description={\`Manage \${objModule.subkeyWord}\`}
    >
      <Breadcrumb title={\`Manage \${objModule.subkeyWord}\`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default EditPage;
`;
  }

  let listPageContent = `\
"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import Main from "@/app/components/${moduleName.replaceAll(
    "_",
    "-"
  )}/${tableName.replaceAll("_", "-")}/main";
import { useParams } from "next/navigation";
import { getStringFromParam } from "@/app/components/utils/data-type-parser";

const BCrumb = [
  {
    to: "/",
    title: "${toPascalCaseText(moduleName)}",
  },
  {
    title: "List",
  },
];

const ListPage = () => {
  const params = useParams();
  const id = params.id;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
    serviceId: getStringFromParam(id),
    endPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    subDirectoryEndPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    tableEndPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}\`,
    isNew: false,
    isListView: true,
  };

  return (
    <PageContainer
      title={\`Manage \${objModule.subkeyWord}\`}
      description={\`Manage \${objModule.subkeyWord}\`}
    >
      <Breadcrumb title={\`Manage \${objModule.subkeyWord}\`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default ListPage;
`;

  if (isChildPage) {
    listPageContent = `\
"use client";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import Main from "@/app/components/${moduleName.replaceAll(
      "_",
      "-"
    )}/${tableName.replaceAll("_", "-")}/main";
import { useParams } from "next/navigation";
import { getStringFromParam } from "@/app/components/utils/data-type-parser";

const BCrumb = [
  {
    to: "/",
    title: "${toPascalCaseText(moduleName)}",
  },
  {
    title: "List",
  },
];

const ListPage = () => {
  const params = useParams();
    const id = Number(params.id || 0);
    const recordId = String(params.recordid || "0");

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "${tableName}",
    subkeyWord: "${moduleName}",
    serviceId: String(recordId),
    endPoint: \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    subDirectoryEndPoint:  \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`,
    tableEndPoint:  \`\${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${moduleName.replaceAll(
      "_",
      "-"
    )}/${mainTable.replaceAll("_", "-")}/\${id}/${tableName.replaceAll(
      "_",
      "-"
    )}\`, 
    mainServiceId: id,
    isNew: false,
    isListView: true,
  }; 

  return (
    <PageContainer
      title={\`Manage \${objModule.subkeyWord}\`}
      description={\`Manage \${objModule.subkeyWord}\`}
    >
      <Breadcrumb title={\`Manage \${objModule.subkeyWord}\`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default ListPage;
`;
  }

  // Write files only if not existing
  if (!fs.existsSync(newPagePath)) {
    fs.writeFileSync(newPagePath, newPageContent, { encoding: "utf8" });
    console.log(`✅ Created ${newPagePath}`);
  } else {
    console.log(`⏭️ Skipped ${newPagePath} (already exists)`);
  }

  if (!fs.existsSync(idPagePath)) {
    fs.writeFileSync(idPagePath, idPageContent, { encoding: "utf8" });
    console.log(`✅ Created ${idPagePath}`);
  } else {
    console.log(`⏭️ Skipped ${idPagePath} (already exists)`);
  }

  if (!fs.existsSync(listPagePath)) {
    fs.writeFileSync(listPagePath, listPageContent, { encoding: "utf8" });
    console.log(`✅ Created ${listPagePath}`);
  } else {
    console.log(`⏭️ Skipped ${listPagePath} (already exists)`);
  }
}
