import * as service from "../services/listing.service.js";

export const create = async (req, res) => {
  try {
    const listing = await service.create(req.body);
    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  const listings = await service.getAll();
  res.json(listings);
};