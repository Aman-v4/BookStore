import dotenv from 'dotenv';
import Stripe from 'stripe';
import User from '../models/User.js';
import Book from '../models/Book.js';

dotenv.config();

// Initialize Stripe with the API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe checkout session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }
    
    // Get user information
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if cart total meets Stripe's minimum amount requirement (50 INR ~ 0.60 USD)
    if (user.cart.totalAmount < 50) {
      return res.status(400).json({ 
        message: 'Cart total must be at least ₹50 to process payment with Stripe',
        minAmount: 50
      });
    }
    
    // Verify and format line items for Stripe
    const lineItems = [];
    let orderItems = [];
    
    for (const item of cartItems) {
      const book = await Book.findById(item.book._id);
      if (!book) {
        return res.status(404).json({ message: `Book with id ${item.book._id} not found` });
      }
      
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: book.name,
            description: book.author,
            images: [book.image || 'https://placehold.co/100x150'],
          },
          unit_amount: Math.round(item.price * 100), // Stripe requires amount in smallest currency unit (cents/paise)
        },
        quantity: item.quantity,
      });
      
      // Store items for the order
      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: item.price
      });
    }
    
    // Generate order number
    const orderNumber = user.generateOrderNumber();
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/Cart`,
      customer_email: user.email,
      client_reference_id: req.user._id.toString(),
      metadata: {
        orderItems: JSON.stringify(orderItems),
        orderNumber: orderNumber,
        userId: req.user._id.toString(),
        totalAmount: user.cart.totalAmount
      }
    });
    
    res.json({ id: session.id, url: session.url });
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: 'Payment processing error', error: error.message });
  }
};

// @desc    Handle Stripe webhook events
// @route   POST /api/stripe/webhook
// @access  Public
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    const payload = req.body;
    
    event = stripe.webhooks.constructEvent(
      payload, 
      sig, 
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      await fulfillOrder(session);
      res.json({ received: true });
    } catch (error) {
      console.error('Error fulfilling order:', error);
      res.status(500).json({ error: 'Error fulfilling order' });
    }
  } else {
    res.json({ received: true });
  }
};

// Helper function to fulfill the order after successful payment
const fulfillOrder = async (session) => {
  // Get the user ID and order details from metadata
  const userId = session.metadata.userId;
  const orderItems = JSON.parse(session.metadata.orderItems);
  const orderNumber = session.metadata.orderNumber;
  const totalAmount = parseFloat(session.metadata.totalAmount);
  
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create new order
    const newOrder = {
      items: orderItems,
      totalAmount,
      status: 'processing',
      shippingAddress: user.address, // Use user's address from profile
      paymentMethod: 'stripe',
      orderNumber,
      createdAt: new Date()
    };
    
    // Add order to user
    user.orders.push(newOrder);
    
    // Clear user's cart
    user.cart.items = [];
    user.cart.totalAmount = 0;
    
    await user.save();
    
    console.log(`Order ${orderNumber} fulfilled successfully`);
    
  } catch (error) {
    console.error('Error fulfilling order:', error);
    throw error;
  }
}; 