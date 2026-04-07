import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load .env.local if available, otherwise fallback to process.env
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Migration started...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Only one connection for migrations
  });

  const db = drizzle(pool);

  // This will run migrations on the database, skipping ones that have already been run
  await migrate(db, {
    migrationsFolder: "src/lib/db/migrations",
  });

  console.log("Migration completed successfully!");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
