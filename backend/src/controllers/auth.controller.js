import * as service from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await service.register(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await service.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};