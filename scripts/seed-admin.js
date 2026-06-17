/**
 * Seeds the admin user into Supabase with a bcrypt-hashed password.
 *
 * Set these in .env.local:
 *   ADMIN_EMAIL=admin@portfolio.com
 *   ADMIN_PASSWORD=YourSecurePassword
 *
 * Usage: npm run seed:admin
 */
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
const { loadEnvFile } = require("./load-env");

loadEnvFile();

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error("Missing required env vars in .env.local:");
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
}

const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";
const SALT_ROUNDS = 12;

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  console.log("Hashing password...");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: existing } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("admin_users")
      .update({
        password_hash: passwordHash,
        name: ADMIN_NAME,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email);

    if (error) {
      console.error("Failed to update admin:", error.message);
      process.exit(1);
    }

    console.log(`Updated admin user: ${email}`);
  } else {
    const { error } = await supabase.from("admin_users").insert({
      email,
      password_hash: passwordHash,
      name: ADMIN_NAME,
    });

    if (error) {
      if (error.message.includes("admin_users")) {
        console.error("Failed: admin_users table does not exist.");
        console.error("Run this first: npm run db:create-admin-table");
      } else {
        console.error("Failed to create admin:", error.message);
      }
      process.exit(1);
    }

    console.log(`Created admin user: ${email}`);
  }

  console.log("Done. You can now log in at /admin/login");
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
