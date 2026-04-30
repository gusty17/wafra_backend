import * as pickupModel from "../models/pickup.model.js";
import * as reservationModel from "../models/reservation.model.js";
import { generateCode } from "../utils/generateCode.js";

export const generatePickup = async (reservationId) => {
  const reservation = await reservationModel.findById(reservationId);

  if (!reservation) throw new Error("Reservation not found");

  const code = generateCode();

  const pickup = await pickupModel.create(reservationId, code);

  return { message: "Pickup code generated", code, pickup };
};

export const confirmPickup = async (code) => {
  const pickup = await pickupModel.findByCode(code);

  if (!pickup) throw new Error("Invalid code");

  await reservationModel.updateStatus(pickup.reservation_id, "completed");

  return { message: "Pickup confirmed" };
};