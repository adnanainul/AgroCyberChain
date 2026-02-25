const express = require('express');
const router = express.Router();
const CropSuggestion = require('../models/CropSuggestion');

// @route   POST /api/suggestions
// @desc    Create a new crop suggestion
// @access  Public (or Protected if we add auth middleware)
router.post('/', async (req, res) => {
    try {
        const { cropName, description, requestedBy } = req.body;

        if (!cropName) {
            return res.status(400).json({ message: 'Crop name is required' });
        }

        const newSuggestion = new CropSuggestion({
            cropName,
            description,
            requestedBy: requestedBy || 'Anonymous'
        });

        const savedSuggestion = await newSuggestion.save();
        res.status(201).json(savedSuggestion);
    } catch (err) {
        console.error('Error creating suggestion:', err);
        res.status(500).json({ message: 'Server error while submitting suggestion' });
    }
});

// @route   GET /api/suggestions
// @desc    Get all crop suggestions
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const suggestions = await CropSuggestion.find().sort({ createdAt: -1 });
        res.json(suggestions);
    } catch (err) {
        console.error('Error fetching suggestions:', err);
        res.status(500).json({ message: 'Server error while fetching suggestions' });
    }
});

module.exports = router;
