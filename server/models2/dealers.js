const mongoose = require('mongoose');

const DealerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    contactInfo: {
        email: { type: String },
        phone: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dealer', DealerSchema);