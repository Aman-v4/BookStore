import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ book }) => {
  const { userData, addToCart, toggleWishlist } = useUserData();
  const isLoggedIn = localStorage.getItem('userEmail');
  
  const isInWishlist = userData?.wishlist?.some(item => item.bookId === book.id.toString());

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation from Link
    if (!isLoggedIn) return; // LoginTooltip will handle the message

    try {
      await addToCart({
        bookId: book.id.toString(),
        name: book.name,
        price: book.discounted_price || book.price,
        quantity: 1,
        image: book.image
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation from Link
    if (!isLoggedIn) return; // LoginTooltip will handle the message

    try {
      await toggleWishlist({
        bookId: book.id.toString(),
        name: book.name,
        price: book.discounted_price || book.price,
        image: book.image
      });
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  return (
    <Link to={`/product/${book.id}`} className="group relative border border-gray-200 block overflow-hidden">
      <img
        src={book.image}
        alt={book.name}
        className="h-64 w-full object-contain transition duration-500 group-hover:scale-105 sm:h-72"
      />

      <div className="relative bg-white p-6">
        <div className="flex justify-between">
          {book.discount_rate ? (
            <span className="bg-yellow-200 px-3 py-1.5 text-xs font-medium whitespace-nowrap">
              {book.discount_rate} OFF
            </span>
          ) : (
            <span className="bg-indigo-100 px-3 py-1.5 text-xs font-medium whitespace-nowrap">
              New Arrival
            </span>
          )}
          
          <LoginTooltip>
            <button
              onClick={handleToggleWishlist}
              className={`transition duration-300 rounded-full p-1.5 ${
                isInWishlist 
                  ? 'bg-pink-400 text-white' 
                  : 'bg-gray-200 hover:bg-pink-400 hover:text-white'
              }`}
            >
              <span className="sr-only">Wishlist</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isInWishlist ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </LoginTooltip>
        </div>

        <h3 className="mt-4 text-lg font-medium text-gray-900">{book.name}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          {book.discounted_price && (
            <span className="text-gray-500 line-through text-sm">₹{book.price}</span>
          )}
          <span className="text-green-600 font-bold">
            ₹{book.discounted_price || book.price}
          </span>
        </div>

        <LoginTooltip>
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
        </LoginTooltip>
      </div>
    </Link>
  );
};

export default ProductCard; 