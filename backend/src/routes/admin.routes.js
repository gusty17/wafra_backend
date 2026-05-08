import express from "express";
import {
  approveUser,
  rejectUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.patch("/users/:id/approve", approveUser);
router.patch("/users/:id/reject", rejectUser);

export default router;