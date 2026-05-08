const db = require("../config/db");

const Notification = {
  async create({ user_id, title, message, type }) {
    const query = `
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [user_id, title, message, type];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByUserId(user_id) {
    const query = `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows;
  },

  async findUnreadByUserId(user_id) {
    const query = `
      SELECT *
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
      ORDER BY created_at DESC;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows;
  },

  async markAsRead(notification_id, user_id) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE notification_id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await db.query(query, [notification_id, user_id]);
    return result.rows[0];
  },

  async markAllAsRead(user_id) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows;
  },

  async deleteById(notification_id, user_id) {
    const query = `
      DELETE FROM notifications
      WHERE notification_id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await db.query(query, [notification_id, user_id]);
    return result.rows[0];
  },
};

module.exports = Notification;