import { NextResponse } from "next/server";
import { getDbConnection } from "../../api/config/postgres-db";
import { generatePageFiles } from "./generate-page-files";
// import generateApiFiles from "./generate-route-file";
// import { generateUseServiceFile } from "./generate-hook-file";
// import { generateServiceFile } from "./generate-service-file";
// import { generateListComponent } from "./generate-list-file";
// import { generateMainComponentFile } from "./generate-main-component-file ";
// import { generatePageFiles } from "./generate-page-files";

type FieldType = {
  name: string;
  type: string;
  size?: string;
  nullable: boolean;
  primaryKey: boolean;
  identity: boolean;
  defaultValue: string;
  constraints: string;
  foreignKey?: boolean;
  refTable?: string;
  refColumn?: string;
  onDeleteCascade?: boolean;
  onUpdateCascade?: boolean;
  system?: boolean;
  toShowOnLayout?: boolean;
  specificControl: string;
};

export async function POST(req: Request) {
  try {
    const {
      dbName,
      moduleName,
      tableName,
      fields,
      isSchemaOnly,
      isChildPage,
      mainTable,
      // mainId,
    }: {
      dbName: string;
      moduleName: string;
      tableName: string;
      fields: FieldType[];
      isSchemaOnly: boolean;
      isChildPage: boolean;
      mainTable: string;
      mainId: string;
    } = await req.json();

    // -------- VALIDATIONS --------
    if (isChildPage && mainTable == "") {
      return NextResponse.json(
        {
          error: "Invalid Parent Module Name", //in future we will check validation from DB
        },
        { status: 400 }
      );
    }

    if (!tableName || !/^[a-z_][a-z0-9_]*$/.test(tableName)) {
      return NextResponse.json(
        {
          error:
            "Invalid table name. Use only lowercase letters, numbers, and underscores, starting with a letter or underscore.",
        },
        { status: 400 }
      );
    }
    if (!fields || fields.length === 0) {
      return NextResponse.json(
        { error: "No fields provided." },
        { status: 400 }
      );
    }

    // Field names: all must follow snake_case (lowercase + underscores)
    for (const field of fields) {
      if (!/^[a-z_][a-z0-9_]*$/.test(field.name)) {
        return NextResponse.json(
          {
            error: `Invalid field name '${field.name}'. Use snake_case (lowercase letters, numbers, underscores, starting with a letter/underscore).`,
          },
          { status: 400 }
        );
      }
    }

    const nonSystemFields = fields.filter((f) => !f.system);
    if (nonSystemFields.length === 0) {
      return NextResponse.json(
        { error: "At least one non-system field is required." },
        { status: 400 }
      );
    }

    const colNames = new Set<string>();
    for (const f of fields) {
      if (!f.name)
        return NextResponse.json(
          { error: "All fields must have a name." },
          { status: 400 }
        );
      if (colNames.has(f.name))
        return NextResponse.json(
          { error: `Duplicate column name: ${f.name}` },
          { status: 400 }
        );
      colNames.add(f.name);

      if (f.size && isNaN(Number(f.size))) {
        return NextResponse.json(
          { error: `Invalid size for column: ${f.name}` },
          { status: 400 }
        );
      }

      if (f.foreignKey && (!f.refTable || !f.refColumn)) {
        return NextResponse.json(
          {
            error: `Foreign key column "${f.name}" must have reference table and column.`,
          },
          { status: 400 }
        );
      }
    }

    // -------- BUILD SQL --------
    const columnDefs: string[] = [];
    const fkConstraints: string[] = [];

    fields.forEach((field) => {
      let typeDef = field.type;
      if (
        field.size &&
        ["VARCHAR", "CHAR", "BIT", "VARBIT", "DECIMAL", "NUMERIC"].includes(
          field.type
        )
      ) {
        typeDef += `(${field.size})`;
      }

      if (field.identity && ["INTEGER", "BIGINT"].includes(field.type)) {
        typeDef = field.type === "BIGINT" ? "BIGSERIAL" : "SERIAL";
      }

      let colDef = `"${field.name}" ${typeDef}`;

      if (!field.nullable) colDef += " NOT NULL";
      if (field.defaultValue) colDef += ` DEFAULT ${field.defaultValue}`;
      if (field.constraints) colDef += ` ${field.constraints}`;

      columnDefs.push(colDef);

      // disable  for fk constraint...............................................................................!!!!!!!!!!!!!!!!!!!!!!111

      // if (field.foreignKey && field.refTable && field.refColumn) {
      //   let fk = `FOREIGN KEY ("${field.name}") REFERENCES "${field.refTable}"("${field.refColumn}")`;
      //   if (field.onDeleteCascade) fk += " ON DELETE CASCADE";
      //   if (field.onUpdateCascade) fk += " ON UPDATE CASCADE";
      //   fkConstraints.push(fk);
      // }

    });

    const primaryKeyField = fields.find((f) => f.primaryKey);
    if (primaryKeyField) {
      columnDefs.push(`PRIMARY KEY ("${primaryKeyField.name}")`);
    }

    // Ensure we add a short_id column only once
    const hasShortId = fields.some((f) => f.name === "short_id");

    if (!hasShortId) {
      columnDefs.push(
        `"short_id" TEXT NOT NULL DEFAULT substring(md5(random()::text), 1, 12)`
      );

      // add a stable unique constraint name
      const constraintName = `"${moduleName}_${tableName}_short_id_key"`;
      columnDefs.push(`CONSTRAINT ${constraintName} UNIQUE ("short_id")`);
    }

    if (fkConstraints.length > 0) {
      columnDefs.push(...fkConstraints);
    }

    const createTableSQL = `CREATE TABLE IF NOT EXISTS "${moduleName}_${tableName}" (\n  ${columnDefs.join(
      ",\n  "
    )}\n);`;

    // -------- EXECUTE SQL --------

    const client = getDbConnection(dbName);

    await client.query(createTableSQL);

    if (isSchemaOnly) {
      return NextResponse.json(
        {
          message: `Table "${moduleName}_${tableName}" created in database ${dbName} successfully Without Files.`,
        },
        { status: 200 }
      );
    }

    // ✅ Generate CRUD API route file if missing
    const pageFile = generatePageFiles(
      moduleName,
      tableName,
      isChildPage,
      mainTable
    );

    // const apiRouteFiles = generateApiFiles(
    //   moduleName,
    //   tableName,
    //   fields,
    //   getDbEnv(dbName),
    //   isChildPage,
    //   mainTable,
    //   mainId
    // );
    // const useService = generateUseServiceFile(
    //   moduleName,
    //   tableName,
    //   fields,
    //   isChildPage,
    //   mainTable
    // );
    // const serviceFile = generateServiceFile(
    //   moduleName,
    //   tableName,
    //   isChildPage,
    //   mainTable
    // );
    // const listFile = generateListComponent(
    //   moduleName,
    //   tableName,
    //   fields,
    //   isChildPage,
    //   mainTable
    // );
    // const mainFile = generateMainComponentFile(
    //   moduleName,
    //   tableName,
    //   fields,
    //   isChildPage,
    //   mainTable
    // );

    return NextResponse.json({
      message: `Table "${moduleName}_${tableName}" created in database ${dbName} successfully`,
      sql: createTableSQL,
     // fileOutput: apiRouteFiles,
    //  useService: useService,
     // serviceFile: serviceFile,
    });
  }catch (error: unknown) {
    console.error("POST /entity-generator error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

const getDbEnv = (dbName: string) => {
  let Env = "";
  switch (dbName) {
    case "ecommerce_master":
      Env = process.env.PGDB_NAME_COMMON!;
      break;
    default:
      break;
  }
  return Env;
};

