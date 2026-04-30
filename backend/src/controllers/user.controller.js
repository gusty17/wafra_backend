import * as service from "../services/user.service.js";

export const getProfile = async (req, res) => {
  try {
    const user = await service.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};