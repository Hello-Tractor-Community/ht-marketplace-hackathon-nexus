// src/services/api/user.js

import api from './config';


export const userService = {
    getUsers: async (params) => {
      try {
        const response = await api.get('/users', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
    getUsersByRole: async (role) => {
      try {
          const response = await api.get('/users/role/search', { 
              params: { role }
          });
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  },
  
    searchUsers: async (searchParams) => {
      try {
        const response = await api.get('/users/search', { params: searchParams });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    getUserById: async (id) => {
        console.log("Fetching seller info..",id);
      try {
        const response = await api.get(`/users/${id}`);
        console.log("userid response..",response);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        return { success: false, error: errorMessage };
      }
    },

    getUserByListing: async (listingId) => {
      console.log("Attempting to fetch listings for user:", listingId);
      try {
        const response = await api.get(`/users?listing=${listingId}`);
        console.log("Response data:", response.data.data);
        return { success: true, data: response.data.data }; // Always return success: true if successful
        
        
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    createUser: async (userData) => {
      try {
        const response = await api.post('/users', userData);
        // Assuming the backend returns { success: true, data: user }
        return { success: true, data: response.data }; // Always return success: true if successful
      } catch (error) {
        // Check if the backend error contains a success field or if it's missing
        const errorMessage = error.response?.data?.error || error.message;
        return { success: false, error: errorMessage }; // Always return success: false in case of an error
      }
    },
    
 
    deleteUser: async (id) => {
      try {
        const response = await api.delete(`/users/${id}`);
        console.log("Delete Response data:", response.data);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    updateUserStatus: async (userId, accountStatus) => {
      try {
          const response = await api.patch(`/users/${userId}/status`, {
              accountStatus
          });
          return { success: true, data: response.data };
      } catch (error) {
          return {
              success: false,
              error: error.response?.data || error.message
          };
      }
  }
  };