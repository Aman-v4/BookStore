import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
<<<<<<< HEAD
=======
import stripeRoutes from './routes/stripeRoutes.js';
import { handleStripeWebhook } from './controllers/stripeController.js';
>>>>>>> 2c68bbb (Clean repository state with Stripe integration and logout modal)

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

<<<<<<< HEAD
// Middleware
app.use(express.json());
app.use(cors());

=======
// CORS middleware
app.use(cors());

// Special route for Stripe webhooks - this needs raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Standard middleware for JSON parsing for all other routes
app.use(express.json());

>>>>>>> 2c68bbb (Clean repository state with Stripe integration and logout modal)
// API Routes
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
<<<<<<< HEAD
=======
app.use('/api/stripe', stripeRoutes);
>>>>>>> 2c68bbb (Clean repository state with Stripe integration and logout modal)

// Base route
app.get('/', (req, res) => {
  res.send('BookStore API is running');
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add JWT secret to env if not present
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not found in environment, using fallback secret. This is NOT secure for production!');
}

<<<<<<< HEAD
=======
// Check for Stripe keys
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found in environment. Stripe payment processing will not work!');
}

>>>>>>> 2c68bbb (Clean repository state with Stripe integration and logout modal)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
