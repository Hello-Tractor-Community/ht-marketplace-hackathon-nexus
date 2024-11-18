// messages.schema.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chatId: { type: String, required: true }, // Unique identifier for a conversation
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
