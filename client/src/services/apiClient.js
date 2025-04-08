// File: client/src/services/apiClient.js
import { authHeader } from './authService';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(auth ? authHeader() : {})
      }
    });
    
    return handleResponse(response);
  },
  
  /**
   * Make a POST request
   * @param {string} url - The endpoint URL (without base)
   * @param {object} data - The data to send
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async post(url, data, auth = true) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(auth ? authHeader() : {})
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
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
        // Include credentials for cookies/sessions
        credentials: 'include',
        body: new URLSearchParams(data)
      });
      
      // Log information for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries([...response.headers]));
      
      return handleResponse(response);
    } catch (error) {
      console.error("Fetch error:", error);
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
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(auth ? authHeader() : {})
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - The endpoint URL (without base)
   * @param {boolean} auth - Whether to include auth header
   * @returns {Promise<any>} - Response data
   */
  async delete(url, auth = true) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(auth ? authHeader() : {})
      }
    });
    
    return handleResponse(response);
  }
};

/**
 * Handle response and check for errors
 * @param {Response} response - Fetch Response object
 * @returns {Promise<any>} - Parsed response data
 */
async function handleResponse(response) {
  try {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    console.log("Content-Type:", contentType);
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        console.log("Response data:", data);
        
        if (!response.ok) {
          const error = data.detail || response.statusText;
          throw new Error(error);
        }
        
        return data;
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        // If JSON parsing fails, fall back to text
        const text = await response.text();
        console.log("Response as text:", text.substring(0, 200));
        throw new Error(`Failed to parse JSON: ${jsonError.message}`);
      }
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.log("Non-JSON response:", text.substring(0, 200));
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Return text for non-JSON responses
      return text;
    }
  } catch (error) {
    console.error("Response handling error:", error);
    throw error;
  }
}

export default apiClient;