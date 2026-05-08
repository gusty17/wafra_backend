import pkg from "pg";
const { Pool } = pkg;

console.log("DB URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection (outside the config)
pool.query("SELECT 1")
  .then(() => console.log("DB Connected ✅"))
  .catch((err) => console.error("DB Error ❌", err));

export default pool;