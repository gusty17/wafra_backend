import db from "../config/db.js";

export const create = async (userId, data) => {
  const { organization_name, registration_number } = data;

  await db.query(
    "INSERT INTO food_banks (user_id, organization_name, registration_number) VALUES ($1,$2,$3)",
    [userId, organization_name, registration_number]
  );
};