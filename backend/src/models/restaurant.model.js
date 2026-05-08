import db from "../config/db.js";

const Restaurant = {
  async create({ user_id, restaurant_name, cuisine_type, license_number, location }) {
    const query = `
      INSERT INTO restaurants (
        user_id,
        restaurant_name,
        cuisine_type,
        license_number,
        location
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      user_id,
      restaurant_name,
      cuisine_type,
      license_number,
      location,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByUserId(user_id) {
    const query = `
      SELECT *
      FROM restaurants
      WHERE user_id = $1;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows[0];
  },

  async findById(restaurant_id) {
    const query = `
      SELECT *
      FROM restaurants
      WHERE restaurant_id = $1;
    `;

    const result = await db.query(query, [restaurant_id]);
    return result.rows[0];
  },

  async updateByUserId(user_id, { restaurant_name, cuisine_type, license_number, location }) {
    const query = `
      UPDATE restaurants
      SET
        restaurant_name = COALESCE($1, restaurant_name),
        cuisine_type = COALESCE($2, cuisine_type),
        license_number = COALESCE($3, license_number),
        location = COALESCE($4, location),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING *;
    `;

    const values = [
      restaurant_name,
      cuisine_type,
      license_number,
      location,
      user_id,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },
};

export default Restaurant;