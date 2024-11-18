// src/services/api/business.js

import api from './config'
import authService from './auth';

export const businessService = {
    getBusinesss: async (params) => {
      try {
        console.log('params', params);
        const response = await api.get('/businesss', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    searchBusinesss: async (searchParams) => {
      try {
        const response = await api.get('/business/search', { params: searchParams });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    getBusinessById: async (id) => {
      try {
        const response = await api.get(`/business/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    registerBusiness: async (businessData) => {
      console.log('businessData in business service..', businessData);
      console.log('role in business service..', businessData.role);
      try {
        // Ensure token is in headers
        const token = authService.getToken();
        console.log('token in business service..', token);
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
  
        // Register the new business
        // const response = await api.post('/business',businessData.role, businessData);
        console.log("Sending post request..")
        const response = await api.post('/business/register', businessData);
        console.log('response in business service..', response.data);
        return response;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    updateBusiness: async (id, businessData) => {
      try {
        const response = await api.put(`/business/${id}`, businessData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    deleteBusiness: async (id) => {
      try {
        const response = await api.delete(`/business/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  };