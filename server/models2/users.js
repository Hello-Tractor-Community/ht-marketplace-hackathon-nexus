// users.schema.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin', 'dealer', 'operator'], required: true, default: 'buyer' },
    address: {
        city: String,
        state: String,
        country: String,
    },
    createdAt: { type: Date, default: Date.now },
    profileImage: { type: String }, // URL from Cloudinary
    isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
