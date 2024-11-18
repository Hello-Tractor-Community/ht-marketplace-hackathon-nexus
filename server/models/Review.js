// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        overall: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please add an overall rating']
        },
        craftsmanship: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please rate the craftsmanship']
        },
        valueForMoney: {
            type: Number,
            min: 1,
            max: 5
        },
        customerService: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    images: [{
        url: String,
        caption: String
    }],
    verified: {
        type: Boolean,
        default: false
    },
    purchaseVerified: {
        type: Boolean,
        default: false
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderReference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    tags: [{
        type: String,
        enum: [
            'Quality Materials', 'Excellent Craftsmanship', 
            'Great Communication', 'Fast Shipping',
            'Custom Request', 'Packaging', 'Authentic',
            'Sustainable', 'Handmade'
        ]
    }],
    helpfulVotes: {
        type: Number,
        default: 0
    },
    reported: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'published', 'flagged', 'removed'],
        default: 'pending'
    },
    businessResponse: {
        text: String,
        respondedAt: Date,
        lastUpdated: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average ratings
reviewSchema.statics.getAverageRatings = async function(businessId) {
    const obj = await this.aggregate([
        {
            $match: { business: businessId }
        },
        {
            $group: {
                _id: '$business',
                averageOverall: { $avg: '$rating.overall' },
                averageCraftsmanship: { $avg: '$rating.craftsmanship' },
                averageValueForMoney: { $avg: '$rating.valueForMoney' },
                averageCustomerService: { $avg: '$rating.customerService' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj[0]) {
            await this.model('Business').findByIdAndUpdate(businessId, {
                ratings: {
                    overall: obj[0].averageOverall.toFixed(1),
                    craftsmanship: obj[0].averageCraftsmanship.toFixed(1),
                    valueForMoney: obj[0].averageValueForMoney.toFixed(1),
                    customerService: obj[0].averageCustomerService.toFixed(1),
                    totalReviews: obj[0].totalReviews
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Update ratings after save/remove
reviewSchema.post('save', function() {
    this.constructor.getAverageRatings(this.business);
});

reviewSchema.pre('remove', function() {
    this.constructor.getAverageRatings(this.business);
});



module.exports = mongoose.model('Review', reviewSchema);