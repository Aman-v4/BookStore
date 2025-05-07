import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Records from '../Books/BooksData.json';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import { useCart } from '../Context/CartContext.jsx';
import { useWishlist } from '../Context/WishlistContext.jsx'; // ✅ Import wishlist context

const ProductPage = () => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist(); // ✅ Use wishlist context

  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const foundBook = Records.find(record => record.id === parseInt(id));
    setBook(foundBook);
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const discountRate = Math.round(((book.price - book.discounted_price) / book.price) * 100);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center lg:flex-row py-32 px-8">
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          <img
            src={book.image}
            alt={book.name}
            className="w-80 h-92 object-cover mx-auto"
          />
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold mb-2 py-2 border-b border-gray-300">{book.name}</h2>
          <p className="text-lg text-gray-600 mb-4">{book.author}</p>
          <p className="text-gray-700 mb-4">{book.description}</p>

          <div className="items-center gap-2 mb-4">
            <p className="text-gray-500 line-through text-lg">₹{book.discounted_price}</p>
            <span className="text-green-600 font-bold text-lg">
              ₹{book.price} <span className="text-red-500 text-sm font-medium">({discountRate}% OFF)</span>
            </span>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => addToCart(book)}
              className="px-6 py-2 bg-indigo-600 duration-300 transition hover:scale-95 active:scale-90 text-white rounded-md"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(book)} // ✅ Wishlist handler
              className="px-6 py-2 bg-gray-200 text-indigo-600 duration-300 transition hover:scale-95 active:scale-90 rounded-md"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
