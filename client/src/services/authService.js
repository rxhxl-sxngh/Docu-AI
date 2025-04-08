// File: client/src/services/authService.js

// Save token to localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Get token from localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Remove token from localStorage
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
  };
  
  // Logout user
  export const logout = () => {
    removeToken();
    window.location.href = '/login';
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