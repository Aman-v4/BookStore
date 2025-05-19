import express from 'express';
import { createCheckoutSession } from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a Stripe checkout session
router.post('/create-checkout-session', protect, createCheckoutSession);

// Webhook endpoint is now handled directly in server.js

export default router; 