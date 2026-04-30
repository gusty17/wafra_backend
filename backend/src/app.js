import express from "express";

import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import userRoutes from "./routes/user.routes.js";
import pickupRoutes from "./routes/pickup.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/reservations", reservationRoutes);
app.use("/users", userRoutes);
app.use("/pickup", pickupRoutes);

export default app;