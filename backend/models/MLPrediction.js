const mongoose = require('mongoose');

const mlPredictionSchema = new mongoose.Schema({
    recommended_crop: { type: String, required: true },
    crop_confidence: { type: Number, required: true },
    irrigation_time: { type: String, required: true },
    irrigation_confidence: { type: Number, required: true },
    soil_health: { type: String, required: true },
    soil_confidence: { type: Number, required: true },
    predicted_yield: { type: Number },
    // Multi-Crop & Profit Analysis Data
    all_recommendations: [{
        crop: String,
        confidence: Number,
        yield: Number,
        cost: Number,   // Input Cost per Acre
        price: Number,  // Market Price per Ton
        net_profit: Number,
        duration: String
    }],
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MLPrediction', mlPredictionSchema);
