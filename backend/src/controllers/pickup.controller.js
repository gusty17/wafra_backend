import Pickup from "../models/pickup.model.js";
import Reservation from "../models/reservation.model.js";
import Restaurant from "../models/restaurant.model.js";

const generateCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generatePickupCode = async (req, res) => {
  try {
    const { reservation_id } = req.body;

    const reservation = await Reservation.findById(reservation_id);

    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found",
      });
    }

    if (Number(reservation.user_id) !== Number(req.user.user_id)) {
      return res.status(403).json({
        error: "You can only generate pickup code for your own reservation",
      });
    }

    if (reservation.status !== "accepted") {
      return res.status(400).json({
        error: "Pickup code can only be generated for accepted reservations",
      });
    }

    const existingPickup = await Pickup.findByReservationId(reservation_id);

    if (existingPickup) {
      return res.status(200).json({
        message: "Pickup code already generated",
        pickup: existingPickup,
      });
    }

    const code = generateCode();

    const qr_code = JSON.stringify({
      reservation_id,
      code,
    });

    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const pickup = await Pickup.create({
      reservation_id,
      code,
      qr_code,
      expires_at,
    });

    res.status(201).json({
      message: "Pickup code generated successfully",
      pickup,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const confirmPickup = async (req, res) => {
  try {
    const { code } = req.body;

    const restaurant = await Restaurant.findByUserId(req.user.user_id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    const pickup = await Pickup.findByCode(code);

    if (!pickup) {
      return res.status(404).json({
        error: "Invalid pickup code",
      });
    }

    if (pickup.status !== "active") {
      return res.status(400).json({
        error: "Pickup code is not active",
      });
    }

    if (pickup.expires_at && new Date(pickup.expires_at) < new Date()) {
      await Pickup.expirePickup(pickup.pickup_id);

      return res.status(400).json({
        error: "Pickup code has expired",
      });
    }

    if (pickup.reservation_status !== "accepted") {
      return res.status(400).json({
        error: "Only accepted reservations can be confirmed",
      });
    }

    if (Number(pickup.restaurant_id) !== Number(restaurant.restaurant_id)) {
      return res.status(403).json({
        error: "You can only confirm pickup for your own restaurant listings",
      });
    }

    const usedPickup = await Pickup.markAsUsed(pickup.pickup_id);

    const completedReservation = await Reservation.complete(
      pickup.reservation_id
    );

    res.status(200).json({
      message: "Pickup confirmed successfully",
      pickup: usedPickup,
      reservation: completedReservation,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};