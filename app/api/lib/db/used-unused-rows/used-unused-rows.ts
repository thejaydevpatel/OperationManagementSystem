export interface ValidationResult {
  validate: boolean;
  tables?: string[];
  message?: string;
}

/**
 * 1️⃣ Check if a row is referenced inside the same table
 */
export const checkLookupUsage = async (
  tableName: string,
  id: string,
  client: any
): Promise<ValidationResult> => {
  try {
    const query = `
      SELECT COUNT(*) 
      FROM ${tableName}
      WHERE id = $1
    `;

    const result = await client.query(query, [id]);

    if (Number(result.rows[0].count) > 0) {
      return {
        validate: false,
        tables: [tableName],
        message: "Row is already used.",
      };
    }

    return { validate: true };
  } catch (error) {
    console.error("Lookup usage error:", error);
    return {
      validate: false,
      tables: [tableName],
      message: "Validation failed.",
    };
  }
};

/**
 * 2️⃣ Check if a row is referenced in another table/column
 */
export const checkForeignKeyUsage = async (
  referenceTable: string,
  referenceColumn: string,
  id: string,
  client: any
): Promise<ValidationResult> => {
  try {
    const query = `
      SELECT COUNT(*) 
      FROM ${referenceTable}
      WHERE ${referenceColumn} = $1
    `;

    const result = await client.query(query, [id]);

    if (Number(result.rows[0].count) > 0) {
      return {
        validate: false,
        tables: [referenceTable],
        message: `Row is referenced in ${referenceTable}.`,
      };
    }

    return { validate: true };
  } catch (error) {
    console.error("Foreign key validation error:", error);
    return {
      validate: false,
      tables: [referenceTable],
      message: "Validation failed.",
    };
  }
};

export const getUsedUnusedRows = async (
  tableName: string,
  client: any
): Promise<{ id: string; is_used: boolean }[]> => {
  try {
    const query = `
      SELECT id, 
      CASE WHEN COUNT(*) > 0 THEN true ELSE false END AS is_used
      FROM ${tableName}
      GROUP BY id
    `;

    const result = await client.query(query);

    return result.rows;
  } catch (error) {
    console.error("Usage fetch error:", error);
    return [];
  }
};

interface ForeignKeyConfig {
  table: string;
  column: string;
}

interface PrepareValidationConfig {
  tableName: string;
  id: string;
  client: any;
  foreignKeys?: ForeignKeyConfig[];
}

/**
 * Master function that combines lookup + foreign key checks
 */
export const PrepareAndDispatchValidation = async (
  tableName: string,
  client: any,
  id: string,
  foreignKeys: { table: string; column: string }[] = []
): Promise<ValidationResult> => {
  try {
    // 1️⃣ Check lookup usage (self table)
    const lookupResult = await checkLookupUsage(tableName, id, client);

    if (!lookupResult.validate) {
      return lookupResult;
    }

    // 2️⃣ Check all foreign key usages
    for (const fk of foreignKeys) {
      const fkResult = await checkForeignKeyUsage(
        fk.table,
        fk.column,
        id,
        client
      );

      if (!fkResult.validate) {
        return fkResult;
      }
    }

    // ✅ All validations passed
    return { validate: true };
  } catch (error) {
    console.error("PrepareAndDispatchValidation error:", error);

    return {
      validate: false,
      message: "Validation failed.",
    };
  }
};