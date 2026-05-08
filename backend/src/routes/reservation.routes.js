import express from "express";
import {
  createReservation,
  getMyReservations,
  getRestaurantReservations,
  acceptReservation,
  declineReservation,
  cancelReservation,
} from "../controllers/reservation.controller.js";

import {
  authMiddleware,
  allowRoles,
  requireApprovedUser,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  allowRoles("individual", "foodbank"),
  requireApprovedUser,
  createReservation
);

router.get("/my", authMiddleware, getMyReservations);

router.get(
  "/restaurant",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  getRestaurantReservations
);

router.patch(
  "/:id/accept",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  acceptReservation
);

router.patch(
  "/:id/decline",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  declineReservation
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  allowRoles("individual", "foodbank"),
  requireApprovedUser,
  cancelReservation
);

export default router;