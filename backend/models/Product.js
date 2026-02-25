const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Tools', 'Irrigation']
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    final_price: {
        type: Number,
        required: true
    },
    stock_quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liter', 'piece', 'bag', 'set']
    },
    image_url: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=Product+Image'
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews_count: {
        type: Number,
        default: 0
    },
    seller_info: {
        type: String,
        default: 'AgroCyberChain Official'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

productSchema.pre('save', function (next) {
    this.final_price = this.price - (this.price * this.discount / 100);
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema);
