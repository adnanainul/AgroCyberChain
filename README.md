# AgroChain - Smart Agriculture Platform

A professional end-to-end IoT, AI/ML, and Blockchain-based Smart Agriculture Platform that empowers farmers with real-time monitoring, intelligent automation, secure data handling, and nationwide market connectivity.

## Overview

AgroChain addresses critical challenges faced by rural farmers through an integrated system:

- **IoT Sensor Grid**: Real-time monitoring of soil moisture, pH, temperature, humidity, and water flow
- **AI/ML Intelligence**: Predictive models for crop recommendations, irrigation scheduling, and disease detection
- **Blockchain Security**: SHA-256 based immutable records for data integrity
- **Market Linkage**: Direct farmer-buyer connectivity for better profitability

## Key Features

### 1. IoT Monitoring Dashboard
- Real-time sensor data visualization
- Live status of soil conditions and environmental parameters
- Automated alerts for anomalies
- Historical data tracking

### 2. AI-Powered Predictions
- **Crop Recommendation Model** (90% accuracy)
  - Algorithms: XGBoost, Random Forest, LightGBM
  - Inputs: pH, temperature, humidity, region, moisture, past yield data

- **Irrigation Prediction Model** (80-85% accuracy)
  - Algorithms: Linear Regression, Time-Series Forecasting (ARIMA/LSTM)
  - Predicts optimal irrigation timing and quantity

- **Soil Health Analysis** (88% accuracy)
  - Classification models for soil quality assessment
  - Nutrient deficiency detection

- **Fault & Anomaly Detection** (90% reliability)
  - Isolation Forest and Autoencoder algorithms
  - Detects sensor failures and anomalies

### 3. Blockchain-Based Security
- **SHA-256 Hashing**: Cryptographic fingerprinting of all data
- **Immutable Records**: All transactions and predictions stored securely
- **Tamper Detection**: Instant alerts on any data modification attempts
- **Supply Chain Verification**: Secure farmer-buyer transaction records

### 4. Market Linkage Portal
- Real-time buyer listings and demand information
- Price transparency and market insights
- Direct farmer-buyer connectivity
- Inter-state market access

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Tailwind CSS 3.4.1
- Vite 5.4.2
- Lucide React for icons
- **React Hot Toast** for notifications

### Backend & Database
- **Node.js & Express** - Robust REST API
- **MongoDB** - Flexible NoSQL Database
- **Mongoose** - ODM for data modeling
- **JWT** - Secure authentication
- **Socket.IO** - Real-time communication

### Security & Reliability
- **Helmet** - Hardened HTTP headers
- **Express Rate Limit** - DDoS protection
- **Express Validator** - Strict input validation
- **Winston** - Structured production logging
- **Jest & Supertest** - Automated testing suite

## Project Structure

```
AgroCyberChain-main/
├── backend/                # Node.js/Express Backend
│   ├── config/             # DB & Logger config
│   ├── middleware/         # Auth, Error, Validation
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   ├── tests/              # Jest Integration Tests
│   └── server.js           # Entry point
├── src/                    # React Frontend
│   ├── components/         # Reusable components
│   ├── context/            # Global state (Auth, Theme)
│   ├── pages/              # Application pages
│   ├── services/           # API clients
│   └── App.tsx             # Main component
└── README.md
```

## Database Schema (MongoDB)

### Collections
- **users**: Farmers & Customers (Auth, Roles)
- **ideas**: Innovation submissions
- **startups**: Registered startup profiles
- **sensor_data**: IoT readings
- **transactions**: Market exchanges

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agrocyberchain.git
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install

   # Start frontend server
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend

   # Install dependencies
   npm install

   # Configure Environment
   cp .env.example .env
   # Edit .env with your MongoDB URI

   # Start backend server
   npm start
   
   # Run tests
   npm test
   ```

## Production Deployment

### Frontend
- Optimized build with code splitting
- `npm run build`
- Deploy `dist/` to Vercel/Netlify

### Backend
- production-ready configuration via `NODE_ENV=production`
- PM2 or Docker recommended for process management
- Deploy to Render/Heroku/AWS

## API Endpoints

### Auth
- `POST /api/auth/register` - New user registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user profile

### Health
- `GET /health` - System status check

1. Mobile application for farmer access
2. Advanced weather integration
3. Drone imagery analysis
4. Government subsidy integration
5. Insurance prediction models
6. Cooperative farmer networks
7. Supply chain tracking
8. Smart contract automation

## Scalability

- Serverless architecture for unlimited scaling
- PostgreSQL handles millions of sensor readings
- Real-time data processing with edge functions
- CDN delivery for global reach

## Data Privacy & Compliance

- GDPR compliant data handling
- Encrypted data transmission
- Secure farmer identity management
- Transparent data usage policies
- Secure farmer-buyer interactions

## Support & Contact

- **Email**: contact@agrochain.com
- **Phone**: +91-9876543210
- **Location**: Bangalore, India

## License

This project is developed for educational and agricultural advancement purposes.

## Contributors

AgroChain Development Team - 2025

---

**AgroChain**: Empowering farmers with IoT, AI/ML, and Blockchain technology for sustainable and profitable agriculture.
