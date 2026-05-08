import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import FoodBank from "../models/foodBank.model.js";
import Individual from "../models/individual.model.js";

const authService = {
  async register(data) {
    const {
      name,
      email,
      phone,
      password,
      role,

      // Restaurant fields
      restaurant_name,
      cuisine_type,
      license_number,

      // Food bank fields
      organization_name,
      registration_number,

      // Common field
      location,
    } = data;

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let verification_status = "pending";

    if (role === "individual") {
      verification_status = "approved";
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      verification_status,
    });

    if (role === "restaurant") {
      await Restaurant.create({
        user_id: user.user_id,
        restaurant_name,
        cuisine_type,
        license_number,
        location,
      });
    } else if (role === "foodbank") {
      await FoodBank.create({
        user_id: user.user_id,
        organization_name,
        registration_number,
        location,
      });
    } else if (role === "individual") {
      await Individual.create({
        user_id: user.user_id,
      });
    } else {
      throw new Error("Invalid role");
    }

    return user;
  },

  async login({ email, password }) {
    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verification_status: user.verification_status,
      },
    };
  },
};

export default authService;