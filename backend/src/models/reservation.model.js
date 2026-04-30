import db from "../config/db.js";

export const create = async (data) => {
  const { user_id, listing_id, quantity } = data;

  const result = await db.query(
    "INSERT INTO reservations (user_id, listing_id, quantity, status) VALUES ($1,$2,$3,'pending') RETURNING *",
    [user_id, listing_id, quantity]
  );

  return result.rows[0];
};

export const findById = async (id) => {
  const result = await db.query(
    "SELECT * FROM reservations WHERE id=$1",
    [id]
  );
  return result.rows[0];
};


export const updateStatus = async (id, status) => {
  await db.query(
    "UPDATE reservations SET status=$1 WHERE id=$2",
    [status, id]
  );
};