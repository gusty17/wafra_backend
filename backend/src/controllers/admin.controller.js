import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import db from "../config/db.js";

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.updateVerificationStatus(id, "approved");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.updateVerificationStatus(id, "rejected");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User rejected successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE role != 'admin') AS total_users,
        COUNT(*) FILTER (WHERE role = 'restaurant') AS restaurants,
        COUNT(*) FILTER (WHERE role = 'foodbank') AS food_banks,
        COUNT(*) FILTER (WHERE role = 'individual') AS individuals,
        COUNT(*) FILTER (WHERE verification_status = 'pending') AS pending_verification
      FROM users;
    `);
    const listingResult = await db.query(
      `SELECT COUNT(*) AS total_listings FROM food_listings WHERE status = 'available';`
    );
    const reservationResult = await db.query(
      `SELECT COUNT(*) AS total_reservations FROM reservations;`
    );
    res.status(200).json({
      stats: {
        ...result.rows[0],
        total_listings: listingResult.rows[0].total_listings,
        total_reservations: reservationResult.rows[0].total_reservations,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT fl.*, r.restaurant_name
      FROM food_listings fl
      JOIN restaurants r ON fl.restaurant_id = r.restaurant_id
      ORDER BY fl.created_at DESC;
    `);
    res.status(200).json({ listings: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.deleteById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.status(200).json({ message: "Listing deleted", listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
