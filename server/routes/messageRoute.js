const express = require('express');
const { 
    createListingConversation,
    sendListingMessage,
    getBuyerListingConversations,
    getSellerListingConversations,
    getConversationMessages
} = require('../controllers/messageController');
const { protect, bypassAuth } = require('../middleware/auth');

const router = express.Router();

// Create a new conversation for a specific listing
router.post('/listing/:listingId/conversation',  bypassAuth,createListingConversation);

// Send a message in a specific conversation
router.post('/conversation/:conversationId/send', bypassAuth,sendListingMessage);

// Get all conversations for a buyer
router.get('/buyer/conversations', bypassAuth ,getBuyerListingConversations);

// Get all conversations for a seller
router.get('/seller/conversations', bypassAuth,getSellerListingConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId/messages', bypassAuth, getConversationMessages);


module.exports = router;