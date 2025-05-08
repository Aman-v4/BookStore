// Context/UserDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get('http://localhost:5000/api/userdata', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setCartItems(res.data.cart || []);
        setWishlistItems(res.data.wishlist || []);
        setOrders(res.data.orderHistory || []);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated]);

  return (
    <UserDataContext.Provider value={{ cartItems, setCartItems, wishlistItems, setWishlistItems, orders }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
