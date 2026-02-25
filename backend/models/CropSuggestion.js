const mongoose = require('mongoose');

const cropSuggestionSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    requestedBy: {
        type: String, // Storing as string (name or ID) for simplicity, or could be ObjectId if we strictly link to User model
        default: 'Anonymous'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CropSuggestion', cropSuggestionSchema);
