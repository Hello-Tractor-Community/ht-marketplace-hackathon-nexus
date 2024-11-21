const socketIO = require('socket.io');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

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
                    conversation = await Conversation.findOneOrCreate({
                        participants: [senderId, recipientId]
                    });
                } else {
                    conversation = await Conversation.findById(conversationId);
                }

                const message = await Message.create({
                    conversation: conversation._id,
                    sender: senderId,
                    recipient: recipientId,
                    content
                });

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