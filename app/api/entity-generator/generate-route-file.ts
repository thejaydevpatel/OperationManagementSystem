import fs from "fs";
import path from "path";

interface FieldDefinition {
  name: string;
  type: string;
  // isRequired?: boolean;
  // isPrimary?: boolean;
  nullable?: boolean;
  specificControl?: string;
}

export default function generateApiFiles(
  moduleName: string,
  tableName: string,
  fields: FieldDefinition[],
  dbEnv: string,
  isChildPage: boolean,
  mainTable: string,
  mainId: string
) {
  let baseDir = path.join(
    process.cwd(),
    "app",
    "api",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );
  let idDir = path.join(baseDir, "[id]");
  let interfaceDir = path.join(baseDir, "interface");
  let fileUploadDir = path.join(baseDir, "[id]", "upload");

  if (isChildPage) {
    baseDir = path.join(
      process.cwd(),
       "app",
      "api",
      moduleName.replaceAll("_", "-"),
      isChildPage ? mainTable : tableName.replaceAll("_", "-"),
      "[id]",
      tableName.replaceAll("_", "-")
    );
    idDir = path.join(baseDir, "[recordid]");
    interfaceDir = path.join(baseDir, "interface");
    fileUploadDir = path.join(baseDir, "[recordid]", "upload");
  }

  // Ensure main folder exists
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Ensure ID folder exists
  if (!fs.existsSync(idDir)) {
    fs.mkdirSync(idDir, { recursive: true });
  }

  // Ensure FileUpload folder exists
  if (!fs.existsSync(fileUploadDir)) {
    fs.mkdirSync(fileUploadDir, { recursive: true });
  }

  // Ensure interface folder exists
  if (!fs.existsSync(interfaceDir)) {
    fs.mkdirSync(interfaceDir, { recursive: true });
  }

  // Generate Interface Name
  const interfaceName =
    tableName
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("") + "Entity";

  const interfaceFields = fields
    .flatMap((f) => {
      let tsType = "string";
      if (f.type.includes("INT")) tsType = "number";
      if (f.type === "BOOLEAN") tsType = "boolean";
      if (f.type.includes("TIMESTAMP")) tsType = "string";
      if (f.type === "UUID") tsType = "string";
      if (f.specificControl === "File") tsType = "File";
      if (f.specificControl === "CustomDate") tsType = "Date";

      const baseProp = `  ${f.name}${f.nullable ? "?" : ""}: ${tsType};`;

      // If specificControl is File, add an extra `${name}Logo` property
      if (f.specificControl === "File") {
        const logoProp = `  ${f.name}Logo${f.nullable ? "?" : ""}: string;`;
        return [baseProp, logoProp];
      }

      return [baseProp];
    })
    .join("\n");

  // INTERFACE FILE
  const interfacePath = path.join(
    interfaceDir,
    `${tableName.replaceAll("_", "-")}.ts`
  );
  if (!fs.existsSync(interfacePath)) {
    const interfaceContent = `export interface ${interfaceName} {\n${interfaceFields}\n}\n`;
    fs.writeFileSync(interfacePath, interfaceContent, "utf8");
    console.log(`✅ Created interface for ${moduleName}/${tableName}`);
  } else {
    console.log(`⏭️ Skipped interface ${interfacePath} (already exists)`);
  }

  // MAIN ROUTE FILE (GET all + POST)
  const mainRoutePath = path.join(baseDir, "route.ts");
  if (!fs.existsSync(mainRoutePath)) {
    const mainRouteContent = `import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { ${interfaceName} } from "./interface/${tableName.replaceAll(
      "_",
      "-"
    )}";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
// import { checkLookupUsage } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";
import { getUsedUnusedRows } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";


const dbName = process.env.${dbEnv}!;

export async function GET(req: NextRequest${
      isChildPage ? ", { params }: { params: { id: string } }" : ""
    }) {
  const startTime = getStartTime();
  try {
  const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "5", 10);
    const offset = (page - 1) * pageSize;

    // Whitelist sort fields
    const allowedSortFields = ${JSON.stringify(
      fields.map((f) => f.name)
    )}; // adjust to your table columns
    const requestedSortBy = searchParams.get("sortBy") ?? "id";
    const sortBy = allowedSortFields.includes(requestedSortBy)
      ? requestedSortBy
      : "id";

    // Whitelist order
    const requestedOrder = searchParams.get("order");
    const order = requestedOrder === "desc" ? "DESC" : "ASC";

    
  const client = getDbConnection(dbName);
    const result = await client.query(\`SELECT * FROM ${moduleName}_${tableName} WHERE is_deleted=false${
      isChildPage ? ` AND ${mainId}=$3` : ""
    }  ORDER BY \${sortBy} \${order} LIMIT $1 OFFSET $2\`,
      ${isChildPage ? "[pageSize, offset, params.id]" : "[pageSize, offset]"});

      
    const countResult = await client.query(\`SELECT COUNT(*)::int AS total FROM ${moduleName}_${tableName} WHERE is_deleted=false${
      isChildPage ? ` AND ${mainId}=$1` : ""
    }\`,   ${isChildPage ? "[params.id]" : "[]"});
    const totalRecords =
      countResult?.rows.length > 0 ? countResult?.rows[0].total : 0;
    const totalPages =
      countResult?.rows.length > 0 ? Math.ceil(totalRecords / pageSize) : 0;

      if (result?.rows.length > 0) {
            // const usedUnusedRows = await checkLookupUsage(
            //   dbName,
            //   "${moduleName}_${tableName}"
            // );
      
            // result.rows.forEach((element) => {
            //   const usageStatus = usedUnusedRows.find((a) => a.id === element.id);
            //   element.is_used = usageStatus?.usage_status;
            // });
            const usedUnusedRows = await getUsedUnusedRows(
                        "${moduleName}_${tableName}",
                        client
                      );
            
                      result.rows.forEach((element) => {
                        const usageData = usedUnusedRows.find((a) => a.id === element.id);
                        element.is_used = usageData?.is_used ?? false;
                      });
          }

    return ApiResponse.fetched(result?.rows, startTime, "",{
      page,
      pageSize,
      totalRecords,
      totalPages,
      sortBy,
      order,
    });
  } catch (err) {
    console.error("Error fetching ${moduleName}_${tableName}:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function POST(req: NextRequest${
      isChildPage ? ", { params }: { params: { id: string } }" : ""
    }) {
  const startTime = getStartTime();
  try {
  const client = getDbConnection(dbName);
  const referer = req.headers.get("referer");
  const body: Partial<${interfaceName}> = await req.json();

    const userDetails = await retriveTokenDetails(req);
    body.tenant_id = userDetails?.tenantId;
    body.created_by = userDetails?.empCode;
    body.created_at = new Date();
    body.host_ip = userDetails?.userIp;
    body.url = referer && referer.trim() !== "" ? referer : req.url;
    
    ${isChildPage ? `body.${mainId} = Number(params.id)` : ""}
    
 Object.keys(body).forEach((key) => {
      if ((body as any)[key] === "") {
        (body as any)[key] = null;
      }
    });

    

    const keys = Object.keys(body);
    const values = Object.values(body);
    if (keys.length === 0) return ApiResponse.failed("No data provided", startTime);
    const placeholders = keys.map((_, i) => \`$\${i + 1}\`).join(", ");
    const query = \`INSERT INTO ${moduleName}_${tableName} (\${keys.join(", ")}) VALUES (\${placeholders}) RETURNING *\`;
    const result = await client.query(query, values);
    return ApiResponse.created(result.rows[0].id, startTime);
  } catch (err) {
    console.error("Error inserting ${moduleName}_${tableName}:", err);
    return ApiResponse.failed("", startTime);
  }
}
`;
    if (!fs.existsSync(mainRoutePath)) {
      fs.writeFileSync(mainRoutePath, mainRouteContent, "utf8");
      console.log(`✅ Created main route for ${moduleName}/${tableName}`);
    } else {
      console.log(`⏭️ Skipped main route ${mainRoutePath} (already exists)`);
    }
  }

  // ID ROUTE FILE (GET by ID + PUT + DELETE)
  const idRoutePath = path.join(idDir, "route.ts");
  if (!fs.existsSync(idRoutePath)) {
    const idRouteContent = `import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { ${interfaceName} } from "../interface/${tableName.replaceAll(
      "_",
      "-"
    )}";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
import { PrepareAndDispatchValidation } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";

const dbName = process.env.${dbEnv}!;


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ${
    isChildPage ? "recordid" : "id"
  }: string }> }
) {
  const startTime = getStartTime();

  try {
    const { ${isChildPage ? "recordid" : "id"} } = await params;

    const client = getDbConnection(dbName);

    const result = await client.query(
      \`SELECT * FROM ${moduleName}_${tableName} WHERE id = $1\`,
      [Number(${isChildPage ? "recordid" : "id"})]
    );

    return ApiResponse.fetched(result?.rows, startTime, "");
  } catch (err) {
    console.error("Error fetching ${moduleName}_${tableName}:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ ${isChildPage ? "recordid" : "id"}: string }> }) {
  const startTime = getStartTime();
  try { 
  const { ${isChildPage ? "recordid" : "id"} } = await params;
  const client = getDbConnection(dbName);
  const referer = req.headers.get("referer");
    const body: Partial<${interfaceName}> = await req.json();

    const userDetails = await retriveTokenDetails(req);

    body.tenant_id = userDetails?.tenantId;
    body.updated_by = userDetails?.empCode;
    body.updated_at = new Date().toISOString();
    body.host_ip = userDetails?.userIp;
    body.url = referer && referer.trim() !== "" ? referer : req.url;

    // remove protected columns 
    delete (body as any).id; 
    delete (body as any).short_id; 
    delete (body as any).created_at; 
    delete (body as any).created_by;

    // remove generated File control helper fields (Logo) 
    const filteredBody = Object.fromEntries( 
      Object.entries(body).filter(([key]) => !key.endsWith("Logo")) 
    );

    const keys = Object.keys(filteredBody);
    const values = Object.values(filteredBody);

    if (keys.length === 0) {
      return ApiResponse.failed("No fields to update", startTime);
    }

    const setClause = keys.map((k, i) => \`\${k} = $\${i + 1}\`).join(", ");
    
    const query = \`
    UPDATE ${moduleName}_${tableName} 
    SET \${setClause} 
    WHERE id = $\${keys.length + 1} 
    RETURNING *
    \`;

    const result = await client.query(query, [
      ...values, 
     Number(${isChildPage ? "recordid" : "id"})
    ]);

    return ApiResponse.updated(
      result.rows[0]?.id || ${isChildPage ? "recordid" : "id"},
      startTime
    );

  } catch (err) {
    console.error("Error updating ${moduleName}_${tableName}:", err);
    return ApiResponse.failed("", startTime);
  }
}



export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ ${isChildPage ? "recordid" : "id"}: string }> }
 ) {
  const startTime = getStartTime();
  try {

      const { ${isChildPage ? "recordid" : "id"} } = await params;

      const client = getDbConnection(dbName);

  const referenced = await PrepareAndDispatchValidation(
        "${moduleName}_${tableName}",
        client,
        ${isChildPage ? "recordid" : "id"}
      );
  
      if (referenced.validate) {
        return ApiResponse.referencedError("", startTime, referenced.tables);
      }

      const userDetails = await retriveTokenDetails(req);
      const deletedAt = new Date().toISOString();
      const deletedBy = userDetails?.empCode; 
  
      const query =\`
        UPDATE ${moduleName}_${tableName}
        SET is_deleted = true,
            deleted_at = $2,
            deleted_by = $3
        WHERE id = $1
        RETURNING *\`;
  
      const result = await client.query(query, [
      ${isChildPage ? "recordid" : "id"},
      deletedAt,
      deletedBy,
    ]);
   

    return ApiResponse.deleted(startTime);
  } catch (err) {
    console.error("Error deleting ${moduleName}_${tableName}:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ${isChildPage ? "recordid" : "id"}: string }> }
) {
  const startTime = getStartTime();

  try {
    const { ${isChildPage ? "recordid" : "id"} } = await params;

    const client = getDbConnection(dbName);

    const result = await client.query(
      \`UPDATE ${moduleName}_${tableName} 
       SET is_active = NOT is_active 
       WHERE id = $1 
       RETURNING *\`,
      [${isChildPage ? "recordid" : "id"}]
    );

    if (!result.rows.length) {
      return ApiResponse.notFound(startTime);
    }

    if (result.rows[0].is_active) {
      return ApiResponse.activated(startTime);
    } else {
      return ApiResponse.suspended(startTime);
    }

  } catch (err) {
    console.error("Error updating status ${moduleName}_${tableName}:", err);
    return ApiResponse.failed("", startTime);
  }
}


`;

    if (!fs.existsSync(idRoutePath)) {
      fs.writeFileSync(idRoutePath, idRouteContent, "utf8");
      console.log(`✅ Created ID route for ${moduleName}/${tableName}`);
    } else {
      console.log(`⏭️ Skipped idRoutePath ${idRoutePath} (already exists)`);
    }
  }

  // ID ROUTE FILE (GET by ID + PUT + DELETE)
  const idFileRoutePath = path.join(fileUploadDir, "route.ts");
  if (!fs.existsSync(idFileRoutePath)) {
    const idFileContent = `import { NextRequest } from "next/server";
    import { ApiResponse } from "@/app/api/utils/send-response";
    import { getStartTime } from "@/lib/date-functions";
    import { uploadFiles } from "@/app/components/js-functions/file-upload/file-upload";
    import { getDbConnection } from "@/app/api/config/postgres-db";
    
const dbName = process.env.${dbEnv}!;
    
    // Map field -> upload path
    const fileFieldConfig: Record<string, { common: string; specific: string }> = {
      filePath: {
        common: process.env.REACT_APP_COMMON_IMAGE_PATH as string,
        specific: "${moduleName}_${tableName}" as string,
      },
    };
    
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ${isChildPage ? "recordid" : "id"}: string }> }
) {
  const startTime = getStartTime();

  try {
    const { ${isChildPage ? "recordid" : "id"} } = await params;

    if (!id) {
      return ApiResponse.failed("Missing id", startTime);
    }

    const client = getDbConnection(dbName);

    const formData = await req.formData();

    const uploadedPaths: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (key === "id") continue;

      if (value instanceof File && fileFieldConfig[key]) {
        const paths = fileFieldConfig[key];

        const uploadedPath = await uploadFiles(
          value,
          paths.common,
          paths.specific
        );

        uploadedPaths[key] = uploadedPath;
      }
    }

    if (Object.keys(uploadedPaths).length === 0) {
      return ApiResponse.failed("No valid files uploaded", startTime);
    }

    const setClauses = Object.keys(uploadedPaths)
      .map((field, idx) => \`\${field} = \$\${idx + 2}\`)
      .join(", ");

    const values = [id, ...Object.values(uploadedPaths)];

    const result = await client.query(
      \`UPDATE ${moduleName}_${tableName}
       SET \${setClauses}
       WHERE id = $1
       RETURNING *\`,
      values
    );

    if (!result.rows.length) {
      return ApiResponse.notFound(startTime);
    }

    return ApiResponse.updated(result.rows[0], startTime);

  } catch (err) {
    console.error(
      "Error updating file upload \${moduleName}_\${tableName}:",
      err
    );
    return ApiResponse.failed("", startTime);
  }
}
`;

    if (!fs.existsSync(idFileRoutePath)) {
      fs.writeFileSync(idFileRoutePath, idFileContent, "utf8");
      console.log(`✅ Created ID route for ${moduleName}/${tableName}`);
    } else {
      console.log(
        `⏭️ Skipped idFileRoutePath ${idFileRoutePath} (already exists)`
      );
    }
  }
}
