const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { registerValidation, loginValidation } = require('../middleware/validator');
const logger = require('../config/logger');

// Register
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        throw new AppError('User already exists with this email', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
        name,
        email,
        password: hashedPassword,
        role
    });

    await user.save();

    logger.info(`New user registered: ${email} (${role})`);

    // Create token
    const payload = {
        user: {
            id: user.id,
            role: user.role
        }
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(201).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            date: user.createdAt
        }
    });
}));

// Login
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    logger.info(`User logged in: ${email}`);

    // Create token
    const payload = {
        user: {
            id: user.id,
            role: user.role
        }
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            date: user.createdAt
        }
    });
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new AppError('No token, authorization denied', 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
        throw new AppError('Token is not valid', 401);
    }
    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    });
}));

module.exports = router;
