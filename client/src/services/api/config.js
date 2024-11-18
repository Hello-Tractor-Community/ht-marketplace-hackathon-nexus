// src/services/api/config.js
import axios from 'axios';
import { authService } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // This ensures cookies are sent with every request
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Use authService instead of direct localStorage access
    const token = authService.getToken();
    console.log('Token being used for request:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Use authService to clear auth data instead of direct localStorage access
      authService.clearAuthData();
      
      // Optionally: Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;