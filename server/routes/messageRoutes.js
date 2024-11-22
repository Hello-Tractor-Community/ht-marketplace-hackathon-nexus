const express = require('express');
const router = express.Router();

const { protect, bypassAuth, bypassAdminAuth } = require('../middleware/auth');

const { 
    createListingConversation,
    sendListingMessage,
    getBuyerListingConversations,
    getSellerListingConversations,
    getConversationMessages,
    
} = require('../controllers/messageController');

const {
    getAdminConversations,
    createWelcomeConversation
} = require('../controllers/adminMessageController')


// Get all conversations for a seller
router.get('/seller/conversations', protect,getSellerListingConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId/messages', protect, getConversationMessages);

// Create a new conversation for a specific listing
router.post('/listing/:listingId/conversation',  bypassAuth,createListingConversation);

// Send a message in a specific conversation
router.post('/conversation/:conversationId/send', bypassAuth,sendListingMessage);

// Get all conversations for a buyer
router.get('/buyer/conversations', bypassAuth ,getBuyerListingConversations);



router.get('/admin/conversations', bypassAdminAuth, getAdminConversations )

router.post('/admin/conversations/welcome/:userId', bypassAdminAuth, createWelcomeConversation)


module.exports = router;