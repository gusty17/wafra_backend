import db from "../config/db.js";

const User = {
  async create({ name, email, phone, password, role, verification_status }) {
    const query = `
      INSERT INTO users (
        name,
        email,
        phone,
        password,
        role,
        verification_status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, name, email, phone, role, verification_status, created_at;
    `;

    const values = [
      name,
      email,
      phone,
      password,
      role,
      verification_status,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1;
    `;

    const result = await db.query(query, [email]);
    return result.rows[0];
  },

  async findById(user_id) {
    const query = `
      SELECT 
        user_id,
        name,
        email,
        phone,
        role,
        verification_status,
        created_at
      FROM users
      WHERE user_id = $1;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows[0];
  },

  async updateProfile(user_id, { name, phone }) {
    const query = `
      UPDATE users
      SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
      RETURNING user_id, name, email, phone, role, verification_status, updated_at;
    `;

    const values = [name, phone, user_id];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateVerificationStatus(user_id, verification_status) {
    const query = `
      UPDATE users
      SET
        verification_status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, name, email, role, verification_status;
    `;

    const result = await db.query(query, [verification_status, user_id]);
    return result.rows[0];
  },
};

export default User;