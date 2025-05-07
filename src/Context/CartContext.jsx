// CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to Cart function
  const addToCart = (book) => {
    setCartItems((prevItems) => [...prevItems, book]);
  };

  // Remove from Cart function
  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== bookId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
