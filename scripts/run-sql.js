/**
 * Execute a SQL file against Supabase PostgreSQL.
 * Usage: node scripts/run-sql.js <path-to-sql-file>
 */
const fs = require("fs");
const path = require("path");
const { createDbClient } = require("./get-db-client");

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error("Usage: node scripts/run-sql.js <sql-file>");
  process.exit(1);
}

const fullPath = path.isAbsolute(sqlFile)
  ? sqlFile
  : path.join(__dirname, "..", sqlFile);

if (!fs.existsSync(fullPath)) {
  console.error(`SQL file not found: ${fullPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(fullPath, "utf8");

async function run() {
  const client = await createDbClient();
  try {
    console.log(`Running: ${sqlFile}`);
    await client.query(sql);
    console.log("Done.");
  } catch (err) {
    console.error("SQL error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
