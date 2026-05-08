import db from "../config/db.js";
const Reservation = {
  async create({ listing_id, user_id, requested_quantity }) {
    const query = `
      INSERT INTO reservations (
        listing_id,
        user_id,
        requested_quantity
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [listing_id, user_id, requested_quantity];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findById(reservation_id) {
  const query = `
    SELECT 
      res.*,
      fl.food_name,
      fl.category,
      fl.quantity,
      fl.pickup_time,
      fl.location,
      fl.restaurant_id,
      r.restaurant_name,
      u.name AS receiver_name,
      u.email AS receiver_email,
      u.phone AS receiver_phone,
      u.role AS receiver_role
    FROM reservations res
    JOIN food_listings fl ON res.listing_id = fl.listing_id
    JOIN restaurants r ON fl.restaurant_id = r.restaurant_id
    JOIN users u ON res.user_id = u.user_id
    WHERE res.reservation_id = $1;
  `;

  const result = await db.query(query, [reservation_id]);
  return result.rows[0];
  },
  async findByUserId(user_id) {
    const query = `
      SELECT 
        res.*,
        fl.food_name,
        fl.category,
        fl.pickup_time,
        fl.location,
        r.restaurant_name
      FROM reservations res
      JOIN food_listings fl ON res.listing_id = fl.listing_id
      JOIN restaurants r ON fl.restaurant_id = r.restaurant_id
      WHERE res.user_id = $1
      ORDER BY res.created_at DESC;
    `;

    const result = await db.query(query, [user_id]);
    return result.rows;
  },

  async findByRestaurantId(restaurant_id) {
    const query = `
      SELECT 
        res.*,
        fl.food_name,
        fl.category,
        fl.pickup_time,
        fl.location,
        u.name AS receiver_name,
        u.email AS receiver_email,
        u.phone AS receiver_phone,
        u.role AS receiver_role
      FROM reservations res
      JOIN food_listings fl ON res.listing_id = fl.listing_id
      JOIN users u ON res.user_id = u.user_id
      WHERE fl.restaurant_id = $1
      ORDER BY res.created_at DESC;
    `;

    const result = await db.query(query, [restaurant_id]);
    return result.rows;
  },

  async updateStatus(reservation_id, status) {
    const query = `
      UPDATE reservations
      SET 
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = $2
      RETURNING *;
    `;

    const result = await db.query(query, [status, reservation_id]);
    return result.rows[0];
  },

  async accept(reservation_id) {
    const query = `
      UPDATE reservations
      SET 
        status = 'accepted',
        updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [reservation_id]);
    return result.rows[0];
  },

  async decline(reservation_id) {
    const query = `
      UPDATE reservations
      SET 
        status = 'declined',
        updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [reservation_id]);
    return result.rows[0];
  },

  async cancel(reservation_id) {
    const query = `
      UPDATE reservations
      SET 
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [reservation_id]);
    return result.rows[0];
  },

  async complete(reservation_id) {
    const query = `
      UPDATE reservations
      SET 
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = $1
      RETURNING *;
    `;

    const result = await db.query(query, [reservation_id]);
    return result.rows[0];
  },
};

export default Reservation;