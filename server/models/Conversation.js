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
        // Only required for listing-related conversations
        required: function() {
            return this.type === 'listing_inquiry' || this.type === 'purchase_discussion';
        }
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Only required for listing-related conversations
        required: function() {
            return this.type === 'listing_inquiry' || this.type === 'purchase_discussion';
        }
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Only required for listing-related conversations and seller welcome messages
        required: function() {
            return this.type === 'listing_inquiry' || 
                   this.type === 'purchase_discussion' || 
                   this.type === 'admin_welcome';
        }
    },
    type: {
        type: String,
        enum: ['listing_inquiry', 'purchase_discussion', 'admin_welcome', 'admin_support'],
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

// Modified index to only apply to listing-related conversations
conversationSchema.index(
    { 
        listing: 1, 
        buyer: 1, 
        seller: 1 
    }, 
    { 
        unique: true,
        partialFilterExpression: { 
            type: { $in: ['listing_inquiry', 'purchase_discussion'] } 
        }
    }
);

module.exports = mongoose.model('Conversation', conversationSchema);