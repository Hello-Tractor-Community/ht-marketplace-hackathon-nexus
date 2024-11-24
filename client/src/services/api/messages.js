// src/services/api/message.js
import api from './config';

export const messageService = {
    // Create a conversation for a listing if it doesn't exist
    createListingConversation: async (listingId) => {
        try {
            const response = await api.post(`/messages/listing/${listingId}/conversation`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            return { success: false, error: errorMessage };
        }
    },

    // Send a message in a conversation
    sendMessage: async (conversationId, content, attachments = []) => {
        console.log("Sending message..");
        try {
            const response = await api.post(`/messages/conversation/${conversationId}/send`, {
                content,
                attachments
            });
            console.log("Response sendmessage..",response);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            return { success: false, error: errorMessage };
        }
    },

    // Helper function to handle the entire send message flow
    handleMessageFlow: async (listingId, messageContent, attachments = []) => {
        try {
            // First, create or get existing conversation
            const conversationResponse = await messageService.createListingConversation(listingId);

            if (!conversationResponse.success) {
                return conversationResponse;
            }

            // Use the conversation ID to send the message
            const messageResponse = await messageService.sendMessage(
                conversationResponse.data._id,
                messageContent,
                attachments
            );

            console.log("messageflow api..",messageResponse);

            return messageResponse;
        } catch (error) {
            return { success: false, error: 'Failed to send message' };
        }
    },


    getSellerConversations: async (userId) => {

        console.log("fetching seller conversations.. userId", userId);

        try {
            const response = await api.get('messages/seller/conversations');
            console.log("response..", response.data);

            if (response.data.success) {
                return { success: true, data: response.data }; // Always return success: true if successful return response.data;
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