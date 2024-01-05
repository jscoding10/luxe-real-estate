import express from 'express';
import { test, updateUser, deleteUser, getUserListings, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

// Create router with express
const router = express.Router();

// Create router for '/test'
router.get('/test', test);

// Create update API route - use token to verify user
router.post('/update/:id', verifyToken, updateUser)

// Delete user route
router.delete('/delete/:id', verifyToken, deleteUser)

// User listings route - use token to verify user
router.get('/listings/:id', verifyToken, getUserListings)

// Get user use verify token
router.get('/:id', verifyToken, getUser)

// Export router
export default router;

