import User from '../models/User.js';
import Book from '../models/Book.js';

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'orders.items.book',
        model: 'Book'
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return orders in reverse chronological order (newest first)
    const orders = [...user.orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'orders.items.book',
        model: 'Book'
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const order = user.orders.id(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify all books exist
    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Book with id ${item.book} not found` });
      }
    }
    
    // Generate order number
    const orderNumber = user.generateOrderNumber();
    
    // Create new order
    const newOrder = {
      items,
      totalAmount,
      status: 'processing',
      shippingAddress,
      paymentMethod,
      orderNumber,
      createdAt: new Date()
    };
    
    // Add order to user
    user.orders.push(newOrder);
    
    // Clear cart
    user.cart.items = [];
    user.cart.totalAmount = 0;
    
    await user.save();
    
    // Get the newly created order
    const createdOrder = user.orders[user.orders.length - 1];
    
    res.status(201).json({
      _id: createdOrder._id,
      orderNumber: createdOrder.orderNumber,
      amount: totalAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 