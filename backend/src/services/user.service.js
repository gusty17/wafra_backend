import * as userModel from "../models/user.model.js";

export const getProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");

  return user;
};