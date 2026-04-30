import * as service from "../services/reservation.service.js";

export const create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};