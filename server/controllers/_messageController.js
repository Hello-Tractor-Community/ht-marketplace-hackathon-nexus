// controllers/messageController.js
const Message = require('../models/_Message');
const Conversation = require('../models/_Conversation');
const Business = require('../models/Business');

const messageController = {
  // Initialize conversation
  async createConversation(req, res) {
    try {
      const { productId, buyerId, message } = req.body;
      const encryptionKey = encryptionUtils.generateConversationKey();
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const business = await Business.findById(product.business);
      
      const conversation = await Conversation.create({
        participants: [
          { user: buyerId, role: 'buyer' },
          { user: product.artisan, business: product.business, role: 'seller' }
        ],
        product: productId,
        metadata: {
          productName: product.name,
          productImage: product.images[0]?.url,
          initialInquiry: message
        },
        encryptionKey
      });

      const encryptedMessage = encryptionUtils.encryptMessage(message, encryptionKey);

      // Create initial message
      const initialMessage = await Message.create({
        conversation: conversation._id,
        sender: buyerId,
        content: encryptedMessage,
        encrypted: true
      });

      conversation.lastMessage = initialMessage._id;
      await conversation.save();

      // Emit socket event
      req.io.to(`business_${product.business}`).emit('newConversation', conversation);

      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get business conversations
  async getBusinessConversations(req, res) {
    try {
      const { businessId } = req.params;
      const conversations = await Conversation.find({
        'participants.business': businessId,
        status: 'active'
      })
      .populate('participants.user', 'firstName lastName')
      .populate('product', 'name images')
      .populate('lastMessage')
      .sort('-updatedAt');

      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Send message
  async sendMessage(req, res) {
    try {
      const { conversationId, content, attachments } = req.body;
      const senderId = req.user._id;

      const conversation = await Conversation.findById(conversationId);
      const encryptedContent = encryptionUtils.encryptMessage(
        content, 
        conversation.encryptionKey
      );

      const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content: encryptedContent,
        attachments,
        encrypted: true
      });

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: new Date()
      });

      // Get recipient from conversation
      const conversation = await Conversation.findById(conversationId);
      const recipient = conversation.participants.find(
        p => p.user.toString() !== senderId.toString()
      );

      // Emit socket events
      if (recipient.business) {
        req.io.to(`business_${recipient.business}`).emit('newMessage', message);
      }
      req.io.to(`user_${recipient.user}`).emit('newMessage', message);

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
