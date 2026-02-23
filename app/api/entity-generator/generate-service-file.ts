import fs from "fs";
import path from "path";

export function generateServiceFile(
  moduleName: string,
  tableName: string,
  isChildPage: boolean,
  mainTable: string
) {
  const dirPath = path.join(
    process.cwd(),
    "src",
    "app",
    "components",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "service.tsx");

  if (fs.existsSync(filePath)) {
    console.log(
      `⚠️ service.tsx already exists for ${moduleName}/${tableName}, skipping.`
    );
    return;
  }

  //   // Capitalize and PascalCase the tableName for function naming
  //   const pascalTableName = tableName
  //     .split("_")
  //     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  //     .join("");

  const interfaceName =
    tableName
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("") + "Entity";

  const content = `import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import HttpService from "@/app/http-service/http-service";

export const get${interfaceName}Api = (module: ModuleDetailsString) => {
  const api = HttpService(module.endPoint);

  return {
    fetchAll: async (query: string = "") => {
      const res = await api.get(query);
      return res;
    },
    fetchById: async (id: any) => {
      const res = await api.getById(id);
      return res;
    },
    create: async (data: any) => {
      const res = await api.create(data);
      return res;
    },
    delete: async (id: any) => {
      const res = await api._delete(id);
      return res;
    },
    changeStatus: async (id: any) => {
      const res = await api.changeStatus(id);
      return res;
    },
    update: async (id: any, data: any) => {
      const res = await api.update(id, data);
      return res;
    },
    onListFlag: async (id: any) => {
      const res = await api.changeStatus(id);
      return res;
    },
  };
};
`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Generated service.tsx for ${moduleName}/${tableName}`);
  } else {
    console.log(`⏭️ Skipped ${filePath} (already exists)`);
  }
}
