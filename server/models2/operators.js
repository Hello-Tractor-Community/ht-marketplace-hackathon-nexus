// operators.schema.js
const mongoose = require('mongoose');

const OperatorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    certifications: [String], // List of certifications or qualifications
    experience: { type: Number, required: true }, // Years of experience
    rating: { type: Number, default: 0 }, // Average rating
    available: { type: Boolean, default: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
    },
    createdAt: { type: Date, default: Date.now },
});

OperatorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Operator', OperatorSchema);
