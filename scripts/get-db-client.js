const { Client } = require("pg");
const { loadEnvFile } = require("./load-env");

const POOLER_REGIONS = [
  "ap-southeast-2",
  "ap-southeast-1",
  "ap-south-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "eu-central-2",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "sa-east-1",
];

function getProjectRef() {
  loadEnvFile();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const ref = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!ref) {
    console.error("Invalid NEXT_PUBLIC_SUPABASE_URL in .env.local");
    process.exit(1);
  }
  return ref;
}

function getPassword() {
  loadEnvFile();
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!password) {
    console.error("\nMissing SUPABASE_DB_PASSWORD in .env.local");
    console.error("  Supabase → Project Settings → Database → Database password\n");
    process.exit(1);
  }
  return password;
}

async function tryConnect(config) {
  const client = new Client({
    ...config,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  await client.connect();
  return client;
}

async function createDbClient() {
  loadEnvFile();

  const password = getPassword();
  const ref = getProjectRef();

  // Option 1: explicit DATABASE_URL (if user copied from Supabase dashboard)
  const url = process.env.DATABASE_URL?.trim();
  if (url && !url.includes("[") && !url.includes("YOUR-PASSWORD")) {
    try {
      return await tryConnect({ connectionString: url });
    } catch {
      // fall through to auto-detect
    }
  }

  // Option 2: explicit region (fast path)
  const region = process.env.SUPABASE_DB_REGION?.trim();
  if (region) {
    for (const prefix of ["aws-1", "aws-0"]) {
      try {
        const client = await tryConnect({
          host: `${prefix}-${region}.pooler.supabase.com`,
          port: 5432,
          user: `postgres.${ref}`,
          password,
          database: "postgres",
        });
        return client;
      } catch {
        // try next prefix
      }
    }
  }

  // Option 3: auto-detect pooler region (IPv4 — works on Windows)
  const regionsToTry = region
    ? [region]
    : process.env.SUPABASE_DB_REGION
      ? [process.env.SUPABASE_DB_REGION]
      : POOLER_REGIONS;

  for (const prefix of ["aws-1", "aws-0"]) {
    for (const r of regionsToTry) {
      try {
        const client = await tryConnect({
          host: `${prefix}-${r}.pooler.supabase.com`,
          port: 5432,
          user: `postgres.${ref}`,
          password,
          database: "postgres",
        });
        return client;
      } catch (err) {
        if (err.message.includes("password authentication failed")) {
          console.error("\n✗ Wrong SUPABASE_DB_PASSWORD");
          console.error("  Supabase → Project Settings → Database → Database password\n");
          process.exit(1);
        }
      }
    }
  }

  // Option 4: direct connection (IPv6 only — may not work on all networks)
  try {
    return await tryConnect({
      host: `db.${ref}.supabase.co`,
      port: 5432,
      user: "postgres",
      password,
      database: "postgres",
    });
  } catch (err) {
    console.error("\n✗ Could not connect to Supabase database.\n");
    console.error("Fix options:");
    console.error("  1. Verify SUPABASE_DB_PASSWORD is correct");
    console.error("  2. Add SUPABASE_DB_REGION=ap-southeast-2  (your region from Supabase dashboard)");
    console.error("  3. Or paste the full connection string as DATABASE_URL from:");
    console.error("     Supabase → Connect → Session pooler → URI\n");
    console.error("Error:", err.message);
    process.exit(1);
  }
}

module.exports = { createDbClient, getProjectRef, getPassword };
