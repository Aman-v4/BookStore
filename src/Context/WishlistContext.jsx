import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist on login
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get('http://localhost:5000/api/userdata', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlistItems(res.data.wishlist || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Add to Wishlist
  const addToWishlist = async (book) => {
    try {
      // Optimistically update the wishlist state
      setWishlistItems((prevItems) => [...prevItems, book]);

      // Send the updated wishlist to the backend
      const token = await getAccessTokenSilently();
      await axios.post(
        'http://localhost:5000/api/wishlist',
        { wishlistItems: [...wishlistItems, book] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to add item to wishlist:', error);
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (id) => {
    try {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));

      const token = await getAccessTokenSilently();
      await axios.post(
        'http://localhost:5000/api/remove-from-wishlist',
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to remove item from backend wishlist:', error);
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,  // Add the function here
    setWishlistItems,
    removeFromWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
