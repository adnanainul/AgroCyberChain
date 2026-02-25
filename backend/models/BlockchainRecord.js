const mongoose = require('mongoose');

const blockchainRecordSchema = new mongoose.Schema({
    block_number: { type: Number, required: true },
    previous_hash: { type: String },
    current_hash: { type: String, required: true },
    data_type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    verified: { type: Boolean, default: true }
});

module.exports = mongoose.model('BlockchainRecord', blockchainRecordSchema);
