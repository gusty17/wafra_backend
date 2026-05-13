import db from "../config/db.js";

const User = {
  async createBasic({ username, email, password }) {
    const query = `
      INSERT INTO users (
        username,
        email,
        password,
        verification_status
      )
      VALUES ($1, $2, $3, 'incomplete')
      RETURNING user_id, username, email, role, verification_status, created_at;
    `;

    const values = [username, email, password];

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

  async findByUsername(username) {
    const query = `
      SELECT *
      FROM users
      WHERE username = $1;
    `;

    const result = await db.query(query, [username]);
    return result.rows[0];
  },

  async findById(user_id) {
    const query = `
      SELECT 
        user_id,
        username,
        email,
        role,
        verification_status,
        created_at
      FROM users
      WHERE user_id = $1;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows[0];
  },

  async chooseRole(user_id, role) {
  const query = `
    UPDATE users
    SET
      role = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
    RETURNING user_id, username, email, role, verification_status, updated_at;
  `;

  const result = await db.query(query, [role, user_id]);
  return result.rows[0];
  },

  async completeRole(user_id, { role, verification_status }) {
    const query = `
      UPDATE users
      SET
        role = $1,
        verification_status = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
      RETURNING user_id, username, email, role, verification_status, updated_at;
    `;

    const values = [role, verification_status, user_id];

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
      RETURNING user_id, username, email, role, verification_status;
    `;

    const result = await db.query(query, [verification_status, user_id]);
    return result.rows[0];
  },
};

export default User;