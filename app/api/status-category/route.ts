
import { Pool } from 'pg';
import { z } from "zod";
import { success, error, exists } from "@/utils/response";


// Setup PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tms_db',
  password: '12345678',
  port: 5432,
}); 

// display
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    const offset = (page - 1) * limit;

    // Fetch paginated data
    const result = await pool.query('SELECT * FROM status_category ORDER BY id ASC LIMIT $1 OFFSET $2', [limit, offset]);

    // Fetch total count
    const countResult = await pool.query('SELECT COUNT(*) FROM status_category');
    const totalCount = parseInt(countResult.rows[0].count, 10);

    // return success({ data: result.rows, totalCount });
    return success({ data: { items: result.rows,totalCount: totalCount}
    });

  } catch (err) {
    console.error(err);
    return error({ message: "Error fetching status categories" });
  }
}


// ZOD validation
const StatusCategorySchema = z.object({
  name: z
    .string()
    .nonempty("Name is required"),

  description: z
    .string()
    .optional(),

  isactive: z
    .boolean()
    .optional()
    .default(true),
});

//inset 

export async function POST(req: Request) {
  try {
    // Read raw body
    const body = await req.json();

    //  Validate using Zod
    const validatedData = StatusCategorySchema.parse(body);

     // Check duplicate
    const existing = await pool.query(
      "SELECT * FROM status_category WHERE name = $1",
      [validatedData.name]
    );
    if (existing.rows.length > 0) {
      return exists({ message: `Status category "${validatedData.name}" already exists` });
    }

    const { name, description, isactive } = validatedData;

    // Insert into DB
    const result = await pool.query(
      `INSERT INTO status_category (name, description, isactive)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description || null, isactive]
    );
    return success({ message: "Status category created", data: result.rows[0], status: 201 });

    } catch (err: unknown) {      // Use unknown instead of any
      console.error(err);
     if (err instanceof Error) {
      return error({ message: err.message });
    }
    return error({ message: "An unknown error occurred" });
  }
}
