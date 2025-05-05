const mongoose = require('mongoose');
// Schema for activities
const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['commit', 'pr', 'message', 'blocker'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);