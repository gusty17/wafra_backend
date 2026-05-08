import db from "../config/db.js";

const Individual = {
  async create({ user_id }) {
    const query = `
      INSERT INTO individuals (user_id)
      VALUES ($1)
      RETURNING *;
    `;

    const result = await db.query(query, [user_id]);
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
};

export default Individual;