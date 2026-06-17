const fs = require("fs");
const path = require("path");

function loadEnvFile(filename = ".env.local") {
  const envPath = path.join(__dirname, "..", filename);

  if (!fs.existsSync(envPath)) {
    console.error(`Missing ${filename} — create it from the README template.`);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf8");
  const parsed = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    parsed[key] = value;
  }

  // Apply to process.env — skip empty values so duplicates don't wipe real values
  for (const [key, value] of Object.entries(parsed)) {
    if (value) {
      process.env[key] = value;
    }
  }
}

module.exports = { loadEnvFile };
