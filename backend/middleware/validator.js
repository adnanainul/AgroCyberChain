const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation result checker
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new AppError(errorMessages, 400);
    }
    next();
};

// Auth validation rules
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['farmer', 'customer']).withMessage('Role must be farmer or customer'),
    validate
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

// Sensor validation rules
const sensorValidation = [
    body('temperature')
        .notEmpty().withMessage('Temperature is required')
        .isFloat({ min: -50, max: 60 }).withMessage('Temperature must be between -50 and 60'),
    body('humidity')
        .notEmpty().withMessage('Humidity is required')
        .isFloat({ min: 0, max: 100 }).withMessage('Humidity must be between 0 and 100'),
    body('ph')
        .notEmpty().withMessage('pH is required')
        .isFloat({ min: 0, max: 14 }).withMessage('pH must be between 0 and 14'),
    body('moisture')
        .notEmpty().withMessage('Moisture is required')
        .isFloat({ min: 0, max: 100 }).withMessage('Moisture must be between 0 and 100'),
    validate
];

// Marketplace validation rules
const listingValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    validate
];

// ID parameter validation
const idValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    sensorValidation,
    listingValidation,
    idValidation,
    validate
};
