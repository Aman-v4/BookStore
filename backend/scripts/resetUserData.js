import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Configure __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    resetUserData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Reset user cart, wishlist and orders data
async function resetUserData() {
  try {
    // Update all users to reset their cart, wishlist and orders
    const result = await User.updateMany(
      {}, // match all users
      { 
        $set: { 
          'cart.items': [],
          'cart.totalAmount': 0,
          'wishlist': [],
          'orders': []
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users: Reset cart, wishlist, and orders data.`);
    
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error resetting user data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
} 