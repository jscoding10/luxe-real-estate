import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
// import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

// Controller for sign up - next is for middleware
export const signup = async (req, res, next) => {
    // Destructure body
    const { username, email, password } = req.body;
    // Hash password with bcrypt
    const hashedPassword = bcryptjs.hashSync(password, 10);
    // Use model to make new user and save information inside database as document
    const newUser = new User ({ username, email, password: hashedPassword });

    try {
        // Save new user inside database and send response 'User created successfully' if successful
        await newUser.save();
        res.status(201).json('User created sucessfully')

    } catch (error) {
        next(error);
    }
};

// Controller for sign in
export const signin = async (req, res, next) => {
    // Authenticate user with email and password
    const { email, password } = req.body;
    try {
        // Search inside user documents for email
        // If email not returned, return error
        // Otherwise, check password
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        // Compare hashed password with bcrypt method - if incorrect return error message
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Invalid credentials'));
        // JWT to generate hashed value for user
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        // Remove password when send back object to user by descructuring
        const { password: pass, ...rest } = validUser._doc;
        // Save token as cookie for authentication and send back rest (does not include password)
        res.cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } catch (error) {
        next(error);
    }
}

// Controller for Google authentication
export const google = async (req, res, next) => {
    try {
        // Check if user exists and authenticate if so
        const user = await User.findOne({ email: req.body.email })
        // If user exists, generate token and save inside cookie
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            // Descructure and send back everything except password
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        // New user for Google authentication
        } else {
            // Generate random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            // Hash password with 10 rounds of salt
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            // Convert name to username with random letter and numbers at end; pass email, password, and photo URL from Google profile
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save();
            // Generate token for new user
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            // Access token cookie
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}

// Controller for sign out
export const signOut = async (req, res, next) => {
    // Clear cookie for authentication
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    } catch (error) {
        next(error);
    }
}

