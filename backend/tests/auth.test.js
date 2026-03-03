const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server'); // We need to export app from server.js
const User = require('../models/User');

// Configure test database
beforeAll(async () => {
    // Check if we are already connected before connecting
    if (mongoose.connection.readyState === 0) {
        const url = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/agrochain_test';
        await mongoose.connect(url);
    }
});

afterAll(async () => {
    // Clean up and close connection
    if (mongoose.connection.readyState !== 0) {
        await User.deleteMany({}); // Clean up test users
        await mongoose.connection.close();
    }
});

describe('Auth API & Security', () => {

    // Clean up before each test to ensure fresh state
    beforeEach(async () => {
        await User.deleteMany({});
    });

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'farmer'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', testUser.email);
        });

        it('should reject invalid email format', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ ...testUser, email: 'notanemail' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toContain('Invalid email format');
        });

        it('should reject weak passwords', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ ...testUser, password: '123' });

            expect(res.statusCode).toEqual(400);
        });

        it('should prevent duplicate email registration', async () => {
            // First registration
            await request(app).post('/api/auth/register').send(testUser);

            // Duplicate registration
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Register user before login tests
            await request(app).post('/api/auth/register').send(testUser);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should reject incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('Security Headers', () => {
        it('should have security headers enabled (Helmet)', async () => {
            const res = await request(app).get('/health');
            expect(res.headers['x-dns-prefetch-control']).toBeDefined();
            expect(res.headers['x-frame-options']).toBeDefined();
        });
    });

    // ------------------------------------------------------
    // New: ensure ML prediction endpoint works correctly
    // (regression test for previously-broken async call)
    describe('POST /api/sensors', () => {
        it('should accept sensor data and return a valid prediction', async () => {
            const payload = {
                moisture: 45,
                ph: 6.5,
                temperature: 25,
                humidity: 60
            };

            const res = await request(app)
                .post('/api/sensors')
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('prediction');
            const pred = res.body.prediction;
            expect(pred.recommended_crop).toBeDefined();
            expect(pred.crop_confidence).toBeGreaterThanOrEqual(0);
            // ensure the async ml engine was awaited by checking for an array
            expect(Array.isArray(pred.all_recommendations)).toBe(true);
        });
    });
});
