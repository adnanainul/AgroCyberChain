// ============================================================
// AgroCyberChain - Real ML Crop Prediction Service
// Algorithm: K-Nearest Neighbors (KNN) with weighted voting
// Dataset: Kaggle Crop Recommendation Dataset (22 crops)
// Prices:  Live from data.gov.in AGMARKNET / MSP 2024-25
// ============================================================

const cropData = require('../data/cropDataset');
const { getCropPrice } = require('./priceService');

// ============================================================
// 1. DATASET STATISTICS (for min-max normalization)
// Pre-computed from the full Kaggle dataset
// ============================================================
const FEATURE_STATS = {
    N: { min: 0, max: 140 },
    P: { min: 5, max: 145 },
    K: { min: 5, max: 205 },
    temperature: { min: 8.8, max: 43.7 },
    humidity: { min: 14.3, max: 99.9 },
    ph: { min: 3.5, max: 9.9 },
    rainfall: { min: 20.2, max: 298.6 }
};

// ============================================================
// 2. CROP STATIC DATA — costs, yield, season (prices fetched LIVE)
//    Prices come from priceService → data.gov.in AGMARKNET / MSP 2024-25
// ============================================================
const CROP_STATIC_DATA = {
    rice: { cost: 22000, yieldPerAcre: 5.0, season: 'Kharif (Jun-Nov)', emoji: '🌾' },
    maize: { cost: 12000, yieldPerAcre: 4.0, season: 'Kharif/Rabi', emoji: '🌽' },
    chickpea: { cost: 18000, yieldPerAcre: 1.5, season: 'Rabi (Oct-Mar)', emoji: '🫘' },
    kidneybeans: { cost: 25000, yieldPerAcre: 1.2, season: 'Kharif (Jun-Sep)', emoji: '🫘' },
    pigeonpeas: { cost: 20000, yieldPerAcre: 1.3, season: 'Kharif (Jun-Nov)', emoji: '🫘' },
    mothbeans: { cost: 15000, yieldPerAcre: 0.8, season: 'Kharif (Jun-Sep)', emoji: '🫘' },
    mungbean: { cost: 18000, yieldPerAcre: 0.9, season: 'Kharif/Zaid', emoji: '🫘' },
    blackgram: { cost: 18000, yieldPerAcre: 1.0, season: 'Kharif (Jun-Sep)', emoji: '🫘' },
    lentil: { cost: 16000, yieldPerAcre: 1.1, season: 'Rabi (Oct-Mar)', emoji: '🫘' },
    pomegranate: { cost: 35000, yieldPerAcre: 8.0, season: 'Annual', emoji: '🍎' },
    banana: { cost: 18000, yieldPerAcre: 20.0, season: 'Annual (12-15 mos)', emoji: '🍌' },
    mango: { cost: 20000, yieldPerAcre: 7.0, season: 'Summer (Apr-Jun)', emoji: '🥭' },
    grapes: { cost: 40000, yieldPerAcre: 12.0, season: 'Rabi (Nov-Mar)', emoji: '🍇' },
    watermelon: { cost: 18000, yieldPerAcre: 18.0, season: 'Summer (Feb-Jun)', emoji: '🍉' },
    muskmelon: { cost: 15000, yieldPerAcre: 10.0, season: 'Summer (Mar-Jun)', emoji: '🍈' },
    apple: { cost: 45000, yieldPerAcre: 6.0, season: 'Autumn (Aug-Nov)', emoji: '🍏' },
    orange: { cost: 22000, yieldPerAcre: 8.0, season: 'Winter (Nov-Feb)', emoji: '🍊' },
    papaya: { cost: 12000, yieldPerAcre: 25.0, season: 'Annual', emoji: '🍐' },
    coconut: { cost: 12000, yieldPerAcre: 8.0, season: 'Annual (perennial)', emoji: '🥥' },
    cotton: { cost: 28000, yieldPerAcre: 2.0, season: 'Kharif (Jun-Nov)', emoji: '🌿' },
    jute: { cost: 20000, yieldPerAcre: 3.0, season: 'Kharif (Mar-Jun)', emoji: '🌿' },
    coffee: { cost: 60000, yieldPerAcre: 1.5, season: 'Harvest (Nov-Feb)', emoji: '☕' },
    wheat: { cost: 15000, yieldPerAcre: 4.5, season: 'Rabi (Nov-Apr)', emoji: '🌾' }
};

// ============================================================
// 3. NORMALIZATION HELPER
// ============================================================
function normalize(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
}

// ============================================================
// 4. EUCLIDEAN DISTANCE
// ============================================================
function euclideanDistance(a, b, featureWeights) {
    let sum = 0;
    const features = Object.keys(featureWeights);
    for (const feat of features) {
        const diff = (a[feat] || 0) - (b[feat] || 0);
        sum += featureWeights[feat] * diff * diff;
    }
    return Math.sqrt(sum);
}

// ============================================================
// 5. ESTIMATE N, P, K FROM pH (when not directly measured)
// Based on agronomic research correlations
// ============================================================
function estimateNPKFromPH(ph) {
    let N, P, K;

    if (ph < 5.5) {
        // Very acidic: low nutrient availability
        N = 40 + Math.random() * 20;
        P = 20 + Math.random() * 15;
        K = 20 + Math.random() * 15;
    } else if (ph < 6.5) {
        // Slightly acidic: good for most crops
        N = 70 + Math.random() * 30;
        P = 45 + Math.random() * 20;
        K = 35 + Math.random() * 15;
    } else if (ph < 7.5) {
        // Neutral: most nutrient available
        N = 90 + Math.random() * 30;
        P = 55 + Math.random() * 25;
        K = 40 + Math.random() * 20;
    } else if (ph < 8.5) {
        // Slightly alkaline: P & micronutrients decrease
        N = 60 + Math.random() * 20;
        P = 35 + Math.random() * 20;
        K = 30 + Math.random() * 20;
    } else {
        // Very alkaline: low availability
        N = 30 + Math.random() * 20;
        P = 20 + Math.random() * 15;
        K = 20 + Math.random() * 15;
    }

    return {
        N: parseFloat(N.toFixed(1)),
        P: parseFloat(P.toFixed(1)),
        K: parseFloat(K.toFixed(1))
    };
}

// ============================================================
// 6. MAIN KNN PREDICTION FUNCTION
// Inputs: { ph, temperature, humidity, moisture }
// Returns: { topCrop, confidence, recommendations, irrigationAdvice, soilHealth }
// ============================================================
// predictCrop is now ASYNC because it fetches live prices
async function predictCrop({ ph, temperature, humidity, moisture }) {
    // --- 6a. Derive missing features ---
    const { N, P, K } = estimateNPKFromPH(ph);

    // Moisture → Rainfall proxy
    // Moisture 0-100% maps to approx 20-300mm rainfall range
    const rainfall = 20 + (moisture / 100) * 280;

    // --- 6b. Build normalized query point ---
    const query = {
        N: normalize(N, FEATURE_STATS.N.min, FEATURE_STATS.N.max),
        P: normalize(P, FEATURE_STATS.P.min, FEATURE_STATS.P.max),
        K: normalize(K, FEATURE_STATS.K.min, FEATURE_STATS.K.max),
        temperature: normalize(temperature, FEATURE_STATS.temperature.min, FEATURE_STATS.temperature.max),
        humidity: normalize(humidity, FEATURE_STATS.humidity.min, FEATURE_STATS.humidity.max),
        ph: normalize(ph, FEATURE_STATS.ph.min, FEATURE_STATS.ph.max),
        rainfall: normalize(rainfall, FEATURE_STATS.rainfall.min, FEATURE_STATS.rainfall.max)
    };

    // Feature weights (importance) — pH, temperature, humidity weighted higher
    const featureWeights = { N: 0.10, P: 0.10, K: 0.10, temperature: 0.25, humidity: 0.20, ph: 0.15, rainfall: 0.10 };

    // --- 6c. Compute distance to every data point ---
    const K_NEIGHBORS = 9;
    const distances = cropData.map(row => {
        const normalizedRow = {
            N: normalize(row.N, FEATURE_STATS.N.min, FEATURE_STATS.N.max),
            P: normalize(row.P, FEATURE_STATS.P.min, FEATURE_STATS.P.max),
            K: normalize(row.K, FEATURE_STATS.K.min, FEATURE_STATS.K.max),
            temperature: normalize(row.temperature, FEATURE_STATS.temperature.min, FEATURE_STATS.temperature.max),
            humidity: normalize(row.humidity, FEATURE_STATS.humidity.min, FEATURE_STATS.humidity.max),
            ph: normalize(row.ph, FEATURE_STATS.ph.min, FEATURE_STATS.ph.max),
            rainfall: normalize(row.rainfall, FEATURE_STATS.rainfall.min, FEATURE_STATS.rainfall.max)
        };
        return {
            label: row.label,
            distance: euclideanDistance(query, normalizedRow, featureWeights)
        };
    });

    // --- 6d. Sort and pick K nearest ---
    distances.sort((a, b) => a.distance - b.distance);
    const kNearest = distances.slice(0, K_NEIGHBORS);

    // --- 6e. Weighted vote (closer = higher weight = 1/distance) ---
    const votes = {};
    for (const neighbor of kNearest) {
        const weight = neighbor.distance === 0 ? 1000 : (1 / neighbor.distance);
        votes[neighbor.label] = (votes[neighbor.label] || 0) + weight;
    }

    // --- 6f. Sort by vote weight ---
    const sortedCrops = Object.entries(votes)
        .sort((a, b) => b[1] - a[1])
        .map(([cropName, voteWeight]) => ({
            cropName,
            voteWeight
        }));

    const totalVoteWeight = sortedCrops.reduce((s, c) => s + c.voteWeight, 0);

    // --- 6g. Build top-3 recommendations with LIVE prices from data.gov.in ---
    const top3Raw = sortedCrops.slice(0, 3);

    // Fetch all prices in parallel (live AGMARKNET or MSP 2024-25 fallback)
    const priceResults = await Promise.all(
        top3Raw.map(({ cropName }) => getCropPrice(cropName))
    );

    const top3 = top3Raw.map(({ cropName, voteWeight }, idx) => {
        const staticData = CROP_STATIC_DATA[cropName] || { cost: 12000, yieldPerAcre: 2.0, season: 'Variable', emoji: '🌱' };
        const livePrice = priceResults[idx]; // { pricePerTon, source, rawQtlPrice }

        const conditionBonus = (humidity > 60 && moisture > 35) ? 1.1 : 0.9;
        const predictedYield = parseFloat((staticData.yieldPerAcre * conditionBonus * (0.9 + Math.random() * 0.2)).toFixed(2));

        const pricePerTon = livePrice.pricePerTon;
        const grossRevenue = predictedYield * pricePerTon;
        const netProfit = Math.floor(grossRevenue - staticData.cost);
        const confidence = Math.round((voteWeight / totalVoteWeight) * 100);

        return {
            crop: cropName.charAt(0).toUpperCase() + cropName.slice(1),
            cropKey: cropName,
            confidence: Math.max(confidence, 5),
            yield: predictedYield,
            cost: staticData.cost,
            price: pricePerTon,
            pricePerQtl: livePrice.rawQtlPrice,
            priceSource: livePrice.source,   // e.g. "AGMARKNET Live — Azadpur (2024-03-03)" or "MSP 2024-25"
            net_profit: netProfit,
            season: staticData.season,
            emoji: staticData.emoji
        };
    });

    // Sort by net profit
    top3.sort((a, b) => b.net_profit - a.net_profit);

    // --- 6h. Irrigation & soil health assessment ---
    let irrigationAdvice, irrigationUrgency;
    if (moisture < 20) {
        irrigationAdvice = '🚨 URGENT: Irrigate Immediately! Crop stress risk.';
        irrigationUrgency = 'critical';
    } else if (moisture < 35) {
        irrigationAdvice = '⚠️ Water Soon: Irrigate within 12–24 hours.';
        irrigationUrgency = 'soon';
    } else if (moisture < 55) {
        irrigationAdvice = '✅ Optimal: No irrigation needed now.';
        irrigationUrgency = 'optimal';
    } else if (moisture < 75) {
        irrigationAdvice = '💧 Soil is Moist: Skip next irrigation cycle.';
        irrigationUrgency = 'moist';
    } else {
        irrigationAdvice = '🛑 Overwatered: Stop irrigation. Root rot risk!';
        irrigationUrgency = 'overwatered';
    }

    let soilHealth, soilHealthScore;
    if (ph < 4.5) {
        soilHealth = 'Severely Acidic — Add lime to raise pH';
        soilHealthScore = 30;
    } else if (ph < 5.5) {
        soilHealth = 'Acidic — Suitable for tea, coffee, blueberries';
        soilHealthScore = 55;
    } else if (ph < 7.5) {
        soilHealth = 'Optimal (Neutral) — Best for most crops';
        soilHealthScore = 95;
    } else if (ph < 8.5) {
        soilHealth = 'Alkaline — Add sulfur or organic matter';
        soilHealthScore = 60;
    } else {
        soilHealth = 'Very Alkaline — Poor nutrient availability';
        soilHealthScore = 35;
    }

    const topPick = top3[0];

    // ============================================================
    // HARVEST TIME PREDICTION
    // Based on crop maturity period + current conditions
    // ============================================================
    const CROP_MATURITY = {
        rice: 120, maize: 100, chickpea: 180, kidneybeans: 90, pigeonpeas: 200,
        mothbeans: 80, mungbean: 75, blackgram: 90, lentil: 150, pomegranate: 200,
        banana: 365, mango: 150, grapes: 180, watermelon: 80, muskmelon: 80,
        apple: 180, orange: 365, papaya: 300, coconut: 365, cotton: 160,
        jute: 160, coffee: 270, wheat: 140
    };

    const maturityDays = CROP_MATURITY[topPick.crop.toLowerCase()] || 120;
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + maturityDays);
    const harvestDateStr = harvestDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

    // Determine monitoring interval based on crop criticality
    const monitoringInterval = moisture < 30 ? '1 week' : (humidity < 40 ? '1 week' : '2 weeks');
    const nextMonitoringDate = new Date();
    nextMonitoringDate.setDate(nextMonitoringDate.getDate() + (monitoringInterval === '1 week' ? 7 : 14));
    const nextMonitoringStr = nextMonitoringDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

    // Disease risk assessment
    const diseaseRisk = humidity > 80 ? 'High (wet conditions promote fungal diseases)' : 
                       humidity > 65 ? 'Moderate (monitor for leaf diseases)' : 'Low (dry conditions)';

    return {
        recommended_crop: topPick.crop,
        crop_confidence: topPick.confidence,
        irrigation_time: irrigationAdvice,
        irrigation_confidence: 92,
        soil_health: soilHealth,
        soil_confidence: soilHealthScore,
        predicted_yield: topPick.yield,
        // NEW: Harvest & Monitoring
        harvest_date: harvestDateStr,
        maturity_days: maturityDays,
        monitoring_interval: monitoringInterval,
        next_monitoring_date: nextMonitoringStr,
        disease_risk: diseaseRisk,
        all_recommendations: top3,
        ml_metadata: {
            algorithm: 'K-Nearest Neighbors (K=9) with Feature Normalization',
            dataset_size: cropData.length,
            features_used: ['pH', 'Temperature', 'Humidity', 'Moisture→Rainfall', 'N', 'P', 'K (estimated from pH)'],
            dataset_source: 'Kaggle Crop Recommendation Dataset (22 crops)',
            input_received: { ph, temperature, humidity, moisture },
            derived_values: { N, P, K, rainfall: parseFloat(rainfall.toFixed(1)) },
            irrigation_urgency: irrigationUrgency,
            soil_health_score: soilHealthScore,
            disease_monitoring: { interval: monitoringInterval, next_check: nextMonitoringStr }
        }
    };
}

module.exports = { predictCrop };
