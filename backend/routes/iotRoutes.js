const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// POST /api/iot/sensors
router.post('/sensors', (req, res) => {
    try {
        const { temperature, humidity, ph, moisture } = req.body;

        // Log the incoming data
        logger.info(`Received IoT Data: Temp=${temperature}, Hum=${humidity}, pH=${ph}, Moisture=${moisture}`);

        // Check Thresholds & Send Alerts
        const ALERTS = [];
        if (moisture < 30) {
            const msg = `⚠️ URGENT: Soil Moisture is LOW (${moisture}%). Please irrigate immediately.`;
            ALERTS.push(msg);

            // Send SMS (Simulated)
            // In production, we'd fetch the user's phone number from DB. Using dummy here.
            require('../services/smsService').sendSMS('+919876543210', msg);

            // Emit Critical Alert Event
            req.io.emit('alert:critical', { message: msg, type: 'danger' });
        }

        // Emit to all connected clients
        req.io.emit('iot-data-update', {
            temperature,
            humidity,
            ph,
            moisture,
            timestamp: new Date()
        });

        res.status(200).json({ success: true, message: 'Data received and broadcasted' });
    } catch (error) {
        logger.error('IoT Route Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
