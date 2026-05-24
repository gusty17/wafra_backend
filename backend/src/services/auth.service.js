import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import FoodBank from "../models/foodBank.model.js";
import Individual from "../models/individual.model.js";

const authService = {
  async register(data) {
    const { username, email, password } = data;

    const existingEmail = await User.findByEmail(email);

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const existingUsername = await User.findByUsername(username);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createBasic({
      username,
      email,
      password: hashedPassword,
    });

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
      user,
    };
  },

  async chooseRole(user_id, { role }) {
    const user = await User.findById(user_id);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role) {
      throw new Error("Role already selected");
    }

    if (!["individual", "restaurant", "foodbank"].includes(role)) {
      throw new Error("Invalid role");
    }

    const updatedUser = await User.chooseRole(user_id, role);

    const newToken = jwt.sign(
      {
        user_id: updatedUser.user_id,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      token: newToken,
      user: updatedUser,
    };
  },

  async completeProfile(user_id, data) {
    const {
      // Individual fields
      first_name,
      last_name,
      phone,
      birthdate,

      // Restaurant fields
      restaurant_name,
      cuisine_type,
      full_address,
      business_license_number,

      // Food bank fields
      organization_name,
      registration_number,
      location,
    } = data;

    const user = await User.findById(user_id);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.role) {
      throw new Error("Please choose a role first");
    }

    if (user.verification_status !== "incomplete") {
      throw new Error("Profile already completed");
    }

    const verification_status =
      user.role === "individual" ? "approved" : "pending";

    if (user.role === "individual") {
      await Individual.create({
        user_id,
        first_name,
        last_name,
        phone,
        birthdate,
      });
    } else if (user.role === "restaurant") {
      await Restaurant.create({
        user_id,
        restaurant_name,
        cuisine_type,
        full_address,
        phone,
        business_license_number,
      });
    } else if (user.role === "foodbank") {
      await FoodBank.create({
        user_id,
        organization_name,
        registration_number,
        phone,
        location,
      });
    } else {
      throw new Error("Invalid role");
    }

    const updatedUser = await User.updateVerificationStatus(
      user_id,
      verification_status
    );

    const newToken = jwt.sign(
      {
        user_id: updatedUser.user_id,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      token: newToken,
      user: updatedUser,
    };
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
        username: user.username,
        email: user.email,
        role: user.role,
        verification_status: user.verification_status,
      },
    };
  },
};

export default authService;