const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Import logger and error handler
const logger = require('./config/logger');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for Socket.IO
    crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 1000 : (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100),
    message: { error: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 50 : 5, // 50 requests per 15 minutes in dev, 5 in prod
    message: { error: 'Too many authentication attempts, please try again later.' },
    skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ============================================
// LOGGING MIDDLEWARE
// ============================================

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));
}

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// SOCKET.IO SETUP
// ============================================

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware to pass 'io' to all routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
    logger.info(`New Client Connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`Client Disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
        logger.error(`Socket error: ${error.message}`);
    });
});

// ============================================
// DATABASE CONNECTION
// ============================================

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrocyberchain';

// Connect to MongoDB (skip if running tests)
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(MONGO_URI)
        .then(() => {
            logger.info('MongoDB Connected Successfully');
            logger.info(`Database: ${mongoose.connection.name}`);
        })
        .catch(err => {
            logger.error('MongoDB Connection Error:', err);
            process.exit(1); // Exit if database connection fails
        });
}

// MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
    logger.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
});

// ============================================
// ROUTES
// ============================================

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/suggestions', require('./routes/suggestionRoutes'));
app.use('/api/iot', require('./routes/iotRoutes'));

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

// Only listen if this file is run directly (not required by tests)
if (require.main === module) {
    server.listen(PORT, () => {
        logger.info(`=================================`);
        logger.info(`Server running on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`=================================`);
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = { app, server, io };
