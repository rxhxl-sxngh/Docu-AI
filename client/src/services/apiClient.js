// client/src/services/apiClient.js
import { authHeader, logout } from './authService';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper methods to get base URL and auth headers
const getBaseUrl = () => API_BASE_URL;
const getAuthHeader = (auth = true) => auth ? authHeader() : {};

/**
 * Handles API requests with proper error handling and authentication
 */
const apiClient = {
  /**
   * Make a GET request
   * @param {string} url - The endpoint URL (without base)
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async get(url, auth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(auth ? authHeader() : {})
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`GET request to ${url} failed:`, error);
      throw new Error(`Network error: ${error.message}`);
    }
  },
  
  /**
   * Make a POST request
   * @param {string} url - The endpoint URL (without base)
   * @param {object} data - The data to send
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async post(url, data, auth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(auth ? authHeader() : {})
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`POST request to ${url} failed:`, error);
      throw new Error(`Network error: ${error.message}`);
    }
  },
  
  /**
   * Upload a file with form data
   * @param {string} url - The endpoint URL (without base)
   * @param {FormData} formData - The FormData object with file
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async uploadFile(url, formData, auth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          // Don't set Content-Type as it will be set automatically with boundary
          'Accept': 'application/json',
          ...(auth ? authHeader() : {})
        },
        credentials: 'include',
        mode: 'cors',
        body: formData
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`File upload to ${url} failed:`, error);
      throw new Error(`Network error: ${error.message}`);
    }
  },
  
  /**
   * Make a form POST request (for login)
   * @param {string} url - The endpoint URL (without base)
   * @param {object} data - The form data to send
   * @returns {Promise<any>} - Response data
   */
  async postForm(url, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: new URLSearchParams(data)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Form POST request to ${url} failed:`, error);
      throw new Error(`Network error: ${error.message}`);
    }
  },
  
  /**
   * Make a PUT request
   * @param {string} url - The endpoint URL (without base)
   * @param {object} data - The data to send
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async put(url, data, auth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(auth ? authHeader() : {})
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`PUT request to ${url} failed:`, error);
      throw new Error(`Network error: ${error.message}`);
    }
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - The endpoint URL (without base)
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async delete(url, auth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...(auth ? authHeader() : {})
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`DELETE request to ${url} failed:`, error);
      throw new Error(`Network error: ${error.message}`);
    }
  }
};

/**
 * Handle response and check for errors
 * @param {Response} response - Fetch Response object
 * @returns {Promise<any>} - Parsed response data
 */
async function handleResponse(response) {
  // Check for authentication failures
  if (response.status === 401) {
    // Unauthorized - token expired or invalid
    console.warn('Authentication failure. Logging out...');
    logout();
    throw new Error('Your session has expired. Please log in again.');
  }
  
  try {
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        // API error with details
        const errorMessage = data.detail || response.statusText;
        throw new Error(errorMessage);
      }
      
      return data;
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      return text;
    }
  } catch (error) {
    if (error.name === 'SyntaxError') {
      console.error('JSON parsing error:', error);
      throw new Error('Failed to parse server response');
    }
    throw error;
  }
}

// Export helper methods with the apiClient
apiClient.getBaseUrl = getBaseUrl;
apiClient.getAuthHeader = getAuthHeader;

export default apiClient;