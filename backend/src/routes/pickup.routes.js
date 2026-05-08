import express from "express";
import {
  generatePickupCode,
  confirmPickup,
} from "../controllers/pickup.controller.js";

import { authMiddleware, allowRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  allowRoles("individual", "foodbank"),
  generatePickupCode
);

router.post(
  "/confirm",
  authMiddleware,
  allowRoles("restaurant"),
  confirmPickup
);

export default router;