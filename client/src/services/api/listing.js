// src/services/api/listing.js
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
        throw error.response?.data || error.message;
      }
    },
  
    createListing: async (listingData) => {
      try {
        const response = await api.post('/listings', listingData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
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