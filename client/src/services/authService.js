// File: client/src/services/authService.js

import apiClient from './apiClient';

// Save token to localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
  // Also save token expiration time (24 hours from now)
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  localStorage.setItem('tokenExpiration', expiration.toISOString());
};

// Get token from localStorage
export const getToken = () => {
  const token = localStorage.getItem('token');
  const expiration = localStorage.getItem('tokenExpiration');
  
  // Check if token has expired
  if (token && expiration) {
    const now = new Date();
    const expirationDate = new Date(expiration);
    
    if (now > expirationDate) {
      // Token has expired, remove it
      removeToken();
      return null;
    }
  }
  
  return token;
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Logout user
export const logout = async () => {
  try {
    // Call logout endpoint if it exists
    console.log("Logging out, clearing token locally");
    // await apiClient.post('/api/v1/auth/logout', {}, false).catch(() => {
    //   // Ignore errors from logout endpoint - we still want to remove the token
    //   console.log("Logout endpoint not available, clearing token locally");
    // });
  } finally {
    // Always remove token regardless of API response and send them back to login window
    removeToken();
    window.location.href = '/login';
  }
};

// Parse JWT token (without verification - just for getting user info)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Get authenticated user info (from token)
export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  
  const decodedToken = parseJwt(token);
  return decodedToken;
};

// Create auth header with token
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};