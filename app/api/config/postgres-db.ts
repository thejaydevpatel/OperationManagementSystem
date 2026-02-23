import { Pool } from "pg";

type DbClient = Pool;

const dbInstances: Record<string, DbClient> = {};

// Dynamically resolve password from ENV based on dbName
function getDbPassword(dbName: string): string {
  const envVarKey = `PGDB_PASSWORD_${dbName.toUpperCase()}`;
  const password = process.env[envVarKey] || process.env.PGDB_PASSWORD;

  if (!password) {
    throw new Error(
      `Database password not found for DB "${dbName}". Please set environment variable "${envVarKey}" or "PGDB_PASSWORD".`
    );
  }
  return password;
}

// Pool config generator
function getDbConfig(dbName: string, password: string) {
  const user = process.env.PGDB_USER;
  const host = process.env.PGDB_HOST_NAME;
  const port = process.env.PGDB_PORT;

  return {
    user,
    host,
    database: dbName, //tms_db
    password,
    port: parseInt(port || "5432", 10),
    max: parseInt(process.env.PG_POOL_MAX || "10", 10),
    idleTimeoutMillis: parseInt(
      process.env.PG_POOL_IDLE_TIMEOUT || "30000",
      10
    ),
    connectionTimeoutMillis: parseInt(
      process.env.PG_POOL_CONNECTION_TIMEOUT || "2000",
      10
    ),
    ssl:
      process.env.NODE_ENV === "production" && process.env.PG_USE_SSL === "true"
        ? { rejectUnauthorized: true }
        : false,
  };
}

// Main connection factory singleton
export function getDbConnection(dbName: string): DbClient {
  if (dbInstances[dbName]) {
    // console.log(`Returning existing DB connection pool for "${dbName}".`);
    return dbInstances[dbName];
  }

  // console.log(`Creating new DB connection pool for "${dbName}"...`);
  const password = getDbPassword(dbName);
  const pool = new Pool(getDbConfig(dbName, password));

  // Event listeners for the pool
  pool.on("error", (err) => {
    console.error(`Unexpected error on idle client for DB "${dbName}":`, err);
  });

  pool.on("connect", () => {
    // console.log(`A new client connected to DB "${dbName}".`);
  });

  // pool.on("acquire", (client) => {
  //   // console.log(`Client acquired from pool for DB "${dbName}".`);
  // });

  // pool.on("release", (client) => {
  //   // console.log(`Client released back to pool for DB "${dbName}".`);
  // });

  dbInstances[dbName] = pool;
  return pool;
}

// Function to close all database connections gracefully
export function closeAllDbConnections(): Promise<void[]> {
  // console.log(
  //"Initiating graceful shutdown: Closing all database connections..."
  //  );
  const closePromises: Promise<void>[] = [];
  for (const dbName in dbInstances) {
    if (dbInstances.hasOwnProperty(dbName)) {
      const pool = dbInstances[dbName];
      // console.log(`Closing DB "${dbName}" pool...`);
      closePromises.push(
        pool
          .end()
          .then(() => {
            // console.log(`DB "${dbName}" pool closed successfully.`);
          })
          .catch((err) => {
            console.error(`Error closing DB "${dbName}" pool:`, err);
          })
      );
      delete dbInstances[dbName]; // Remove from instance map
    }
  }
  return Promise.all(closePromises);
}

// Register for process termination signals for graceful shutdown
process.on("SIGTERM", () => {
  closeAllDbConnections().finally(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  closeAllDbConnections().finally(() => {
    process.exit(0);
  });
});


