// Wishlist.jsx
import React from 'react';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (book) => {
    addToCart(book);
    removeFromWishlist(book.id); 
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 md:px-16 lg:px-24 py-12 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Your wishlist is empty.</p>
        ) : (
          <div className="grid gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md p-6 gap-6 transition hover:shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-40 h-56 object-cover rounded-lg self-center"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                    <p className="text-gray-600 mb-4">by {item.author}</p>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-500 line-through text-lg">₹{item.discounted_price}</span>
                    <span className="text-green-600 font-bold text-xl">₹{item.price}</span>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => handleAddToCart(item)} // Add to cart and remove from wishlist
                      className="px-6 py-2 bg-indigo-600 duration-300 transition hover:scale-95 active:scale-90 text-white rounded-md"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)} // Remove from wishlist
                      className="px-6 py-2 bg-gray-200 text-indigo-600 duration-300 transition hover:scale-95 active:scale-90 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
