# AgroChain API Documentation

## Overview

AgroChain provides a comprehensive REST API built on Supabase with real-time capabilities and blockchain-verified data integrity.

## Base URL
```
https://uxfnyzfkcduyjuyeqhhv.supabase.co/rest/v1
```

## Authentication

All API requests require authentication via JWT token in the Authorization header:

```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

## API Endpoints

### Farmers

#### Get All Farmers
```
GET /farmers
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "region": "North",
    "created_at": "2025-11-20T10:30:00Z"
  }
]
```

#### Create Farmer
```
POST /farmers
```

**Request Body:**
```json
{
  "name": "New Farmer",
  "email": "farmer@example.com",
  "phone": "+91-9876543210",
  "region": "North"
}
```

**Response:** 201 Created

### Fields

#### Get Fields for Farmer
```
GET /fields?farmer_id=eq.550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "farmer_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Field A",
    "soil_type": "Loamy",
    "area_hectares": 2.5,
    "current_crop": "Rice",
    "created_at": "2025-11-20T10:30:00Z"
  }
]
```

#### Create Field
```
POST /fields
```

**Request Body:**
```json
{
  "farmer_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Field A",
  "soil_type": "Loamy",
  "area_hectares": 2.5,
  "current_crop": "Rice"
}
```

### Sensor Data

#### Get Latest Sensor Data
```
GET /sensor_data?field_id=eq.550e8400-e29b-41d4-a716-446655440001&order=timestamp.desc&limit=1
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "field_id": "550e8400-e29b-41d4-a716-446655440001",
    "moisture": 45.5,
    "ph": 6.8,
    "temperature": 28.3,
    "humidity": 62.4,
    "water_flow": 12.5,
    "timestamp": "2025-11-20T14:30:00Z",
    "sha256_hash": "a7f8e2d1c9b4f3e5a2d8c1b9e4f7a3d2e1c5b9a8e4f2d7c1b5a9e3f8c2d6"
  }
]
```

#### Create Sensor Data
```
POST /sensor_data
```

**Request Body:**
```json
{
  "field_id": "550e8400-e29b-41d4-a716-446655440001",
  "moisture": 45.5,
  "ph": 6.8,
  "temperature": 28.3,
  "humidity": 62.4,
  "water_flow": 12.5,
  "sha256_hash": "a7f8e2d1c9b4f3e5a2d8c1b9e4f7a3d2e1c5b9a8e4f2d7c1b5a9e3f8c2d6"
}
```

### ML Predictions

#### Get Latest Predictions
```
GET /ml_predictions?field_id=eq.550e8400-e29b-41d4-a716-446655440001&order=timestamp.desc&limit=1
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "field_id": "550e8400-e29b-41d4-a716-446655440001",
    "recommended_crop": "Basmati Rice",
    "crop_confidence": 92,
    "irrigation_time": "In 4 hours",
    "irrigation_confidence": 88,
    "soil_health": "Good",
    "soil_confidence": 88,
    "anomaly_detected": false,
    "predicted_yield": 4.2,
    "timestamp": "2025-11-20T14:30:00Z",
    "sha256_hash": "b9e2f1d3c5a7b8e4f2d9c1a6b3e8f4c2d7e1a5b9c4f3d8e2b7a1c6f9d3e8"
  }
]
```

#### Create Prediction
```
POST /ml_predictions
```

**Request Body:**
```json
{
  "field_id": "550e8400-e29b-41d4-a716-446655440001",
  "recommended_crop": "Basmati Rice",
  "crop_confidence": 92,
  "irrigation_time": "In 4 hours",
  "irrigation_confidence": 88,
  "soil_health": "Good",
  "soil_confidence": 88,
  "anomaly_detected": false,
  "predicted_yield": 4.2,
  "sha256_hash": "b9e2f1d3c5a7b8e4f2d9c1a6b3e8f4c2d7e1a5b9c4f3d8e2b7a1c6f9d3e8"
}
```

### Blockchain Records

#### Get All Blockchain Records
```
GET /blockchain_records?order=block_number.desc
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "block_number": 3,
    "previous_hash": "b9e2f1d3c5a7b8e4f2d9c1a6b3e8f4c2d7e1a5b9c4f3d8e2b7a1c6f9d3e8",
    "current_hash": "c1f3e5d7a9b2c4f6e8a1d3b5c7e9f2a4d6b8e1c3f5a7d9c2e4b6f8a1d3e5",
    "data_type": "Transaction",
    "data_id": "550e8400-e29b-41d4-a716-446655440002",
    "timestamp": "2025-11-20T14:30:00Z",
    "verified": true
  }
]
```

#### Create Blockchain Record
```
POST /blockchain_records
```

**Request Body:**
```json
{
  "block_number": 4,
  "previous_hash": "c1f3e5d7a9b2c4f6e8a1d3b5c7e9f2a4d6b8e1c3f5a7d9c2e4b6f8a1d3e5",
  "current_hash": "d2g4f6e8b1c3d5f7a9b1d3e5f7a9b1d3e5f7a9b1d3e5f7a9b1d3e5f7a9b1",
  "data_type": "Sensor Log",
  "data_id": "550e8400-e29b-41d4-a716-446655440005",
  "verified": true
}
```

### Market Listings

#### Get Available Markets
```
GET /market_listings?demand_level=eq.High&order=price_per_ton.desc
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "buyer_name": "Agro Traders Ltd.",
    "location": "Delhi",
    "crop_type": "Rice",
    "quantity_tons": 50,
    "price_per_ton": 45000,
    "demand_level": "High",
    "created_at": "2025-11-20T10:30:00Z"
  }
]
```

### Transactions

#### Get Farmer Transactions
```
GET /transactions?farmer_id=eq.550e8400-e29b-41d4-a716-446655440000&order=created_at.desc
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440007",
    "farmer_id": "550e8400-e29b-41d4-a716-446655440000",
    "market_listing_id": "550e8400-e29b-41d4-a716-446655440006",
    "quantity_tons": 10,
    "total_price": 450000,
    "status": "completed",
    "sha256_hash": "e3h5g7f9a1b2c4d6e8f1g3h5i7j9k1l3m5n7p9r1s3t5u7v9w1x3z5a7b9d1",
    "created_at": "2025-11-20T12:30:00Z"
  }
]
```

#### Create Transaction
```
POST /transactions
```

**Request Body:**
```json
{
  "farmer_id": "550e8400-e29b-41d4-a716-446655440000",
  "market_listing_id": "550e8400-e29b-41d4-a716-446655440006",
  "quantity_tons": 10,
  "total_price": 450000,
  "status": "pending",
  "sha256_hash": "e3h5g7f9a1b2c4d6e8f1g3h5i7j9k1l3m5n7p9r1s3t5u7v9w1x3z5a7b9d1"
}
```

## Query Parameters

### Filtering
```
GET /farmers?region=eq.North
GET /sensor_data?moisture=gt.40&moisture=lt.60
GET /market_listings?crop_type=ilike.%Rice%
```

### Pagination
```
GET /sensor_data?limit=10&offset=0
```

### Ordering
```
GET /blockchain_records?order=block_number.desc
GET /transactions?order=created_at.asc
```

### Selecting Columns
```
GET /farmers?select=id,name,email
```

## Cryptographic Functions

### Generate SHA-256 Hash

**JavaScript Client:**
```javascript
import { generateSHA256 } from './services/crypto';

const data = JSON.stringify(sensorData);
const hash = await generateSHA256(data);
```

### Verify Data Integrity

```javascript
const storedHash = sensorRecord.sha256_hash;
const computedHash = await generateSHA256(JSON.stringify(sensorData));
const isValid = storedHash === computedHash;
```

## ML Prediction Functions

### Get Crop Recommendation

**JavaScript Client:**
```javascript
import { predictCropRecommendation } from './services/mlModels';

const recommendation = predictCropRecommendation({
  ph: 6.8,
  temperature: 28,
  humidity: 62,
  moisture: 45,
  region: 'North'
});
// Returns: "Wheat" or "Rice" or "Cotton" etc.
```

### Get Irrigation Schedule

```javascript
import { predictIrrigation } from './services/mlModels';

const schedule = predictIrrigation({
  moisture: 45,
  temperature: 28,
  humidity: 62
});
// Returns: "Irrigate after 4 hours - 8 liters per plant"
```

### Analyze Soil Health

```javascript
import { analyzeSoilHealth } from './services/mlModels';

const health = analyzeSoilHealth({
  ph: 6.8,
  moisture: 45
});
// Returns: "Good" or "Moderate" or "Poor"
```

### Detect Anomalies

```javascript
import { detectAnomalies } from './services/mlModels';

const anomaly = detectAnomalies(currentReading, previousReading);
// Returns: true or false
```

### Generate Full Prediction

```javascript
import { generateFullPrediction } from './services/mlModels';

const prediction = generateFullPrediction(sensorInput, previousInput);
// Returns:
// {
//   recommendedCrop: "Basmati Rice",
//   cropConfidence: 90,
//   irrigationTime: "In 4 hours",
//   irrigationConfidence: 85,
//   soilHealth: "Good",
//   soilConfidence: 88,
//   anomalyDetected: false,
//   predictedYield: 4.2
// }
```

## Edge Functions

### Health Check
```
GET https://uxfnyzfkcduyjuyeqhhv.supabase.co/functions/v1/seed-demo-data
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Smart Agriculture Platform API is running",
  "timestamp": "2025-11-20T14:30:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "code": "22P02",
  "message": "invalid input syntax for type uuid"
}
```

### 401 Unauthorized
```json
{
  "code": "PGRST301",
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "code": "PGRST116",
  "message": "The requested resource was not found"
}
```

### 409 Conflict
```json
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint"
}
```

## Rate Limiting

- Default: 1000 requests/minute per IP
- Contact support for higher limits

## CORS Headers

All API responses include:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey
```

## Webhooks

Real-time updates available via Supabase subscriptions:

```javascript
const channel = supabase
  .channel('sensor_updates')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'sensor_data'
    },
    (payload) => {
      console.log('New sensor data:', payload.new)
    }
  )
  .subscribe()
```

## Best Practices

1. **Always validate data** before insertion
2. **Use SHA-256 hashing** for critical data
3. **Implement retry logic** for network errors
4. **Cache frequently accessed data** on client
5. **Batch requests** when possible
6. **Monitor API usage** and rate limits
7. **Use appropriate pagination** for large datasets
8. **Secure API keys** - never expose in client code

## Support

For API support:
- Email: support@agrochain.com
- Documentation: Available in project repository
- Issues: Report via GitHub issues
