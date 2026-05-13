import db from "../config/db.js";

const Individual = {
  async create({ user_id, first_name, last_name, phone, birthdate }) {
    const query = `
      INSERT INTO individuals (
        user_id,
        first_name,
        last_name,
        phone,
        birthdate
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      user_id,
      first_name,
      last_name,
      phone,
      birthdate,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByUserId(user_id) {
    const query = `
      SELECT *
      FROM individuals
      WHERE user_id = $1;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows[0];
  },

  async findById(individual_id) {
    const query = `
      SELECT *
      FROM individuals
      WHERE individual_id = $1;
    `;

    const result = await db.query(query, [individual_id]);
    return result.rows[0];
  },

  async updateByUserId(user_id, { first_name, last_name, phone, birthdate }) {
    const query = `
      UPDATE individuals
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        birthdate = COALESCE($4, birthdate),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING *;
    `;

    const values = [
      first_name,
      last_name,
      phone,
      birthdate,
      user_id,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },
};

export default Individual;