// models/Operator.js
const mongoose = require('mongoose');

const OperatorSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    certifications: [{
        name: String,
        issuingBody: String,
        issueDate: Date,
        expiryDate: Date,
        verificationUrl: String
    }],
    portfolio: [{
        title: String,
        description: String,
        imageUrls: [String],
        category: String,
        creationDate: Date
    }],
    primarySkills: {
        type: String,
        required: true,
        enum: [
        'Plowing',
        'Planting',
        'Harvesting',
        'Tillage',
        'Land Leveling',
        'Irrigation Management',
        'Fertilizer Application',
        'Pesticide Application',
        'Soil Preparation',
        'Transportation and Hauling',
        'Forestry Operations',
        'Heavy Equipment Maintenance',
        'Snow Removal',
        'Earthmoving and Excavation',
        'Precision Farming Technology',
         'Other'
        ]
    },
    secondarySkills: [{
        type: String,
        enum: [
            'Plowing',
            'Planting',
            'Harvesting',
            'Tillage',
            'Land Leveling',
            'Irrigation Management',
            'Fertilizer Application',
            'Pesticide Application',
            'Soil Preparation',
            'Transportation and Hauling',
            'Forestry Operations',
            'Heavy Equipment Maintenance',
            'Snow Removal',
            'Earthmoving and Excavation',
            'Precision Farming Technology',
             'Other'
            ]
    }],
    toolsAndTechniques: [String],
    yearsOfExperience: { 
        type: Number, 
        required: true 
    }, // Years of experience
    rating: { 
        type: Number, 
        default: 0 
    }, // Average rating
    available: { type: Boolean, default: true },
    location: {
        city: String,
        state: String,
        country: String,
    },
    createdAt: { type: Date, default: Date.now },
},{
    timestamps: true
});

OperatorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Operator', OperatorSchema);
