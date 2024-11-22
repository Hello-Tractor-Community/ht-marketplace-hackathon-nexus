// socket/socket.js
const socketIO = require('socket.io');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

function initializeSocketIO(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        // User joins their personal room
        socket.on('join', (userId) => {
            socket.join(userId);
        });

        // Handle new message
        socket.on('sendMessage', async (messageData) => {
            try {
                const { senderId, recipientId, content, conversationId } = messageData;

                let conversation;
                if (!conversationId) {
                    // Check if sender is admin
                    const sender = await User.findById(senderId);
                    if (sender.platformRoles.includes('admin')) {
                        conversation = await Conversation.create({
                            participants: [senderId, recipientId],
                            admin: senderId,
                            type: 'admin_support',
                            status: 'active'
                        });
                    } else {
                        conversation = await Conversation.findOneOrCreate({
                            participants: [senderId, recipientId]
                        });
                    }
                } else {
                    conversation = await Conversation.findById(conversationId);
                }

                const message = await Message.create({
                    conversation: conversation._id,
                    sender: senderId,
                    recipient: recipientId,
                    content
                });

                // Update conversation's last message
                conversation.lastMessage = message._id;
                await conversation.save();

                // Emit to recipient
                io.to(recipientId).emit('newMessage', message);
                
                // Emit to sender for optimistic UI
                socket.emit('messageSent', message);
            } catch (error) {
                socket.emit('messageError', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
}

module.exports = initializeSocketIO;