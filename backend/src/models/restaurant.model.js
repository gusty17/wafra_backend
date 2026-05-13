import db from "../config/db.js";

const Restaurant = {
  async create({
    user_id,
    restaurant_name,
    cuisine_type,
    full_address,
    phone,
    business_license_number,
  }) {
    const query = `
      INSERT INTO restaurants (
        user_id,
        restaurant_name,
        cuisine_type,
        full_address,
        phone,
        business_license_number
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      user_id,
      restaurant_name,
      cuisine_type,
      full_address,
      phone,
      business_license_number,
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

  async updateByUserId(
    user_id,
    {
      restaurant_name,
      cuisine_type,
      full_address,
      phone,
      business_license_number,
    }
  ) {
    const query = `
      UPDATE restaurants
      SET
        restaurant_name = COALESCE($1, restaurant_name),
        cuisine_type = COALESCE($2, cuisine_type),
        full_address = COALESCE($3, full_address),
        phone = COALESCE($4, phone),
        business_license_number = COALESCE($5, business_license_number),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6
      RETURNING *;
    `;

    const values = [
      restaurant_name,
      cuisine_type,
      full_address,
      phone,
      business_license_number,
      user_id,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },
};

export default Restaurant;