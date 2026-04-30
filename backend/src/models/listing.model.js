import db from "../config/db.js";

export const create = async (data) => {
  const { food_name, quantity, user_id } = data;

  const result = await db.query(
    "INSERT INTO food_listings (food_name, quantity, user_id) VALUES ($1,$2,$3) RETURNING *",
    [food_name, quantity, user_id]
  );

  return result.rows[0];
};

export const getAll = async () => {
  const result = await db.query("SELECT * FROM food_listings");
  return result.rows;
};