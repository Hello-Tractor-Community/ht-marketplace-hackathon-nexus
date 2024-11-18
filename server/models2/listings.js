// listings.schema.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number], // [longitude, latitude] for geospatial indexing
    },
    images: [{ type: String }], // URLs from Cloudinary
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['tractor', 'part'], required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'sold', 'pending'], default: 'active' },
});

ListingSchema.index({ location: '2dsphere' }); // Geospatial indexing for location-based search

module.exports = mongoose.model('Listing', ListingSchema);
