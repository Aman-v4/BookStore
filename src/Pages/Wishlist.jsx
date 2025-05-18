import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <h2 className="text-2xl font-semibold mb-6">Please login to view your wishlist</h2>
        <Link to="/Login" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleRemoveItem = async (bookId) => {
    setIsUpdating(true);
    const result = await removeFromWishlist(bookId);
    setIsUpdating(false);
    
    if (result.success) {
      toast.success('Item removed from wishlist');
    } else {
      toast.error(result.error || 'Failed to remove item from wishlist');
    }
  };

  const handleMoveToCart = async (book) => {
    setIsUpdating(true);
    // First add to cart
    const cartResult = await addToCart(book.id);
    
    if (cartResult.success) {
      // Then remove from wishlist
      await removeFromWishlist(book._id);
      toast.success('Item moved to cart');
    } else {
      toast.error(cartResult.error || 'Failed to move item to cart');
    }
    
    setIsUpdating(false);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      setIsUpdating(true);
      const result = await clearWishlist();
      setIsUpdating(false);
      
      if (result.success) {
        toast.success('Wishlist cleared');
      } else {
        toast.error(result.error || 'Failed to clear wishlist');
      }
    }
  };

  if (loading || isUpdating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlist.books.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg mb-4">Your wishlist is empty.</p>
            <Link to="/Explore" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Explore Books
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {wishlist.books.map((book) => (
                <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="p-4 flex-grow">
                    <div className="flex items-start">
                      <img 
                        src={book.image || "https://placehold.co/120x180"}
                        alt={book.name}
                        className="w-24 h-32 object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <Link to={`/product/${book.id}`}>
                          <h3 className="font-medium text-lg mb-1 hover:text-indigo-600">{book.name}</h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        <div className="flex items-center mb-2">
                          <p className="text-gray-500 line-through text-sm mr-2">₹{book.price}</p>
                          <p className="text-green-600 font-semibold">₹{book.discounted_price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 flex justify-between">
                    <button 
                      onClick={() => handleRemoveItem(book._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={() => handleMoveToCart(book)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Link 
                to="/Explore" 
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
              {wishlist.books.length > 0 && (
                <button
                  onClick={handleClearWishlist}
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                >
                  Clear Wishlist
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
