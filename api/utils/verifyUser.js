import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

// Verify token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // If token does not exist, return unauthorized
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // If token exists, check if correct or not
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));

        // If no error send user to next place
        // Take user data and send to update user
        req.user = user;
        next();
    });
    
}