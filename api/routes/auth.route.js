import express from 'express';
import { google, signin, signup, signOut } from '../controllers/auth.controller.js';

// Save express router as variable
const router = express.Router();

// Sign up route
router.post('/signup', signup);

// Sign in route
router.post('/signin', signin);

// Google sign in route
router.post('/google', google);

// Sign out
router.get('/signout', signOut)

export default router; 