import { Pool } from 'pg';

// Setup PostgreSQL connection
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tms_db',
  password: '12345678',
  port: 5432,
}); 
