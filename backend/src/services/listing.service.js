import * as model from "../models/listing.model.js";

export const create = async (data) => {
  return await model.create(data);
};

export const getAll = async () => {
  return await model.getAll();
};