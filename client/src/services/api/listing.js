// src/services/api/listing.js

import api from './config';


export const listingService = {
    getListings: async (params) => {
      try {
        const response = await api.get('/listings', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    searchListings: async (searchParams) => {
      try {
        const response = await api.get('/listings/search', { params: searchParams });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    getListingById: async (id) => {
      try {
        const response = await api.get(`/listings/${id}`);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        return { success: false, error: errorMessage };
      }
    },

    getListingsByUser: async (userId) => {
      console.log("Attempting to fetch listings for user:", userId);
      try {
        const response = await api.get(`/listings?user=${userId}`);
        console.log("Response data:", response.data.data);
        return { success: true, data: response.data.data }; // Always return success: true if successful
        
        
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    createListing: async (listingData) => {
      try {
        const response = await api.post('/listings', listingData);
        // Assuming the backend returns { success: true, data: listing }
        return { success: true, data: response.data }; // Always return success: true if successful
      } catch (error) {
        // Check if the backend error contains a success field or if it's missing
        const errorMessage = error.response?.data?.error || error.message;
        return { success: false, error: errorMessage }; // Always return success: false in case of an error
      }
    },
    
  
    updateListing: async (id, listingData) => {
      try {
        const response = await api.put(`/listings/${id}`, listingData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    deleteListing: async (id) => {
      try {
        const response = await api.delete(`/listings/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  };