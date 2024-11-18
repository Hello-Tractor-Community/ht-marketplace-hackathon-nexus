// src/services/api/program.js
export const programService = {
    getPrograms: async (params) => {
      try {
        const response = await api.get('/programs', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    searchPrograms: async (searchParams) => {
      try {
        const response = await api.get('/programs/search', { params: searchParams });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    getProgramById: async (id) => {
      try {
        const response = await api.get(`/programs/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    createProgram: async (programData) => {
      try {
        const response = await api.post('/programs', programData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    updateProgram: async (id, programData) => {
      try {
        const response = await api.put(`/programs/${id}`, programData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    deleteProgram: async (id) => {
      try {
        const response = await api.delete(`/programs/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  };