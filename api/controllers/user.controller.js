import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";
import Listing from '../models/listing.model.js';

// Test API
export const test = (req, res) => {
    res.json({
        message: 'Test API is Working!',
    });
};

// Update user controller
export const updateUser = async (req, res, next) => {
    // If user id does not match return error
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if(req.body.password) {
            // Hash password if update password
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        // Update user information 
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
            // Return and save updated user
        }, {new:true}
        );
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

// Delete user
export const deleteUser = async (req, res, next) => {
    // Check token - if not right account show 401
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));
    try {
        // Delete user with parameters and find by id and delete method
        await User.findByIdAndDelete(req.params.id);
        // Delete cookie
        res.clearCookie('access_token');
        // Delete user and return response if successful
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
};

// User Listings
export const getUserListings = async (req, res, next) => {
    // If user id request from cookie matches
    if (req.user.id === req.params.id) {
        try {
            // Find user ref with matching id
            const listings = await Listing.find({ userRef: req.params.id });
            // Return listings if successful
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings'));
    }
};

// Get user
export const getUser = async (req, res, next) => {
    try {
      // Search for user with endpoint
      const user = await User.findById(req.params.id);
  
      if (!user) return next(errorHandler(404, 'User not found!'));
      
      // Do not return password to user by destructuring
      const { password: pass, ...rest } = user._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };