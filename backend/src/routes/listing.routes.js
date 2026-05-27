import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";

import {
  authMiddleware,
  allowRoles,
  requireApprovedUser,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllListings);
router.get(
  "/my",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  getMyListings
);
router.get("/:id", authMiddleware, getListingById);

router.post(
  "/",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  createListing
);

router.put(
  "/:id",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  updateListing
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("restaurant"),
  requireApprovedUser,
  deleteListing
);

export default router;