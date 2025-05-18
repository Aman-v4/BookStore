import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API base URL
const API_URL = 'http://localhost:5000/api';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user info in localStorage on initial load
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Save to localStorage and state
      localStorage.setItem('userInfo', JSON.stringify({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token
      }));

      setUser({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // Save to localStorage and state
      localStorage.setItem('userInfo', JSON.stringify({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token
      }));

      setUser({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    getUserInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 