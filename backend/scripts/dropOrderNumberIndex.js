import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
    dropIndex();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Drop the unique index on orders.orderNumber
async function dropIndex() {
  try {
    // Get the users collection
    const usersCollection = mongoose.connection.collection('users');
    
    // Check if the index exists
    const indexInfo = await usersCollection.indexInformation();
    console.log('Current indexes:', indexInfo);
    
    // Look for the orders.orderNumber index and drop it
    if (indexInfo['orders.orderNumber_1']) {
      await usersCollection.dropIndex('orders.orderNumber_1');
      console.log('Successfully dropped the orders.orderNumber_1 index');
    } else {
      console.log('The orders.orderNumber_1 index does not exist');
    }
    
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error dropping index:', error);
    mongoose.connection.close();
    process.exit(1);
  }
} 