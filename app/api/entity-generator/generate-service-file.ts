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

  const interfaceName =
    tableName
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("") + "Entity";

  const content = `
import { Pagination } from "@/app/api/utils/send-response";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import HttpService from "@/app/services/http-service";
${
  isChildPage
    ? `import { ${interfaceName} } from "@/app/api/${moduleName.replaceAll(
        "_",
        "-"
      )}/${mainTable.replaceAll("_", "-")}/[id]/${tableName.replaceAll(
        "_",
        "-"
      )}/interface/${tableName.replaceAll("_", "-")}";`
    : `import { ${interfaceName} } from "@/app/api/${moduleName.replaceAll(
        "_",
        "-"
      )}/${tableName.replaceAll("_", "-")}/interface/${tableName.replaceAll(
        "_",
        "-"
      )}";`
}

/**
 * Generic API Response Wrapper
 * Adjust "status" type if your backend returns number instead of string
 */
export interface ApiResponse<T> {
  status: string; // change to number if backend returns number
  message: string;
  data: T;
  pagination: Pagination;
}

export const get${interfaceName}Api = (module: ModuleDetailsString) => {
  const api = HttpService(module.endPoint);

   return {
      // LIST
      fetchAll: async (
        query: string = ""
      ): Promise<ApiResponse<${interfaceName}[]>> => {
        return await api.get<ApiResponse<${interfaceName}[]>>(query);
      },
  
      // GET BY ID
      fetchById: async (
        id: number | string
      ): Promise<ApiResponse<${interfaceName}>> => {
        return await api.getById<ApiResponse<${interfaceName}>>(id);
      },
  
      // CREATE
      create: async (
        data: ${interfaceName}
      ): Promise<ApiResponse<number>> => {
        return await api.create<ApiResponse<number>>(data);
      },
  
      // UPDATE
      update: async (
        id: number | string,
        data: ${interfaceName}
      ): Promise<ApiResponse<void>> => {
        return await api.update<ApiResponse<void>>(id, data);
      },
  
      // DELETE
      delete: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.delete<ApiResponse<void>>(id);
      },
  
      // CHANGE STATUS
      changeStatus: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.changeStatus<ApiResponse<void>>(id);
      },
  
      // LIST FLAG (same as changeStatus)
      onListFlag: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.changeStatus<ApiResponse<void>>(id);
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
