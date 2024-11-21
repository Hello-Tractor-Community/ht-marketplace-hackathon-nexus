const mongoose = require('mongoose');

const userPresenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  lastPing: Date,
  socketId: String
}, { 
  timestamps: true 
});

module.exports = mongoose.model('UserPresence', userPresenceSchema);