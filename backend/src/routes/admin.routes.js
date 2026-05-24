import express from "express";
import {
  approveUser,
  rejectUser,
  getUsers,
  getStats,
  getAllListings,
  deleteListing,
} from "../controllers/admin.controller.js";
import { authMiddleware, allowRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

const adminOnly = [authMiddleware, allowRoles("admin")];

router.get("/users", ...adminOnly, getUsers);
router.get("/stats", ...adminOnly, getStats);
router.get("/listings", ...adminOnly, getAllListings);
router.patch("/users/:id/approve", ...adminOnly, approveUser);
router.patch("/users/:id/reject", ...adminOnly, rejectUser);
router.delete("/listings/:id", ...adminOnly, deleteListing);

export default router;
