import * as model from "../models/reservation.model.js";

export const create = async (data) => {
  return await model.create(data);
};