// src/services/api/onboarding.js
// src/services/api/onboarding.js
import api from './config'

export const onboardingService = {
  startOnboarding: async (onboardingData) => {
    try {
      const response = await api.post('/onboarding/start', onboardingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  uploadDocuments: async (documents) => {
    try {
      const response = await api.put('/onboarding/documents', documents);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  reviewOnboarding: async (id, reviewData) => {
    try {
      const response = await api.put(`/onboarding/${id}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },



};