import db from "../config/db.js";

export const create = async (userId, data) => {
  const { first_name, last_name, age, phone } = data;

  const result = await db.query(
    "INSERT INTO individuals (user_id, first_name, last_name, age, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [userId, first_name, last_name, age, phone]
  );

  return result.rows[0];
};