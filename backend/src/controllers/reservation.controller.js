import Reservation from "../models/reservation.model.js";
import Listing from "../models/listing.model.js";
import Restaurant from "../models/restaurant.model.js";

export const createReservation = async (req, res) => {
  try {
    const { listing_id, requested_quantity } = req.body;

    const listing = await Listing.findById(listing_id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    if (listing.status !== "available") {
      return res.status(400).json({
        error: "This listing is not available",
      });
    }

    if (Number(requested_quantity) > Number(listing.quantity)) {
      return res.status(400).json({
        error: "Requested quantity is greater than available quantity",
      });
    }

    const reservation = await Reservation.create({
      listing_id,
      user_id: req.user.user_id,
      requested_quantity,
    });

    await Listing.reduceQuantity(listing_id, requested_quantity);

    res.status(201).json({
      message: "Reservation request created successfully",
      reservation,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findByUserId(req.user.user_id);

    res.status(200).json({
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getRestaurantReservations = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    const reservations = await Reservation.findByRestaurantId(
      restaurant.restaurant_id
    );

    res.status(200).json({
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const acceptReservation = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);
    const reservation = await Reservation.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }

    if (Number(reservation.restaurant_id) !== Number(restaurant.restaurant_id)) {
      return res.status(403).json({
        error: "You can only accept reservations for your own listings",
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        error: "Only pending reservations can be accepted",
      });
    }

    const updatedReservation = await Reservation.accept(req.params.id);

    res.status(200).json({
      message: "Reservation accepted successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const declineReservation = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);
    const reservation = await Reservation.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }

    if (Number(reservation.restaurant_id) !== Number(restaurant.restaurant_id)) {
      return res.status(403).json({
        error: "You can only decline reservations for your own listings",
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        error: "Only pending reservations can be declined",
      });
    }

    const updatedReservation = await Reservation.decline(req.params.id);

    await Listing.restoreQuantity(reservation.listing_id, reservation.requested_quantity);

    res.status(200).json({
      message: "Reservation declined successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }

    if (Number(reservation.user_id) !== Number(req.user.user_id)) {
      return res.status(403).json({
        error: "You can only cancel your own reservations",
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        error: "Only pending reservations can be cancelled",
      });
    }

    const updatedReservation = await Reservation.cancel(req.params.id);

    await Listing.restoreQuantity(reservation.listing_id, reservation.requested_quantity);

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};