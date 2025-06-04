import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ books: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist on user login/mount
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlist({ books: [] });
    }
  }, [user]);

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add book to wishlist
  const addToWishlist = async (bookId) => {
    if (!user) return { success: false, error: 'Please login to add items to wishlist' };
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ bookId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to wishlist');
      }
      
      setWishlist(data);
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove book from wishlist
  const removeFromWishlist = async (bookId) => {
    if (!user) return { success: false, error: 'Please login to remove items from wishlist' };
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item from wishlist');
      }
      
      setWishlist(data);
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (!user) return { success: false, error: 'Please login to clear wishlist' };
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to clear wishlist');
      }
      
      setWishlist({ books: [] });
      return { success: true };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if book is in wishlist
  const isInWishlist = (bookId) => {
    return wishlist.books.some(book => book.id === bookId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    fetchWishlist,
    isInWishlist,
    itemCount: wishlist.books.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 