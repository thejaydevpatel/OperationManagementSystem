import { NextRequest } from "next/server";
    import { ApiResponse } from "@/app/api/utils/send-response";
    import { getStartTime } from "@/lib/date-functions";
    import { uploadFiles } from "@/app/components/js-functions/file-upload/file-upload";
    import { getDbConnection } from "@/app/api/config/postgres-db";
    
const dbName = process.env.PGDB_NAME_COMMON!;
    
    // Map field -> upload path
    const fileFieldConfig: Record<string, { common: string; specific: string }> = {
      filePath: {
        common: process.env.REACT_APP_COMMON_IMAGE_PATH as string,
        specific: "operation_jobs_lookup_operation_jobs_table" as string,
      },
    };
    
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;

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
      .map((field, idx) => `${field} = $${idx + 2}`)
      .join(", ");

    const values = [id, ...Object.values(uploadedPaths)];

    const result = await client.query(
      `UPDATE operation_jobs_lookup_operation_jobs_table
       SET ${setClauses}
       WHERE id = $1
       RETURNING *`,
      values
    );

    if (!result.rows.length) {
      return ApiResponse.notFound(startTime);
    }

    return ApiResponse.updated(result.rows[0], startTime);

  } catch (err) {
    console.error(
      "Error updating file upload ${moduleName}_${tableName}:",
      err
    );
    return ApiResponse.failed("", startTime);
  }
}
