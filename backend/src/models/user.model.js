import db from "../config/db.js";

export const create = async ({ email, password, role }) => {
  const result = await db.query(
    "INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING *",
    [ email, password, role]
  );
  return result.rows[0];
};

export const findByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return result.rows[0];
};

export const findById = async (id) => {
  const result = await db.query(
    "SELECT id,  email, role FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};