import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import FoodBank from "../models/foodBank.model.js";
import Individual from "../models/individual.model.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    let profile = null;

    if (user.role === "restaurant") {
      profile = await Restaurant.findByUserId(user.user_id);
    } else if (user.role === "foodbank") {
      profile = await FoodBank.findByUserId(user.user_id);
    } else if (user.role === "individual") {
      profile = await Individual.findByUserId(user.user_id);
    }

    res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};