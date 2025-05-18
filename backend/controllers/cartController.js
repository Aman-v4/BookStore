import User from '../models/User.js';
import Book from '../models/Book.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.items.book');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    
    // Validate book exists
    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if item already in cart
    const existingItemIndex = user.cart.items.findIndex(
      item => item.book.toString() === book._id.toString()
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.items.push({
        book: book._id,
        quantity,
        price: book.discounted_price
      });
    }
    
    // Save will trigger the pre-save hook to calculate total
    await user.save();
    
    // Return populated cart
    const updatedUser = await User.findById(user._id)
      .populate('cart.items.book');
    
    res.status(201).json(updatedUser.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the item in the cart
    const cartItem = user.cart.items.id(itemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    await user.save();
    
    // Return populated cart
    const updatedUser = await User.findById(user._id)
      .populate('cart.items.book');
    
    res.json(updatedUser.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out the item
    user.cart.items = user.cart.items.filter(item => item._id.toString() !== itemId);
    await user.save();
    
    // Return populated cart
    const updatedUser = await User.findById(user._id)
      .populate('cart.items.book');
    
    res.json(updatedUser.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.cart.items = [];
    user.cart.totalAmount = 0;
    await user.save();
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 