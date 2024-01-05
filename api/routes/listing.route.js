import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

// Save express router as variable
const router = express.Router();

// Verify token and create listing
router.post('/create', verifyToken, createListing);

// Delete listing functionality
router.delete('/delete/:id', verifyToken, deleteListing);

// Update listing
router.post('/update/:id', verifyToken, updateListing);

// Get listing information
router.get('/get/:id', getListing);

// Get request to search listings - no authentication required
router.get('/get', getListings);

export default router;