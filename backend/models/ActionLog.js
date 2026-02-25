const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
    action_type: { type: String, required: true }, // 'IRRIGATION', 'FERTILIZER', 'TRANSACTION', 'ALERT'
    details: { type: String },
    status: { type: String, default: 'PENDING' }, // 'PENDING', 'COMPLETED', 'FAILED'
    user_id: { type: String }, // Optional, if triggered by user
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
