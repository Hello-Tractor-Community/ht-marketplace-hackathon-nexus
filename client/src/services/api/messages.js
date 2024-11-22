// src/services/api/listing.js

import api from './config';


export const messageService = {

   getSellerConversations: async (userId) => {

        console.log("fetching seller conversations.. userId", userId);

        try {
            const response = await api.get('messages/seller/conversations');
            console.log("response..", response.data);
            
            if (response.data.success) {
                return {success: true, data: response.data}; // Always return success: true if successful return response.data;
            }
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            return { success: false, error: errorMessage };
        }

    },

    getConversationMessages: async (conversationId) => {
        try {
            const response = await api.get(`messages/conversation/${conversationId}/messages/`);
            console.log("response..", response);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            return { success: false, error: errorMessage };
        }
    }
};