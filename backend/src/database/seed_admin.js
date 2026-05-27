import "dotenv/config";
import bcrypt from "bcryptjs";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedAdmin() {
  const client = await pool.connect();
  try {
    // 1. Patch the role CHECK constraint to allow 'admin'
    await client.query(`
      ALTER TABLE users
        DROP CONSTRAINT IF EXISTS users_role_check;
    `);
    await client.query(`
      ALTER TABLE users
        ADD CONSTRAINT users_role_check
        CHECK (role IN ('restaurant', 'individual', 'foodbank', 'admin'));
    `);
    console.log("✅ Role constraint updated");

    // 2. Upsert the admin user
    const hashedPassword = await bcrypt.hash("admin", 10);
    await client.query(
      `
      INSERT INTO users (username, email, password, role, verification_status)
      VALUES ($1, $2, $3, 'admin', 'approved')
      ON CONFLICT (username) DO UPDATE
        SET password           = EXCLUDED.password,
            role               = 'admin',
            verification_status = 'approved',
            updated_at         = CURRENT_TIMESTAMP;
      `,
      ["admin", "admin@wafra.com", hashedPassword]
    );
    console.log("✅ Admin user created  →  username: admin  |  password: admin");
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
