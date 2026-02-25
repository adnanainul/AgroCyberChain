const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    moisture: { type: Number, required: true },
    ph: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    sha256_hash: { type: String }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
