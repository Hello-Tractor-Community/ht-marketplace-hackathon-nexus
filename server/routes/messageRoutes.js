const express = require('express');
const router = express.Router();

const { authorize, protect } = require('../middleware/auth');

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
router.post('/listing/:listingId/conversation',  protect,createListingConversation);

// Send a message in a specific conversation
router.post('/conversation/:conversationId/send', protect,sendListingMessage);

// Get all conversations for a buyer
router.get('/buyer/conversations', protect ,getBuyerListingConversations);



router.get('/admin/conversations', protect, getAdminConversations )

router.post('/admin/conversations/welcome/:userId', protect, createWelcomeConversation)


module.exports = router;