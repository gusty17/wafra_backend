import Listing from "../models/listing.model.js";
import Restaurant from "../models/restaurant.model.js";

export const createListing = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    const listing = await Listing.create({
      restaurant_id: restaurant.restaurant_id,
      food_name: req.body.food_name,
      category: req.body.category,
      quantity: req.body.quantity,
      pickup_time: req.body.pickup_time,
      location: req.body.location,
      photo_url: req.body.photo_url,
      dietary_tags: req.body.dietary_tags,
    });

    res.status(201).json({
      message: "Food listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.search({
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
    });

    res.status(200).json({
      count: listings.length,
      listings,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    res.status(200).json({
      listing,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    const listings = await Listing.findByRestaurantId(restaurant.restaurant_id);

    res.status(200).json({
      count: listings.length,
      listings,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateListing = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);
    const listing = await Listing.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    if (Number(listing.restaurant_id) !== Number(restaurant.restaurant_id)) {
      return res.status(403).json({
        error: "You can only update your own listings",
      });
    }

    const updatedListing = await Listing.updateById(req.params.id, req.body);

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByUserId(req.user.user_id);
    const listing = await Listing.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant profile not found",
      });
    }

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    if (Number(listing.restaurant_id) !== Number(restaurant.restaurant_id)) {
      return res.status(403).json({
        error: "You can only delete your own listings",
      });
    }

    await Listing.deleteById(req.params.id);

    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};