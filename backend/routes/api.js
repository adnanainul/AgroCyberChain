const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const MarketListing = require('../models/MarketListing');
const BlockchainRecord = require('../models/BlockchainRecord');
const MLPrediction = require('../models/MLPrediction');
const ActionLog = require('../models/ActionLog');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get Latest Sensor Data
router.get('/sensors/latest', async (req, res) => {
    try {
        const data = await SensorData.findOne().sort({ timestamp: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Latest Predictions
router.get('/predictions/latest', async (req, res) => {
    try {
        const data = await MLPrediction.findOne().sort({ timestamp: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Market Listings
router.get('/markets', async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        // If no filters, just return all active
        if (Object.keys(query).length === 0) {
            query.status = 'active';
        }

        const data = await MarketListing.find(query).sort({ created_at: -1 }).limit(50);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Listing Status
router.put('/markets/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const listing = await MarketListing.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(listing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create Market Listing
router.post('/markets', async (req, res) => {
    try {
        const { user_name, type, location, crop_type, quantity_tons, price_per_ton, contact_info } = req.body;

        const newListing = await MarketListing.create({
            user_name,
            type,
            location,
            crop_type,
            quantity_tons,
            price_per_ton,
            contact_info
        });

        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get Blockchain Records
router.get('/blockchain', async (req, res) => {
    try {
        const data = await BlockchainRecord.find().sort({ timestamp: -1 }).limit(10);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// SEEDER ENDPOINT (For Demo)
router.post('/seed', async (req, res) => {
    try {
        // Clear existing
        await SensorData.deleteMany({});
        await MarketListing.deleteMany({});
        await BlockchainRecord.deleteMany({});
        await MLPrediction.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Seed Sensors
        await SensorData.create({
            moisture: 45.5,
            ph: 6.8,
            temperature: 24.2,
            humidity: 58.9,
            sha256_hash: "a1b2c3d4e5f6..."
        });

        // Seed Predictions
        await MLPrediction.create({
            recommended_crop: "Wheat",
            crop_confidence: 96,
            irrigation_time: "Tomorrow Morning (6:00 AM)",
            irrigation_confidence: 89,
            soil_health: "Optimal",
            soil_confidence: 94,
            predicted_yield: 4.8
        });

        // Seed Markets
        await MarketListing.insertMany([
            { user_name: "Fresh Foods Ltd", type: 'buy', location: "Pune, MH", crop_type: "Wheat", quantity_tons: 50, price_per_ton: 23000, contact_info: "buyer@freshfoods.com" },
            { user_name: "Ramesh Farmer", type: 'sell', location: "Nashik, MH", crop_type: "Onion", quantity_tons: 5, price_per_ton: 18000, contact_info: "9876543210" },
            { user_name: "Organic Mart", type: 'buy', location: "Mumbai, MH", crop_type: "Rice", quantity_tons: 25, price_per_ton: 36000, contact_info: "procurement@organicmart.com" },
            { user_name: "Suresh Patil", type: 'sell', location: "Nagpur, MH", crop_type: "Oranges", quantity_tons: 10, price_per_ton: 45000, contact_info: "suresh@agromail.com" }
        ]);

        // Seed Blockchain
        await BlockchainRecord.insertMany([
            { block_number: 1001, current_hash: "0x8f7d...1234", data_type: "Sensor Reading", verified: true },
            { block_number: 1002, current_hash: "0x9a2b...5678", data_type: "Market Transaction", verified: true },
            { block_number: 1003, current_hash: "0x3c4d...9012", data_type: "Supply Chain", verified: true }
        ]);

        // Seed Products
        await Product.insertMany([
            // SEEDS CATEGORY
            {
                name: "Premium Hybrid Wheat Seeds",
                description: "High-yield hybrid wheat seeds suitable for all soil types. Disease resistant with 120-day maturity period.",
                category: "Seeds",
                brand: "AgroTech Seeds",
                price: 2500,
                discount: 10,
                final_price: 2250,
                stock_quantity: 500,
                unit: "kg",
                image_url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
                rating: 4.5,
                reviews_count: 128,
                specifications: { "Maturity": "120 days", "Yield": "45-50 quintals/acre", "Germination": "85%" }
            },
            {
                name: "Basmati Rice Seeds (Pusa 1121)",
                description: "Premium basmati rice seeds with excellent aroma and long grain. Ideal for export quality production.",
                category: "Seeds",
                brand: "Pusa Seeds",
                price: 3200,
                discount: 0,
                final_price: 3200,
                stock_quantity: 300,
                unit: "kg",
                image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
                rating: 4.8,
                reviews_count: 95
            },
            {
                name: "Hybrid Corn Seeds (Monsanto)",
                description: "High-performance corn seeds with excellent drought tolerance. 100-day maturity.",
                category: "Seeds",
                brand: "Monsanto",
                price: 1800,
                discount: 15,
                final_price: 1530,
                stock_quantity: 450,
                unit: "kg",
                image_url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
                rating: 4.3,
                reviews_count: 67
            },

            // FERTILIZERS CATEGORY
            {
                name: "NPK Fertilizer (19:19:19)",
                description: "Balanced NPK fertilizer for all crops. Improves soil fertility and crop yield significantly.",
                category: "Fertilizers",
                brand: "Tata Chemicals",
                price: 850,
                discount: 5,
                final_price: 807,
                stock_quantity: 1000,
                unit: "kg",
                image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
                rating: 4.6,
                reviews_count: 234
            },
            {
                name: "Urea Fertilizer (46% N)",
                description: "High nitrogen content urea for rapid plant growth. Suitable for all crops during vegetative stage.",
                category: "Fertilizers",
                brand: "IFFCO",
                price: 600,
                discount: 0,
                final_price: 600,
                stock_quantity: 2000,
                unit: "bag",
                image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
                rating: 4.4,
                reviews_count: 189
            },
            {
                name: "Organic Compost Premium",
                description: "100% organic compost made from cow dung and plant waste. Enriches soil naturally.",
                category: "Fertilizers",
                brand: "Green Earth",
                price: 450,
                discount: 20,
                final_price: 360,
                stock_quantity: 800,
                unit: "kg",
                image_url: "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400",
                rating: 4.7,
                reviews_count: 156
            },

            // PESTICIDES CATEGORY
            {
                name: "Insecticide Spray (Cypermethrin)",
                description: "Broad-spectrum insecticide effective against aphids, beetles, and caterpillars. Safe for crops.",
                category: "Pesticides",
                brand: "Bayer CropScience",
                price: 1200,
                discount: 10,
                final_price: 1080,
                stock_quantity: 350,
                unit: "liter",
                image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400",
                rating: 4.5,
                reviews_count: 98
            },
            {
                name: "Fungicide Powder (Mancozeb)",
                description: "Protective fungicide for controlling leaf spot, blight, and rust diseases in crops.",
                category: "Pesticides",
                brand: "Syngenta",
                price: 950,
                discount: 0,
                final_price: 950,
                stock_quantity: 400,
                unit: "kg",
                image_url: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400",
                rating: 4.3,
                reviews_count: 72
            },
            {
                name: "Herbicide (Glyphosate 41%)",
                description: "Non-selective herbicide for weed control. Effective on all types of weeds.",
                category: "Pesticides",
                brand: "Dow AgroSciences",
                price: 1350,
                discount: 8,
                final_price: 1242,
                stock_quantity: 280,
                unit: "liter",
                image_url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400",
                rating: 4.4,
                reviews_count: 54
            },

            // EQUIPMENT CATEGORY
            {
                name: "Drip Irrigation Kit (1 Acre)",
                description: "Complete drip irrigation system for 1 acre. Saves 60% water. Includes pipes, drippers, and filters.",
                category: "Equipment",
                brand: "Jain Irrigation",
                price: 15000,
                discount: 12,
                final_price: 13200,
                stock_quantity: 50,
                unit: "set",
                image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
                rating: 4.8,
                reviews_count: 145
            },
            {
                name: "Battery Sprayer Pump (16L)",
                description: "Rechargeable battery-operated sprayer. 4-6 hours runtime. Ideal for pesticide application.",
                category: "Equipment",
                brand: "Neptune",
                price: 3500,
                discount: 15,
                final_price: 2975,
                stock_quantity: 120,
                unit: "piece",
                image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
                rating: 4.2,
                reviews_count: 89
            },
            {
                name: "Digital Soil pH Meter",
                description: "Accurate soil pH and moisture meter. LCD display. Essential for precision farming.",
                category: "Equipment",
                brand: "Hanna Instruments",
                price: 2800,
                discount: 0,
                final_price: 2800,
                stock_quantity: 200,
                unit: "piece",
                image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
                rating: 4.6,
                reviews_count: 112
            },
            {
                name: "Solar Water Pump (1 HP)",
                description: "Solar-powered water pump for irrigation. No electricity cost. 5-year warranty.",
                category: "Equipment",
                brand: "Shakti Pumps",
                price: 45000,
                discount: 10,
                final_price: 40500,
                stock_quantity: 25,
                unit: "set",
                image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
                rating: 4.7,
                reviews_count: 78
            },
            {
                name: "Automatic Seed Sowing Machine",
                description: "Mechanical seed sowing machine for uniform planting. Adjustable row spacing.",
                category: "Equipment",
                brand: "Mahindra Agri",
                price: 8500,
                discount: 5,
                final_price: 8075,
                stock_quantity: 60,
                unit: "piece",
                image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
                rating: 4.4,
                reviews_count: 63
            }
        ]);

        res.json({ message: "Database seeded successfully with products!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /sensors - Simulate receiving data from IoT devices
router.post('/sensors', async (req, res) => {
    try {
        const { moisture, ph, temperature, humidity } = req.body;

        // 1. Save Sensor Data
        const dataString = `${moisture}-${ph}-${temperature}-${humidity}-${Date.now()}`;
        const hash = require('crypto').createHash('sha256').update(dataString).digest('hex');

        const newSensor = await SensorData.create({
            moisture,
            ph,
            temperature,
            humidity,
            sha256_hash: hash
        });

        // ⚡ REAL-TIME EMIT: Update Dashboard immediately
        if (req.io) {
            req.io.emit('sensor_update', newSensor);
        }

        // 2. Run "ML" Logic (XGBoost / LSTM Simulation)
        // Define Crop Database for Profit Calc (Price per ton, Cost per acre)
        const CROP_DB = {
            "Wheat": { price: 22000, cost: 15000, duration: "120 Days" },
            "Rice": { price: 35000, cost: 22000, duration: "150 Days" },
            "Corn": { price: 18000, cost: 12000, duration: "100 Days" },
            "Sugarcane": { price: 3000, cost: 40000, duration: "365 Days" }, // Price per ton low but high yield
            "Cotton": { price: 60000, cost: 25000, duration: "160 Days" }
        };

        // Determine "Suitable" crops based on conditions
        // Logic: Temp > 30 -> Heat lovers (Corn, Cotton). Temp < 25 -> Wheat. Humidity > 60 -> Rice.
        let candidates = [];

        if (temperature > 28) {
            candidates.push("Cotton", "Corn", "Sugarcane");
        } else if (temperature < 25) {
            candidates.push("Wheat", "Corn"); // Corn is adaptable
        } else {
            // Temperate
            candidates.push("Rice", "Areca Nut", "Soybean");
        }

        // Ensure we have at least 3
        if (candidates.length < 3) candidates.push("Tomato", "Potato");

        // Calculate Metrics for top 3
        const recommendations = candidates.slice(0, 3).map(crop => {
            const dbRef = CROP_DB[crop] || { price: 20000, cost: 15000, duration: "N/A" };

            // XGBoost Regressor for Yield (Randomized slightly around realistic means)
            // Wheat ~ 2-5 tons, Rice ~ 3-6 tons, Sugarcane ~ 30-50 tons
            const baseYield = crop === 'Sugarcane' ? 40 : 4;
            const predicted_yield = parseFloat((baseYield + (Math.random() * 2 - 1)).toFixed(2));

            // Profit = (Yield * Price) - Cost
            const gross_income = predicted_yield * dbRef.price;
            const net_profit = Math.floor(gross_income - dbRef.cost);

            return {
                crop,
                confidence: Math.floor(Math.random() * (99 - 85) + 85),
                yield: predicted_yield,
                cost: dbRef.cost,          // Added Cost
                price: dbRef.price,        // Added Price per Ton
                net_profit,
                duration: dbRef.duration
            };
        });

        // Use the Best Profit one as the "Primary" recommendation
        recommendations.sort((a, b) => b.net_profit - a.net_profit);
        const topPick = recommendations[0];

        let irrigation_time = "Not Needed";
        let irrigation_confidence = 90;
        let soil_health = "Optimal";

        // Simple Logic Rules (Simulating ML Decision Boundary)
        if (moisture < 30) {
            irrigation_time = "IMMEDIATE ACTION REQUIRED";
            irrigation_confidence = 99; // High confidence from "Random Forest"
            soil_health = "Critical: Dry";
        } else if (moisture > 80) {
            soil_health = "Risk of Root Rot (Detected by Isolation Forest)";
            irrigation_time = "Stop Irrigation";
        }

        // Save Prediction
        const newPrediction = await MLPrediction.create({
            recommended_crop: topPick.crop,
            crop_confidence: topPick.confidence,
            irrigation_time,
            irrigation_confidence,
            soil_health,
            soil_confidence: 88,
            predicted_yield: topPick.yield,
            // Store extra details in valid schema fields or implicit
            // Note: If schema doesn't support array, we only save top pick, 
            // but we EMIT the full array for UI.
            all_recommendations: recommendations // Schema must match this structure
        });

        if (req.io) {
            req.io.emit('prediction_update', {
                ...newPrediction.toObject(),
                all_recommendations: recommendations, // Send FULL ARRAY to UI
                model_used: "XGBoost + LSTM Ensemble"
            });
        }

        // 3. Create Blockchain Record
        const lastBlock = await BlockchainRecord.findOne().sort({ block_number: -1 });
        const blockNum = lastBlock ? lastBlock.block_number + 1 : 1000;
        const prevHash = lastBlock ? lastBlock.current_hash : "00000000000000000000000000000000";
        const blockData = `${blockNum}-${prevHash}-SensorAnalysis-${newSensor._id}`;
        const blockHash = require('crypto').createHash('sha256').update(blockData).digest('hex');

        const newBlock = await BlockchainRecord.create({
            block_number: blockNum,
            previous_hash: prevHash,
            current_hash: blockHash,
            data_type: "Sensor & ML Analysis",
            verified: true
        });

        if (req.io) {
            req.io.emit('block_mined', newBlock);
        }

        // 4. AUTOMATED ACTUATOR PIPELINE
        // If moisture is critical (< 30), trigger auto-irrigation
        if (moisture < 30) {
            const actionDetails = `Auto-Triggered: Moisture Low (${moisture}%)`;
            const newAction = await ActionLog.create({
                action_type: "EMERGENCY IRRIGATION",
                details: actionDetails,
                status: 'COMPLETED',
                user_id: "SYSTEM_AUTO_BOT"
            });

            // Log Action to Blockchain
            const actionBlockNum = blockNum + 1;
            const actionBlockData = `${actionBlockNum}-${blockHash}-ACTION-${newAction._id}`;
            const actionBlockHash = require('crypto').createHash('sha256').update(actionBlockData).digest('hex');

            const actionBlock = await BlockchainRecord.create({
                block_number: actionBlockNum,
                previous_hash: blockHash,
                current_hash: actionBlockHash,
                data_type: "Auto-Action: Irrigation",
                verified: true
            });

            // Emit Alert
            if (req.io) {
                req.io.emit('new_alert', {
                    type: 'success',
                    message: `System Auto-Irrigated: Moisture Corrected from ${moisture}%`,
                    action: newAction
                });
                req.io.emit('block_mined', actionBlock);
            }
        }

        res.json({
            message: "Data Processed Successfully",
            sensor: newSensor,
            prediction: newPrediction,
            block: newBlock
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Log an Action (Irrigation, etc.)
router.post('/actions', async (req, res) => {
    try {
        const { action_type, details, user_id } = req.body;
        const newAction = await ActionLog.create({
            action_type,
            details,
            status: 'COMPLETED', // Simulating instant success for hardware
            user_id
        });

        // Also add to blockchain for verification
        const lastBlock = await BlockchainRecord.findOne().sort({ block_number: -1 });
        const blockNum = lastBlock ? lastBlock.block_number + 1 : 1000;
        const prevHash = lastBlock ? lastBlock.current_hash : "00000000000000000000000000000000";
        const blockData = `${blockNum}-${prevHash}-ACTION-${newAction._id}`;
        const blockHash = require('crypto').createHash('sha256').update(blockData).digest('hex');

        await BlockchainRecord.create({
            block_number: blockNum,
            previous_hash: prevHash,
            current_hash: blockHash,
            data_type: `Action: ${action_type}`,
            verified: true
        });

        res.json(newAction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==================== PRODUCTS MARKETPLACE ROUTES ====================

// GET /products - Get all products with filters
router.get('/products', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;
        let query = { is_active: true };

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.final_price = {};
            if (minPrice) query.final_price.$gte = Number(minPrice);
            if (maxPrice) query.final_price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { created_at: -1 }; // Default: newest first
        if (sort === 'price_low') sortOption = { final_price: 1 };
        else if (sort === 'price_high') sortOption = { final_price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };

        const products = await Product.find(query).sort(sortOption);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /products/:id - Get single product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /products - Create new product (admin/seller)
router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ==================== ORDER ROUTES ====================

// POST /orders - Create new order with blockchain
router.post('/orders', async (req, res) => {
    try {
        const { user_id, user_name, items, shipping_address, payment_method } = req.body;

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product_id} not found` });
            }
            if (product.stock_quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            const itemTotal = product.final_price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product_id: product._id,
                product_name: product.name,
                quantity: item.quantity,
                price_per_unit: product.final_price,
                total_price: itemTotal
            });

            // Update stock
            product.stock_quantity -= item.quantity;
            await product.save();
        }

        // Calculate tax and shipping
        const tax = Math.floor(subtotal * 0.18); // 18% GST
        const shipping_charges = subtotal > 5000 ? 0 : 100; // Free shipping above ₹5000
        const total_amount = subtotal + tax + shipping_charges;

        // Generate unique order ID
        const order_id = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Generate SHA-256 hash for blockchain
        const orderData = `${order_id}-${user_id}-${total_amount}-${Date.now()}`;
        const sha256_hash = require('crypto').createHash('sha256').update(orderData).digest('hex');

        // Create order
        const order = new Order({
            order_id,
            user_id,
            user_name,
            items: orderItems,
            subtotal,
            tax,
            shipping_charges,
            total_amount,
            shipping_address,
            payment_method,
            sha256_hash
        });

        const newOrder = await order.save();

        // Create blockchain record
        const lastBlock = await BlockchainRecord.findOne().sort({ block_number: -1 });
        const blockNum = lastBlock ? lastBlock.block_number + 1 : 1000;
        const prevHash = lastBlock ? lastBlock.current_hash : "00000000000000000000000000000000";
        const blockData = `${blockNum}-${prevHash}-ORDER-${order_id}`;
        const blockHash = require('crypto').createHash('sha256').update(blockData).digest('hex');

        await BlockchainRecord.create({
            block_number: blockNum,
            previous_hash: prevHash,
            current_hash: blockHash,
            data_type: `Product Order: ${order_id}`,
            verified: true
        });

        // Emit real-time update
        if (req.io) {
            req.io.emit('order_created', {
                order_id: newOrder.order_id,
                user_name: newOrder.user_name,
                total_amount: newOrder.total_amount,
                items_count: newOrder.items.length
            });
        }

        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET /orders/:userId - Get user's orders
router.get('/orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.params.userId })
            .sort({ created_at: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /orders/details/:orderId - Get specific order
router.get('/orders/details/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ order_id: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /orders/:orderId/status - Update order status
router.put('/orders/:orderId/status', async (req, res) => {
    try {
        const { delivery_status, payment_status } = req.body;
        const update = {};

        if (delivery_status) update.delivery_status = delivery_status;
        if (payment_status) update.payment_status = payment_status;
        if (delivery_status === 'Delivered') update.delivered_at = Date.now();

        const order = await Order.findOneAndUpdate(
            { order_id: req.params.orderId },
            update,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Emit real-time update
        if (req.io) {
            req.io.emit('order_status_updated', {
                order_id: order.order_id,
                delivery_status: order.delivery_status,
                payment_status: order.payment_status
            });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
