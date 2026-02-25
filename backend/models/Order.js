const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product_name: String,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price_per_unit: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shipping_charges: {
        type: Number,
        default: 0
    },
    total_amount: {
        type: Number,
        required: true
    },
    shipping_address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String
    },
    payment_method: {
        type: String,
        enum: ['COD', 'UPI', 'Card', 'Net Banking'],
        default: 'COD'
    },
    payment_status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    transaction_id: {
        type: String,
        default: null
    },
    delivery_status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    tracking_id: {
        type: String,
        default: null
    },
    sha256_hash: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    delivered_at: {
        type: Date,
        default: null
    }
});

orderSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
