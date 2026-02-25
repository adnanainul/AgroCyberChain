const mongoose = require('mongoose');

const marketListingSchema = new mongoose.Schema({
    user_name: { type: String, required: true }, // Name of Farmer or Customer
    type: { type: String, enum: ['sell', 'buy'], required: true }, // 'sell' = Offer, 'buy' = Request
    location: { type: String, required: true },
    crop_type: { type: String, required: true },
    quantity_tons: { type: Number, required: true },
    price_per_ton: { type: Number, required: true },
    contact_info: { type: String }, // Phone or Email
    status: { type: String, enum: ['active', 'sold', 'fulfilled'], default: 'active' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketListing', marketListingSchema);
