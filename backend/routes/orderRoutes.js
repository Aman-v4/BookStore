import express from 'express';
import { 
  getUserOrders, 
  getOrderById,
  createOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders for the logged-in user
router.get('/', protect, getUserOrders);

// Get a specific order by ID
router.get('/:id', protect, getOrderById);

// Create a new order
router.post('/', protect, createOrder);

export default router; 