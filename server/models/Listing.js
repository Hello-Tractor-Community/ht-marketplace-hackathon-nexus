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
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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

// Example search utility
const searchListings = async (criteria) => {
    const query = {};
    const sort = {};

    // Basic filters
    if (criteria.category) query.category = criteria.category;
    if (criteria.make) query.make = criteria.make;
    if (criteria.model) query.model = criteria.model;
    // Service hours range
    if (criteria.serviceHoursRange) {
        query.serviceHours = {
            $gte: criteria.serviceHoursRange.min,
            $lte: criteria.serviceHoursRange.max
        };
    }
    // Price range
    if (criteria.priceRange) {
        query['price.amount'] = {
            $gte: criteria.priceRange.min,
            $lte: criteria.priceRange.max
        };
    }

    // Visibility filters
    if (criteria.isFeatured) query['visibility.isFeatured'] = true;
    if (criteria.isNewArrival) query['visibility.isNewArrival'] = true;

    // Business/Artisan filter
    if (criteria.sellerId) query.seller = criteria.userId;
   
    // Text search
    if (criteria.searchText) {
        query.$text = { $search: criteria.searchText };
        sort.score = { $meta: "textScore" };
    }

    // Sorting
    if (criteria.sortBy) {
        switch (criteria.sortBy) {
            case 'price_asc':
                sort['price.amount'] = 1;
                break;
            case 'price_desc':
                sort['price.amount'] = -1;
                break;
            case 'rating':
                sort['metrics.averageRating'] = -1;
                break;
            case 'popularity':
                sort['metrics.totalSales'] = -1;
                break;
        }
    }

    return await Listing.find(query)
        .sort(sort)
        .populate('seller', 'firstName lastName')
        .limit(criteria.limit || 20)
        .skip(criteria.skip || 0);
};

module.exports = mongoose.model('Listing', listingSchema);
