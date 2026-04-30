import db from "../config/db.js";

export const create = async (userId, data) => {
  const { restaurant_name, cuisine_type, license_number } = data;

  await db.query(
    "INSERT INTO restaurants (user_id, restaurant_name, cuisine_type, license_number) VALUES ($1,$2,$3,$4)",
    [userId, restaurant_name, cuisine_type, license_number]
  );
};