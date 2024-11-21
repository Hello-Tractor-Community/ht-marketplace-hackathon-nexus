const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Listing = require('../models/Listing');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const createListingConversation = asyncHandler(async (req, res, next) => {
    const { listingId } = req.params;
    const buyerId = req.user._id;

    // Find the listing and verify it exists
    const listing = await Listing.findById(listingId).populate('seller');
    if (!listing) {
        return next(new ErrorResponse('Listing not found', 404));
    }

    // Prevent buyer from messaging their own listing
    if (listing.seller._id.toString() === buyerId.toString()) {
        return next(new ErrorResponse('You cannot message your own listing', 400));
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
        listing: listingId,
        buyer: buyerId,
        seller: listing.seller._id
    });

    // Create new conversation if it doesn't exist
    if (!conversation) {
        conversation = await Conversation.create({
            listing: listingId,
            buyer: buyerId,
            seller: listing.seller._id,
            participants: [buyerId, listing.seller._id]
        });
    }

    res.status(201).json({
        success: true,
        data: conversation
    });
});

const sendListingMessage = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user._id;

    // Find the conversation
    const conversation = await Conversation.findById(conversationId)
        .populate('buyer')
        .populate('seller')
        .populate('listing');

    if (!conversation) {
        return next(new ErrorResponse('Conversation not found', 404));
    }

    // Verify sender is a participant
    const isParticipant = conversation.participants.some(
        participant => participant.toString() === senderId.toString()
    );

    if (!isParticipant) {
        return next(new ErrorResponse('You are not a participant in this conversation', 403));
    }

    // Create the message
    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        recipient: senderId.toString() === conversation.buyer._id.toString() 
            ? conversation.seller._id 
            : conversation.buyer._id,
        content,
        attachments
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
        success: true,
        data: message
    });
});

const getBuyerListingConversations = asyncHandler(async (req, res, next) => {
    console.log('Request params:', req.params);

    const buyerId = req.user._id;
    console.log("BuyerID: ", buyerId)

    const conversations = await Conversation.find({ buyer: buyerId })
        .populate('listing', 'name images price')
        .populate('seller', 'firstName lastName profileImage')
        .populate({
            path: 'lastMessage',
            select: 'content createdAt'
        })
        .sort({ updatedAt: -1 });
    
        console.log(conversations)

    res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations
    });
});

const getSellerListingConversations = asyncHandler(async (req, res, next) => {
    const sellerId = req.user._id;
    console.log("Seller Id: ", sellerId)

    const conversations = await Conversation.find({ seller: sellerId })
        .populate('listing', 'name images price')
        .populate('buyer', 'firstName lastName profileImage')
        .populate({
            path: 'lastMessage',
            select: 'content createdAt'
        })
        .sort({ updatedAt: -1 });

    console.log(conversations)

    res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations
    });
});

const getConversationMessages = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return next(new ErrorResponse('Conversation not found', 404));
    }

    const isParticipant = conversation.participants.some(
        participant => participant.toString() === userId.toString()
    );

    if (!isParticipant) {
        return next(new ErrorResponse('You are not authorized to view this conversation', 403));
    }

    const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'firstName lastName profileImage')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

module.exports = {
    getConversationMessages,
    createListingConversation,
    sendListingMessage,
    getSellerListingConversations,
    getBuyerListingConversations
}