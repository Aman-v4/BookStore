import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Book from '../models/Book.js';
import dotenv from 'dotenv';

// Configure __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

// Read the books data
const booksDataPath = path.join(__dirname, '..', '..', 'src', 'Books', 'BooksData.json');
const booksData = JSON.parse(fs.readFileSync(booksDataPath, 'utf-8'));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    importBooks();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import books into the database
async function importBooks() {
  try {
    // Clear existing books collection
    await Book.deleteMany({});
    console.log('Existing books collection cleared.');

    // Insert books
    const bookPromises = booksData.map(book => {
      const newBook = new Book({
        id: book.id,
        name: book.name,
        author: book.author,
        image: book.image,
        price: book.price,
        discounted_price: book.discounted_price,
        discount_rate: book.discount_rate,
        genre: book.genre,
        description: book.description
      });
      return newBook.save();
    });

    await Promise.all(bookPromises);
    console.log(`${booksData.length} books imported successfully!`);
    
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error importing books:', error);
    mongoose.connection.close();
    process.exit(1);
  }
} 