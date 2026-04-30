import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as userModel from "../models/user.model.js";
import * as restaurantModel from "../models/restaurant.model.js";
import * as foodBankModel from "../models/foodBank.model.js";
import * as individualModel from "../models/individual.model.js";

export const register = async (data) => {
  const { email, password, role } = data;

  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    password: hashed,
    role,
  });

  if (role === "restaurant") {
    await restaurantModel.create(user.id, data);
  }

  if (role === "foodbank") {
    await foodBankModel.create(user.id, data);
  }

  if (role === "individual") {
    await individualModel.create(user.id, data);
  }

  return { message: "User created", user };
};

export const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);

  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Wrong password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );
  
  return { token };
};