import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Create listing controller
export const createListing = async (req, res, next) => {
  // Create listing in database
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Delete listing controller
export const deleteListing = async (req, res, next) => {
  // Check if listing exists
  const listing = await Listing.findById(req.params.id);
  // If listing does not exist return error
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  // If listing exists check if user is owner of listing
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }
  // Use id of listing to delete listing
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

// Update listing controller
export const updateListing = async (req, res, next) => {
  // Check is listing exists or not
  const listing = await Listing.findById(req.params.id);
  // No listing return error
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  // Check if listing belongs to user
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }
  // Update listing
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      // Pass id and whatever was updated; return new listing
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  // Handle error with middleware
  } catch (error) {
    next(error);
  }
};

// Get listing controller
export const getListing = async (req, res, next) => {
  try {
    // Find listing by id and return listing if found
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
    }
  };

  // Get listings controller
  export const getListings = async (req, res, next) => {
    try {
      // Limit the listings shown initially by query - if there is a limit, use it - else use 9
      const limit = parseInt(req.query.limit) || 9;
      // Start index 
      const startIndex = parseInt(req.query.startIndex) || 0;
      // Offer - if undefined or false, search inside database for both true and false
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
      // Furnished - if undefined or false, search inside database for both true and false
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
      // Parking - if undefined or false, search inside database for both true and false
      let parking = req.query.parking;

      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
      // Type - if undefined or false, search inside database for both sale and rent
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
      // Search term - by query or empty string
      const searchTerm = req.query.searchTerm || '';
      // Sort - by query or by created at
      const sort = req.query.sort || 'createdAt';
      // Order - by query or by descending
      const order = req.query.order || 'desc';
      // Search for the search term in database by name, offer, furnished, parking, or type
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      }) 
        .sort({ [sort]: order }) // Sort listings by query or default
        .limit(limit) // Limit
        .skip(startIndex); // Skip start index
      // Return listings as json
      return res.status(200).json(listings);
    // Middleware to handle error
    } catch (error) {
      next(error);
    }
  };