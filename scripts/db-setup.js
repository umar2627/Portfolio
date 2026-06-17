/**
 * One command to set up the entire portfolio database:
 *   1. Create all tables, RLS policies, and storage buckets
 *   2. Seed sample portfolio data (if tables are empty)
 *   3. Seed admin credentials from .env.local
 *
 * Usage: npm run db:setup
 *
 * Required in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_DB_PASSWORD  (or a valid DATABASE_URL)
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { createDbClient } = require("./get-db-client");
const { loadEnvFile } = require("./load-env");

loadEnvFile();

async function runSchema(client) {
  const schemaPath = path.join(__dirname, "..", "supabase", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  console.log("→ Creating all tables, policies, and storage buckets...");
  await client.query(sql);
  console.log("✓ Schema created successfully");
}

async function seedSampleData(client) {
  const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM education");
  if (rows[0].count > 0) {
    console.log("→ Sample data already exists, skipping...");
    return;
  }

  const seedPath = path.join(__dirname, "..", "supabase", "migrations", "002_seed_data.sql");
  const sql = fs.readFileSync(seedPath, "utf8");
  console.log("→ Seeding sample education, experience, projects, reviews...");
  await client.query(sql);
  console.log("✓ Sample data seeded");
}

async function seedAdmin(client) {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters");
    process.exit(1);
  }

  console.log("→ Seeding admin credentials...");
  const passwordHash = await bcrypt.hash(password, 12);

  const { rows } = await client.query(
    "SELECT id FROM admin_users WHERE email = $1",
    [email]
  );

  if (rows.length > 0) {
    await client.query(
      `UPDATE admin_users SET password_hash = $1, name = $2, updated_at = NOW() WHERE email = $3`,
      [passwordHash, name, email]
    );
    console.log(`✓ Admin updated: ${email}`);
  } else {
    await client.query(
      `INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3)`,
      [email, passwordHash, name]
    );
    console.log(`✓ Admin created: ${email}`);
  }
}

async function main() {
  console.log("\n=== Portfolio Database Setup ===\n");

  let client;
  try {
    client = await createDbClient();
    console.log("✓ Connected to Supabase database\n");

    await runSchema(client);
    await seedSampleData(client);
    await seedAdmin(client);

    console.log("\n=== Setup complete! ===");
    console.log(`Login at http://localhost:3000/admin/login`);
    console.log(`  Email:    ${process.env.ADMIN_EMAIL}`);
    console.log(`  Password: (value of ADMIN_PASSWORD in .env.local)\n`);
  } catch (err) {
    console.error("\n✗ Setup failed:", err.message);

    if (err.message.includes("password authentication failed")) {
      console.error("\nFix: Set the correct SUPABASE_DB_PASSWORD in .env.local");
      console.error("  Supabase → Project Settings → Database → Database password");
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
      console.error("\nFix: Check NEXT_PUBLIC_SUPABASE_URL is correct");
    }

    process.exit(1);
  } finally {
    if (client) await client.end();
  }
}

main();
