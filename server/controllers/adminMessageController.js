// controllers/adminMessageController.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Create welcome conversation when a seller signs up
const createWelcomeConversation = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const adminId = req.user._id;

    // Verify the requesting user is an admin
    if (!req.user.platformRoles.includes('admin')) {
        return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    // Find the user and verify they exist
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Check if welcome conversation already exists
    let conversation = await Conversation.findOne({
        participants: { $all: [adminId, userId] },
        type: 'admin_welcome'
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [adminId, userId],
            admin: adminId,
            seller: userId,  // For welcome conversations, the user is always a seller
            type: 'admin_welcome',
            status: 'active'
        });

        // Create welcome message
        const welcomeMessage = await Message.create({
            conversation: conversation._id,
            sender: adminId,
            recipient: userId,
            content: `Welcome to our platform! I'm here to help you get started and answer any questions you might have.`
        });

        conversation.lastMessage = welcomeMessage._id;
        await conversation.save();
    }

    res.status(201).json({
        success: true,
        data: conversation
    });
});

// Send message as admin to any user
const sendAdminMessage = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { content, attachments } = req.body;
    const adminId = req.user._id;

    // Verify the requesting user is an admin
    if (!req.user.platformRoles.includes('admin')) {
        return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    // Find the user and verify they exist
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Find existing conversation or create new one
    let conversation = await Conversation.findOne({
        participants: { $all: [adminId, userId] },
        type: 'admin_support',
        status: 'active'
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [adminId, userId],
            admin: adminId,
            ...(user.platformRoles.includes('seller') && { seller: userId }),
            ...(user.platformRoles.includes('buyer') && { buyer: userId }),
            type: 'admin_support',
            status: 'active'
        });
    }

    // Create the message
    const message = await Message.create({
        conversation: conversation._id,
        sender: adminId,
        recipient: userId,
        content,
        attachments
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate necessary fields for the response
    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'firstName lastName profileImage')
        .populate('recipient', 'firstName lastName profileImage');

    res.status(201).json({
        success: true,
        data: populatedMessage
    });
});

// Get all admin conversations
const getAdminConversations = asyncHandler(async (req, res, next) => {
    const adminId = req.user._id;

    // Verify the requesting user is an admin
    if (!req.user.platformRoles.includes('admin')) {
        return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    const conversations = await Conversation.find({
        admin: adminId
    })
    .populate('seller', 'firstName lastName profileImage')
    .populate('buyer', 'firstName lastName profileImage')
    .populate({
        path: 'lastMessage',
        select: 'content createdAt'
    })
    .sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations
    });
});

// Get messages for a specific admin conversation
const getAdminConversationMessages = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;
    const adminId = req.user._id;

    // Verify the requesting user is an admin
    if (!req.user.platformRoles.includes('admin')) {
        return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    // Verify conversation exists and admin is part of it
    const conversation = await Conversation.findOne({
        _id: conversationId,
        admin: adminId
    });

    if (!conversation) {
        return next(new ErrorResponse('Conversation not found or unauthorized', 404));
    }

    const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'firstName lastName profileImage')
        .populate('recipient', 'firstName lastName profileImage')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

// Update conversation status (mark as resolved or closed)
const updateAdminConversationStatus = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;

    // Verify the requesting user is an admin
    if (!req.user.platformRoles.includes('admin')) {
        return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    // Find and update conversation
    const conversation = await Conversation.findOneAndUpdate(
        { 
            _id: conversationId,
            admin: adminId
        },
        { status },
        { new: true }
    );

    if (!conversation) {
        return next(new ErrorResponse('Conversation not found or unauthorized', 404));
    }

    res.status(200).json({
        success: true,
        data: conversation
    });
});

module.exports = {
    createWelcomeConversation,
    sendAdminMessage,
    getAdminConversations,
    getAdminConversationMessages,
    updateAdminConversationStatus
};