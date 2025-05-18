import express from 'express';
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserWishlist)
  .post(protect, addToWishlist)
  .delete(protect, clearWishlist);

router.route('/:bookId')
  .delete(protect, removeFromWishlist);

export default router; 