import db from "../config/db.js";

const FoodBank = {
  async create({ user_id, organization_name, registration_number, phone, location }) {
    const query = `
      INSERT INTO food_banks (
        user_id,
        organization_name,
        registration_number,
        phone,
        location
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      user_id,
      organization_name,
      registration_number,
      phone,
      location,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByUserId(user_id) {
    const query = `
      SELECT *
      FROM food_banks
      WHERE user_id = $1;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows[0];
  },

  async findById(food_bank_id) {
    const query = `
      SELECT *
      FROM food_banks
      WHERE food_bank_id = $1;
    `;

    const result = await db.query(query, [food_bank_id]);
    return result.rows[0];
  },

  async updateByUserId(user_id, { organization_name, registration_number, phone, location }) {
    const query = `
      UPDATE food_banks
      SET
        organization_name = COALESCE($1, organization_name),
        registration_number = COALESCE($2, registration_number),
        phone = COALESCE($3, phone),
        location = COALESCE($4, location),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING *;
    `;

    const values = [
      organization_name,
      registration_number,
      phone,
      location,
      user_id,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },
};

export default FoodBank;