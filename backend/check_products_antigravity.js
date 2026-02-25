const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrocyberchain';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const count = await Product.countDocuments();
        console.log(`Product count: ${count}`);

        if (count === 0) {
            console.log('Database is empty. You should run the seeder.');
        } else {
            const products = await Product.find({}).limit(5);
            console.log('First 5 products:', JSON.stringify(products, null, 2));
        }

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
