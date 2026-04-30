import { Router } from "express";
import { generatePickup, confirmPickup } from "../controllers/pickup.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generate", authMiddleware, generatePickup);
router.post("/confirm", authMiddleware, confirmPickup);

export default router;