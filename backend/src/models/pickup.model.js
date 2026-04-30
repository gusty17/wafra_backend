import db from "../config/db.js";

export const create = async (reservationId, code) => {
  const result = await db.query(
    "INSERT INTO pickups (reservation_id, code) VALUES ($1,$2) RETURNING *",
    [reservationId, code]
  );

  return result.rows[0];
};

export const findByCode = async (code) => {
  const result = await db.query(
    "SELECT * FROM pickups WHERE code=$1",
    [code]
  );

  return result.rows[0];
};