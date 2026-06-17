/**
 * Generate a bcrypt password hash for admin users.
 * Usage: node scripts/hash-password.js YourPasswordHere
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nPassword hash (use in Supabase admin_users table):\n");
  console.log(hash);
  console.log("\nSQL example:");
  console.log(
    `UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@portfolio.com';`
  );
});
