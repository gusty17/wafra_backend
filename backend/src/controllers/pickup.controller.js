import * as service from "../services/pickup.service.js";

export const generatePickup = async (req, res) => {
  try {
    const result = await service.generatePickup(req.body.reservation_id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const confirmPickup = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await service.confirmPickup(code);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};