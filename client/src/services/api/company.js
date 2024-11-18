// src/services/api/business.js

import api from './config'
import authService from './auth';

export const companyService = {
    getCompanys: async (params) => {
      try {
        console.log('params', params);
        const response = await api.get('/companys', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    searchCompanys: async (searchParams) => {
      try {
        const response = await api.get('/company/search', { params: searchParams });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    getCompanyById: async (id) => {
      try {
        const response = await api.get(`/company/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    registerCompany: async (companyData) => {
      console.log('companyData in company service..', companyData);
      console.log('role in company service..', companyData.role);
      try {
        // Ensure token is in headers
        const token = authService.getToken();
        console.log('token in company service..', token);
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
  
        // Register the new company
        // const response = await api.post('/company',companyData.role, companyData);
        console.log("Sending post request..")
        const response = await api.post('/company/register', companyData);
        console.log('response in company service..', response.data);
        return response;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    updateCompany: async (id, companyData) => {
      try {
        const response = await api.put(`/company/${id}`, companyData);
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