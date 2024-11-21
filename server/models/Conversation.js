const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['listing_inquiry', 'purchase_discussion'],
        default: 'listing_inquiry'
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'closed'],
        default: 'active'
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true
});

// Ensure unique conversation per listing and buyer-seller pair
conversationSchema.index({ listing: 1, buyer: 1, seller: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);