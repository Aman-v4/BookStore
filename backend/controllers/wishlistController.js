import User from '../models/User.js';
import Book from '../models/Book.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Format the response to match the expected structure in frontend
    const formattedWishlist = {
      _id: user._id,
      books: user.wishlist || []
    };
    
    res.json(formattedWishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add book to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Validate book exists
    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    // Check if book already in wishlist
    if (!user.wishlist.includes(book._id)) {
      user.wishlist.push(book._id);
      await user.save();
    }
    
    // Return populated wishlist
    const updatedUser = await User.findById(user._id)
      .populate('wishlist');
    
    // Format the response to match the expected structure in frontend
    const formattedWishlist = {
      _id: updatedUser._id,
      books: updatedUser.wishlist || []
    };
    
    res.status(201).json(formattedWishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove the book from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    await user.save();
    
    // Return populated wishlist
    const updatedUser = await User.findById(user._id)
      .populate('wishlist');
    
    // Format the response to match the expected structure in frontend
    const formattedWishlist = {
      _id: updatedUser._id,
      books: updatedUser.wishlist || []
    };
    
    res.json(formattedWishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wishlist = [];
    await user.save();
    
    res.json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 