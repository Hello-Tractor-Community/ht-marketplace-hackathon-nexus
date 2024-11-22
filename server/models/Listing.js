// models/Listing.js
const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
    // Basic Listing Info
    name: {
        type: String,
        required: true,
        index: true // For better search performance
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },

    // Categorization
    category: {
        type: String,
        required: true,
        enum: ['tractor', 'spare parts'],
        index: true
    },
    // Seller/Business Info
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        get: v => v ? v.toString() : v,
        set: v => v ? new mongoose.Types.ObjectId(v) : v
    },
    // Listing Details
    description: String,
    make: { type: String, required: true },
    model: { type: String, required: true },
    serviceHours: { type: Number, required: true },
    price: {
        amount: {
            type: Number,
            required: true,
            index: true
        },
        currency: {
            type: String,
            default: 'USD'
        },
        compareAtPrice: Number // For discounts
    },
    images: [{
        url: String,
        alt: String,
        isPrimary: Boolean
    }],
    location: {
        city: String,
        state: String,
        country: String,
    },
    
    // Status Flags
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive', 'archived'],
        default: 'draft',
        index: true
    },
    visibility: {
        isFeatured: {
            type: Boolean,
            default: false,
            index: true
        },
        isNewArrival: {
            type: Boolean,
            default: true,
            index: true
        },
    },

    // Inventory
    inventory: {
        quantity: {
            type: Number,
            required: true
        },
        lowStockThreshold: Number,
        sku: String,
        allowBackorder: Boolean
    },

    // Analytics & Metrics
    metrics: {
        totalSales: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        reviewCount: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Search configuration
listingSchema.index({
    name: 'text',
    description: 'text',
    'attributes.materials': 'text',
    'attributes.style': 'text',
    'attributes.occasion': 'text'
});

module.exports = mongoose.model('Listing', listingSchema);
