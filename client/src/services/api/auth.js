// auth.js


// src/services/api/auth.js
import { addBusinessAssociation } from '../../store/slices/authSlice';
import api from './config';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  /**
   * Stores authentication data in localStorage
   */
  setAuthData: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  },

  /**
   * Clears authentication data from localStorage
   */
  clearAuthData: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);  // Removes the token from localStorage
    delete api.defaults.headers.common['Authorization'];  // Optionally, remove the Authorization header from API defaults
  },
  

  /**
   * Login user with credentials
   */
  loginUser: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log("response in login service..", response);
      const { token, user, businessDetails } = response.data.data;
      const success = response.data.success;



      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      authService.setAuthData(token, user);
      return {token, user, businessDetails, success};
    } catch (error) {
      authService.clearAuthData(); // Clear any partial data on error
      throw error.response?.data || error.message;
    }
  },

  /**
   * Register new user
   */
  registerUser: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Full response from server:', response);
  
      const { success, data } = response.data;
      console.log("success..",success);
      console.log("data..",data);
      if (!success || !data.user || !data.token) {
        throw new Error('Invalid response format from server');
      }
  
      const { user, token } = data;
      authService.setAuthData(token, user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success, data: { user, token } };
    } catch (error) {
      authService.clearAuthData(); // Clear any partial data on error
      throw error.response?.data || error.message;
    }
  },

  addBusinessAssociation: async (associationData) => {
    try {
      const token = authService.getToken(); // Retrieve stored token
      if (!token) throw new Error('Authentication token is missing.');

      // Set the authorization header if not already set
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.post('/auth/business-association', associationData);
      return response.data;
    } catch (error) {
      console.error('Failed to add business association:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout user and clear storage
   */
  logout: () => {
    authService.clearAuthData();
    // Optional: Call logout endpoint if you need to invalidate token on server
    // await api.post('/auth/logout');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;

      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        authService.clearAuthData(); // Clear token if user data is missing
        return null;
      }

      const user = JSON.parse(userStr);

      // Validate user object has required properties
      if (!user.id || !Array.isArray(user.roles)) {
        authService.clearAuthData();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      authService.clearAuthData();
      return null;
    }
  },

  // checkEmailVerification: async () => {
  //   // const token = localStorage.getItem('token');
  //   const token = authService.getToken();
  //   console.log('token in checkEmailVerification..', token);
  //   try {
  //     const response = await api.get('/auth/check-verification', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  checkEmailVerification: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('No token found');
      }
      console.log('token in checkEmailVerification..', token);

      // Set token in default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/auth/check-verification');
      console.log('response in checkEmailVerification..', response.data.data);
      return {
        success: true,
        data: response.data.data // Ensure we're returning the data property
      };
    } catch (error) {
      // Standardize error response
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get user profile
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearAuthData(); // Clear auth data if unauthorized
      }
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);

      // If profile update includes user data that should be stored locally
      if (response.data.user) {
        const currentUser = authService.getCurrentUser();
        authService.setAuthData(
          localStorage.getItem(TOKEN_KEY), // Keep existing token
          { ...currentUser, ...response.data.user } // Merge updated user data
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
 * Set authentication token
 */
  setToken: (token) => {
    console.log("token in setToken..", token);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Error storing token:', error);
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Failed to store authentication token');
    }
  },

  /**
   * Get authentication token
   */
  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Ensure the token is set in api defaults whenever we get it
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  },


  verifyEmail: async (token) => {
    // const token = localStorage.getItem('token');
    try {
      const response = await api.get(`/auth/verify/${token}`);
      console.log('Verification response:', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  

  resendVerificationEmail: async () => {
    // try {
    //   const response = await api.post('/auth/verify/resend');
    //   return response.data;
    // } catch (error) {
    //   throw error.response?.data || error.message;
    // }
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    try {
      const response = await api.post('/auth/resend-verification');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;