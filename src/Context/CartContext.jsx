import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart on login
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get('http://localhost:5000/api/userdata', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(res.data.cart || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Add item to cart
  const addToCart = async (book) => {
    try {
      // Update locally
      setCartItems((prev) => [...prev, book]);

      // Update on the backend
      const token = await getAccessTokenSilently();
      await axios.post(
        'http://localhost:5000/api/add-to-cart',
        { bookId: book.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      // Update locally
      setCartItems((prev) => prev.filter((item) => item.id !== id));

      // Remove from backend
      const token = await getAccessTokenSilently();
      await axios.post(
        'http://localhost:5000/api/remove-from-cart',
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to remove item from backend cart:', error);
    }
  };

  const value = {
    cartItems,
    setCartItems,
    addToCart,  // Added addToCart to the context value
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
