// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    owner: {
        type: String,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    companyType: {
        type: String,
        enum: ['Freelance', 'Small Company', 'Registered Company'],
        required: true
    },
    registrationStatus: {
        type: String,
        enum: ['pending', 'incomplete', 'completed', 'verified'],
        default: 'pending'
    },
    registrationDetails: {
        taxId: String,
        companyRegistrationNumber: String,
        registrationDate: Date,
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationDate: Date
    },
    location: {
        address: {
          type: String,
          required: true
        },
        city: {
          type: String,
          required: true
        },
        state: {
          type: String,
          required: true
        },
        country: {
          type: String,
          required: true
        },
        postalCode: {
          type: String,
          required: true
        },
        // coordinates: {
        //   type: { type: String, default: 'Point' },
        //   coordinates: {
        //     type: [Number],
        //     validate: {
        //       validator: function(v) {
        //         return v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number';
        //       },
        //       message: props => `${props.value} is not a valid coordinate pair!`
        //     }
        //   }
        // },
      },
    listingCategories: [{
        type: String,
        enum: [
            'Tractors', 'Servicing'
        ]
    }],
    targetCustomers: [{
        type: String,
        enum: [
            'Farmers', 'Tractor Owners'
        ]
    }],
    companyMetrics: {
        currentAnnualRevenue: Number,
        operationalScale: { 
            type: String,
            enum: ['Small', 'Medium', 'Large']
        },
        salesFrequency: String, // Replaces productionFrequency
        averageOrderValue: Number,
        totalOrders: {
            type: Number,
            default: 0
        },
        totalRevenue: {
            type: Number,
            default: 0
        }
    },
    
    platformExpectations: [{
        type: String,
        enum: [
            'Increased Visibility', 'Sales Growth',
            'Marketing Support', 'Payment Processing',
            'Community Networking', 'Professional Development',
            'Logistics Support'
        ]
    }],
    workDescription: String,
    socialMedia: {
        website: String,
        instagram: String,
        facebook: String,
        X: String,
       },
    shippingPolicies: {
        domesticShipping: {
            available: {
                type: Boolean,
                default: false
            },
            methods: [{
                name: String,
                estimatedDays: String,
                baseCost: Number
            }],
            processingTime: String,
            freeShippingThreshold: Number
        },
        internationalShipping: {
            available: {
                type: Boolean,
                default: false
            },
            countries: [String],
            methods: [{
                name: String,
                estimatedDays: String,
                baseCost: Number
            }],
            processingTime: String,
            restrictions: [String]
        }
    },
    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'manager', 'founder', 'agent','staff']
        },
        permissions: [{
            type: String,
            enum: [
                'manage_products',
                'manage_orders',
                'manage_staff',
                'view_analytics',
                'manage_settings'
            ]
        }],
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    subscriptionPlan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add indexes
companySchema.index({ 'location.coordinates': '2dsphere' });
companySchema.index({ companyName: 'text', workDescription: 'text' });

module.exports = mongoose.model('Company', companySchema);