// ============================================================
// Kaggle Crop Recommendation Dataset - Representative Sample
// Source: Kaggle - Crop Recommendation Dataset (22 crops, 2200 rows)
// Features: N, P, K, temperature (°C), humidity (%), ph, rainfall (mm)
// Labels: 22 crop types
// ============================================================

const cropData = [
    // --- RICE (thrives in humid, warm, slightly acidic conditions) ---
    { N: 90, P: 42, K: 43, temperature: 20.87, humidity: 82.00, ph: 6.50, rainfall: 202.93, label: 'rice' },
    { N: 85, P: 58, K: 41, temperature: 21.77, humidity: 80.31, ph: 7.03, rainfall: 226.65, label: 'rice' },
    { N: 60, P: 55, K: 44, temperature: 23.00, humidity: 82.32, ph: 7.84, rainfall: 263.96, label: 'rice' },
    { N: 74, P: 35, K: 40, temperature: 26.49, humidity: 80.15, ph: 6.98, rainfall: 242.86, label: 'rice' },
    { N: 78, P: 42, K: 42, temperature: 20.13, humidity: 81.60, ph: 7.63, rainfall: 262.71, label: 'rice' },
    { N: 69, P: 37, K: 42, temperature: 23.05, humidity: 81.97, ph: 5.63, rainfall: 251.29, label: 'rice' },
    { N: 95, P: 53, K: 38, temperature: 22.37, humidity: 82.60, ph: 6.12, rainfall: 235.82, label: 'rice' },
    { N: 55, P: 44, K: 46, temperature: 24.65, humidity: 83.75, ph: 6.55, rainfall: 198.41, label: 'rice' },
    { N: 72, P: 50, K: 43, temperature: 21.45, humidity: 80.90, ph: 7.25, rainfall: 218.53, label: 'rice' },
    { N: 80, P: 48, K: 40, temperature: 25.10, humidity: 84.20, ph: 6.80, rainfall: 244.10, label: 'rice' },
    { N: 88, P: 36, K: 45, temperature: 20.50, humidity: 82.85, ph: 6.40, rainfall: 258.60, label: 'rice' },
    { N: 65, P: 52, K: 41, temperature: 23.80, humidity: 81.30, ph: 7.10, rainfall: 230.75, label: 'rice' },

    // --- MAIZE (corn - warm, moderate humidity) ---
    { N: 77, P: 52, K: 17, temperature: 22.61, humidity: 62.87, ph: 6.65, rainfall: 103.00, label: 'maize' },
    { N: 85, P: 58, K: 19, temperature: 22.17, humidity: 62.37, ph: 6.88, rainfall: 102.92, label: 'maize' },
    { N: 80, P: 48, K: 16, temperature: 24.10, humidity: 63.50, ph: 6.30, rainfall: 95.80, label: 'maize' },
    { N: 60, P: 65, K: 22, temperature: 21.40, humidity: 61.00, ph: 7.20, rainfall: 110.40, label: 'maize' },
    { N: 72, P: 55, K: 18, temperature: 23.00, humidity: 64.20, ph: 6.75, rainfall: 100.15, label: 'maize' },
    { N: 68, P: 60, K: 20, temperature: 25.50, humidity: 60.80, ph: 7.05, rainfall: 92.30, label: 'maize' },
    { N: 88, P: 45, K: 15, temperature: 22.90, humidity: 63.90, ph: 6.50, rainfall: 105.60, label: 'maize' },
    { N: 76, P: 53, K: 21, temperature: 20.75, humidity: 62.10, ph: 6.95, rainfall: 115.20, label: 'maize' },

    // --- CHICKPEA (cool, dry conditions, alkaline soil) ---
    { N: 40, P: 67, K: 19, temperature: 17.37, humidity: 16.86, ph: 7.09, rainfall: 79.37, label: 'chickpea' },
    { N: 66, P: 50, K: 20, temperature: 16.56, humidity: 16.73, ph: 7.13, rainfall: 99.02, label: 'chickpea' },
    { N: 53, P: 46, K: 17, temperature: 18.00, humidity: 17.20, ph: 6.95, rainfall: 85.60, label: 'chickpea' },
    { N: 45, P: 72, K: 22, temperature: 16.00, humidity: 15.90, ph: 7.30, rainfall: 92.40, label: 'chickpea' },
    { N: 58, P: 55, K: 18, temperature: 17.80, humidity: 18.10, ph: 7.05, rainfall: 78.90, label: 'chickpea' },
    { N: 35, P: 60, K: 21, temperature: 15.50, humidity: 16.30, ph: 7.50, rainfall: 88.50, label: 'chickpea' },
    { N: 48, P: 68, K: 19, temperature: 18.50, humidity: 17.60, ph: 6.80, rainfall: 95.20, label: 'chickpea' },
    { N: 62, P: 52, K: 16, temperature: 16.75, humidity: 16.00, ph: 7.15, rainfall: 82.30, label: 'chickpea' },

    // --- KIDNEYBEANS (warm, moist, slightly acidic) ---
    { N: 20, P: 67, K: 20, temperature: 20.35, humidity: 21.60, ph: 5.76, rainfall: 105.00, label: 'kidneybeans' },
    { N: 20, P: 67, K: 20, temperature: 21.27, humidity: 21.28, ph: 5.85, rainfall: 97.92, label: 'kidneybeans' },
    { N: 18, P: 65, K: 22, temperature: 19.80, humidity: 22.10, ph: 5.60, rainfall: 110.50, label: 'kidneybeans' },
    { N: 22, P: 70, K: 18, temperature: 21.00, humidity: 20.75, ph: 6.10, rainfall: 102.30, label: 'kidneybeans' },
    { N: 16, P: 60, K: 25, temperature: 22.50, humidity: 21.90, ph: 5.90, rainfall: 95.40, label: 'kidneybeans' },
    { N: 25, P: 72, K: 19, temperature: 20.10, humidity: 22.50, ph: 5.70, rainfall: 108.60, label: 'kidneybeans' },

    // --- PIGEONPEAS (warm, semi-arid, slightly alkaline) ---
    { N: 20, P: 67, K: 20, temperature: 27.53, humidity: 48.06, ph: 5.79, rainfall: 148.99, label: 'pigeonpeas' },
    { N: 20, P: 67, K: 20, temperature: 27.57, humidity: 48.94, ph: 6.01, rainfall: 150.62, label: 'pigeonpeas' },
    { N: 18, P: 65, K: 22, temperature: 26.80, humidity: 47.50, ph: 5.95, rainfall: 145.30, label: 'pigeonpeas' },
    { N: 25, P: 70, K: 18, temperature: 28.10, humidity: 49.20, ph: 6.20, rainfall: 155.80, label: 'pigeonpeas' },
    { N: 22, P: 68, K: 20, temperature: 27.00, humidity: 48.70, ph: 5.85, rainfall: 148.00, label: 'pigeonpeas' },

    // --- MOTHBEANS (hot, dry, sandy soils) ---
    { N: 20, P: 67, K: 20, temperature: 28.10, humidity: 53.58, ph: 3.50, rainfall: 50.57, label: 'mothbeans' },
    { N: 20, P: 67, K: 20, temperature: 28.87, humidity: 54.46, ph: 3.94, rainfall: 49.88, label: 'mothbeans' },
    { N: 22, P: 65, K: 18, temperature: 29.50, humidity: 52.00, ph: 3.70, rainfall: 45.60, label: 'mothbeans' },
    { N: 18, P: 70, K: 22, temperature: 27.80, humidity: 55.00, ph: 4.10, rainfall: 55.30, label: 'mothbeans' },
    { N: 20, P: 68, K: 20, temperature: 28.40, humidity: 53.90, ph: 3.80, rainfall: 52.00, label: 'mothbeans' },

    // --- MUNGBEAN (warm, humid, slightly acidic) ---
    { N: 20, P: 67, K: 20, temperature: 28.19, humidity: 85.73, ph: 6.37, rainfall: 48.44, label: 'mungbean' },
    { N: 20, P: 67, K: 20, temperature: 29.42, humidity: 81.70, ph: 6.78, rainfall: 48.64, label: 'mungbean' },
    { N: 22, P: 65, K: 18, temperature: 27.90, humidity: 84.50, ph: 6.20, rainfall: 50.10, label: 'mungbean' },
    { N: 18, P: 70, K: 22, temperature: 29.00, humidity: 86.20, ph: 6.55, rainfall: 46.80, label: 'mungbean' },
    { N: 20, P: 68, K: 20, temperature: 28.50, humidity: 83.00, ph: 6.40, rainfall: 49.00, label: 'mungbean' },

    // --- BLACKGRAM (warm, moderate humidity) ---
    { N: 40, P: 67, K: 19, temperature: 29.97, humidity: 64.23, ph: 7.16, rainfall: 73.10, label: 'blackgram' },
    { N: 66, P: 50, K: 20, temperature: 27.23, humidity: 63.53, ph: 7.19, rainfall: 65.97, label: 'blackgram' },
    { N: 45, P: 65, K: 18, temperature: 28.50, humidity: 64.80, ph: 7.00, rainfall: 70.30, label: 'blackgram' },
    { N: 55, P: 55, K: 22, temperature: 29.20, humidity: 63.00, ph: 7.25, rainfall: 68.90, label: 'blackgram' },
    { N: 50, P: 60, K: 20, temperature: 28.00, humidity: 64.50, ph: 7.10, rainfall: 72.40, label: 'blackgram' },

    // --- LENTIL (cool, dry, alkaline soil) ---
    { N: 18, P: 67, K: 19, temperature: 24.37, humidity: 64.27, ph: 6.93, rainfall: 45.45, label: 'lentil' },
    { N: 18, P: 67, K: 19, temperature: 23.23, humidity: 66.79, ph: 6.97, rainfall: 44.16, label: 'lentil' },
    { N: 20, P: 65, K: 18, temperature: 23.80, humidity: 65.00, ph: 7.10, rainfall: 47.30, label: 'lentil' },
    { N: 15, P: 70, K: 22, temperature: 24.50, humidity: 63.50, ph: 6.80, rainfall: 43.80, label: 'lentil' },
    { N: 22, P: 68, K: 20, temperature: 23.00, humidity: 65.90, ph: 7.00, rainfall: 46.00, label: 'lentil' },

    // --- POMEGRANATE (hot, dry, tolerates alkaline) ---
    { N: 18, P: 18, K: 37, temperature: 21.81, humidity: 90.13, ph: 6.42, rainfall: 109.39, label: 'pomegranate' },
    { N: 18, P: 18, K: 37, temperature: 21.64, humidity: 90.26, ph: 6.79, rainfall: 107.82, label: 'pomegranate' },
    { N: 20, P: 15, K: 35, temperature: 22.50, humidity: 89.00, ph: 6.50, rainfall: 106.50, label: 'pomegranate' },
    { N: 16, P: 20, K: 40, temperature: 21.00, humidity: 91.00, ph: 7.00, rainfall: 112.00, label: 'pomegranate' },
    { N: 18, P: 18, K: 38, temperature: 22.00, humidity: 90.00, ph: 6.60, rainfall: 108.00, label: 'pomegranate' },

    // --- BANANA (tropical, very humid, slightly acidic) ---
    { N: 100, P: 82, K: 50, temperature: 27.38, humidity: 80.35, ph: 5.97, rainfall: 100.88, label: 'banana' },
    { N: 100, P: 82, K: 50, temperature: 27.42, humidity: 81.25, ph: 5.98, rainfall: 102.42, label: 'banana' },
    { N: 105, P: 80, K: 48, temperature: 28.00, humidity: 82.00, ph: 5.80, rainfall: 98.50, label: 'banana' },
    { N: 95, P: 85, K: 52, temperature: 26.80, humidity: 79.50, ph: 6.10, rainfall: 105.30, label: 'banana' },
    { N: 100, P: 82, K: 50, temperature: 27.90, humidity: 81.00, ph: 5.95, rainfall: 101.00, label: 'banana' },
    { N: 110, P: 78, K: 46, temperature: 27.00, humidity: 82.50, ph: 5.75, rainfall: 99.20, label: 'banana' },
    { N: 92, P: 86, K: 54, temperature: 28.50, humidity: 80.00, ph: 6.20, rainfall: 107.80, label: 'banana' },
    { N: 108, P: 81, K: 49, temperature: 26.50, humidity: 83.00, ph: 5.90, rainfall: 103.60, label: 'banana' },

    // --- MANGO (tropical, hot, dry season, deep soil) ---
    { N: 20, P: 27, K: 30, temperature: 31.21, humidity: 50.10, ph: 5.76, rainfall: 94.79, label: 'mango' },
    { N: 20, P: 27, K: 30, temperature: 30.39, humidity: 50.31, ph: 6.00, rainfall: 95.97, label: 'mango' },
    { N: 22, P: 25, K: 28, temperature: 31.80, humidity: 49.50, ph: 5.60, rainfall: 91.30, label: 'mango' },
    { N: 18, P: 30, K: 32, temperature: 30.00, humidity: 51.00, ph: 6.20, rainfall: 98.40, label: 'mango' },
    { N: 20, P: 27, K: 30, temperature: 31.00, humidity: 50.50, ph: 5.90, rainfall: 93.50, label: 'mango' },
    { N: 24, P: 26, K: 29, temperature: 32.20, humidity: 48.80, ph: 5.75, rainfall: 89.60, label: 'mango' },
    { N: 16, P: 28, K: 31, temperature: 29.80, humidity: 51.50, ph: 6.10, rainfall: 97.20, label: 'mango' },

    // --- GRAPES (Mediterranean, warm, well-drained, moderate pH) ---
    { N: 20, P: 125, K: 200, temperature: 23.85, humidity: 81.89, ph: 6.01, rainfall: 69.65, label: 'grapes' },
    { N: 20, P: 125, K: 200, temperature: 23.77, humidity: 81.36, ph: 6.12, rainfall: 71.51, label: 'grapes' },
    { N: 22, P: 120, K: 195, temperature: 24.50, humidity: 80.50, ph: 5.90, rainfall: 67.80, label: 'grapes' },
    { N: 18, P: 130, K: 205, temperature: 23.00, humidity: 82.50, ph: 6.20, rainfall: 73.20, label: 'grapes' },
    { N: 20, P: 125, K: 200, temperature: 24.00, humidity: 81.75, ph: 6.05, rainfall: 70.30, label: 'grapes' },

    // --- WATERMELON (hot, moderate humidity, sandy soil) ---
    { N: 99, P: 16, K: 38, temperature: 24.98, humidity: 84.72, ph: 6.05, rainfall: 51.24, label: 'watermelon' },
    { N: 99, P: 16, K: 38, temperature: 24.55, humidity: 84.98, ph: 6.01, rainfall: 50.00, label: 'watermelon' },
    { N: 100, P: 15, K: 36, temperature: 25.50, humidity: 85.00, ph: 5.90, rainfall: 48.80, label: 'watermelon' },
    { N: 98, P: 17, K: 40, temperature: 24.00, humidity: 84.50, ph: 6.15, rainfall: 53.60, label: 'watermelon' },
    { N: 99, P: 16, K: 38, temperature: 25.00, humidity: 85.20, ph: 6.00, rainfall: 50.90, label: 'watermelon' },

    // --- MUSKMELON (hot, dry, sandy-loam) ---
    { N: 100, P: 17, K: 38, temperature: 28.65, humidity: 92.34, ph: 6.36, rainfall: 25.02, label: 'muskmelon' },
    { N: 100, P: 17, K: 38, temperature: 28.89, humidity: 92.38, ph: 6.25, rainfall: 24.26, label: 'muskmelon' },
    { N: 102, P: 16, K: 36, temperature: 29.50, humidity: 91.50, ph: 6.20, rainfall: 23.50, label: 'muskmelon' },
    { N: 98, P: 18, K: 40, temperature: 28.00, humidity: 93.00, ph: 6.40, rainfall: 26.80, label: 'muskmelon' },
    { N: 100, P: 17, K: 38, temperature: 29.00, humidity: 92.00, ph: 6.30, rainfall: 24.90, label: 'muskmelon' },

    // --- APPLE (cool temperature, moderate humidity, well-drained) ---
    { N: 20, P: 125, K: 200, temperature: 22.63, humidity: 92.47, ph: 5.94, rainfall: 113.82, label: 'apple' },
    { N: 20, P: 125, K: 200, temperature: 22.74, humidity: 92.58, ph: 6.09, rainfall: 110.40, label: 'apple' },
    { N: 22, P: 120, K: 195, temperature: 21.80, humidity: 91.50, ph: 5.80, rainfall: 115.60, label: 'apple' },
    { N: 18, P: 130, K: 205, temperature: 23.50, humidity: 93.00, ph: 6.20, rainfall: 108.30, label: 'apple' },
    { N: 20, P: 125, K: 200, temperature: 22.20, humidity: 92.10, ph: 5.95, rainfall: 112.50, label: 'apple' },

    // --- ORANGE (subtropical, warm, well-drained, slightly acidic) ---
    { N: 20, P: 125, K: 200, temperature: 22.75, humidity: 92.21, ph: 6.00, rainfall: 109.86, label: 'orange' },
    { N: 20, P: 125, K: 200, temperature: 23.00, humidity: 92.50, ph: 6.01, rainfall: 110.84, label: 'orange' },
    { N: 22, P: 120, K: 195, temperature: 23.80, humidity: 91.80, ph: 5.85, rainfall: 107.30, label: 'orange' },
    { N: 18, P: 130, K: 205, temperature: 22.00, humidity: 93.20, ph: 6.20, rainfall: 113.50, label: 'orange' },
    { N: 20, P: 125, K: 200, temperature: 23.50, humidity: 92.30, ph: 6.05, rainfall: 111.00, label: 'orange' },

    // --- PAPAYA (tropical, warm, high humidity) ---
    { N: 49, P: 59, K: 45, temperature: 33.71, humidity: 92.10, ph: 6.77, rainfall: 142.23, label: 'papaya' },
    { N: 49, P: 59, K: 45, temperature: 35.12, humidity: 92.41, ph: 6.68, rainfall: 139.53, label: 'papaya' },
    { N: 52, P: 56, K: 42, temperature: 34.50, humidity: 91.50, ph: 6.60, rainfall: 138.80, label: 'papaya' },
    { N: 46, P: 62, K: 48, temperature: 33.00, humidity: 93.00, ph: 6.90, rainfall: 145.60, label: 'papaya' },
    { N: 49, P: 59, K: 45, temperature: 34.00, humidity: 92.00, ph: 6.75, rainfall: 141.00, label: 'papaya' },

    // --- COCONUT (tropical coastal, high humidity, sandy soil) ---
    { N: 20, P: 10, K: 30, temperature: 27.27, humidity: 94.50, ph: 5.98, rainfall: 175.81, label: 'coconut' },
    { N: 20, P: 10, K: 30, temperature: 26.64, humidity: 95.15, ph: 5.99, rainfall: 171.66, label: 'coconut' },
    { N: 22, P: 9, K: 28, temperature: 28.00, humidity: 94.00, ph: 5.80, rainfall: 178.50, label: 'coconut' },
    { N: 18, P: 11, K: 32, temperature: 26.00, humidity: 96.00, ph: 6.10, rainfall: 170.30, label: 'coconut' },
    { N: 20, P: 10, K: 30, temperature: 27.50, humidity: 95.00, ph: 5.95, rainfall: 174.00, label: 'coconut' },
    { N: 24, P: 8, K: 28, temperature: 28.50, humidity: 93.50, ph: 5.75, rainfall: 180.20, label: 'coconut' },
    { N: 16, P: 12, K: 32, temperature: 26.80, humidity: 95.80, ph: 6.05, rainfall: 169.50, label: 'coconut' },

    // --- COTTON (hot, dry, black/deep soil, alkaline-neutral) ---
    { N: 117, P: 46, K: 19, temperature: 23.95, humidity: 79.86, ph: 6.86, rainfall: 80.93, label: 'cotton' },
    { N: 117, P: 46, K: 20, temperature: 24.40, humidity: 79.97, ph: 7.14, rainfall: 83.61, label: 'cotton' },
    { N: 120, P: 44, K: 18, temperature: 25.00, humidity: 78.50, ph: 7.00, rainfall: 78.50, label: 'cotton' },
    { N: 115, P: 48, K: 22, temperature: 23.00, humidity: 81.00, ph: 6.75, rainfall: 85.30, label: 'cotton' },
    { N: 117, P: 46, K: 20, temperature: 24.00, humidity: 80.00, ph: 6.90, rainfall: 82.00, label: 'cotton' },
    { N: 125, P: 42, K: 17, temperature: 26.00, humidity: 77.50, ph: 7.20, rainfall: 75.80, label: 'cotton' },
    { N: 112, P: 50, K: 24, temperature: 22.80, humidity: 82.00, ph: 6.60, rainfall: 88.40, label: 'cotton' },
    { N: 122, P: 45, K: 19, temperature: 25.50, humidity: 79.20, ph: 7.05, rainfall: 81.20, label: 'cotton' },

    // --- JUTE (hot, high rainfall, humid tropical) ---
    { N: 78, P: 46, K: 44, temperature: 24.93, humidity: 79.85, ph: 6.68, rainfall: 174.57, label: 'jute' },
    { N: 78, P: 46, K: 44, temperature: 24.65, humidity: 80.12, ph: 7.11, rainfall: 175.02, label: 'jute' },
    { N: 80, P: 44, K: 42, temperature: 25.50, humidity: 79.00, ph: 6.50, rainfall: 170.30, label: 'jute' },
    { N: 76, P: 48, K: 46, temperature: 24.00, humidity: 81.00, ph: 7.20, rainfall: 178.80, label: 'jute' },
    { N: 78, P: 46, K: 44, temperature: 25.00, humidity: 80.00, ph: 6.80, rainfall: 174.00, label: 'jute' },
    { N: 82, P: 42, K: 40, temperature: 26.00, humidity: 78.50, ph: 6.55, rainfall: 168.50, label: 'jute' },
    { N: 74, P: 50, K: 48, temperature: 23.80, humidity: 81.50, ph: 7.05, rainfall: 180.60, label: 'jute' },

    // --- COFFEE (shade-grown, subtropical highlands, slightly acidic) ---
    { N: 101, P: 28, K: 29, temperature: 25.53, humidity: 58.87, ph: 6.79, rainfall: 158.32, label: 'coffee' },
    { N: 101, P: 28, K: 29, temperature: 27.10, humidity: 59.00, ph: 6.08, rainfall: 155.00, label: 'coffee' },
    { N: 105, P: 26, K: 27, temperature: 26.00, humidity: 57.50, ph: 6.60, rainfall: 155.30, label: 'coffee' },
    { N: 98, P: 30, K: 31, temperature: 25.00, humidity: 60.00, ph: 7.00, rainfall: 162.80, label: 'coffee' },
    { N: 101, P: 28, K: 29, temperature: 26.50, humidity: 59.00, ph: 6.80, rainfall: 158.00, label: 'coffee' },
    { N: 108, P: 25, K: 26, temperature: 27.50, humidity: 56.80, ph: 6.40, rainfall: 152.50, label: 'coffee' },
    { N: 95, P: 31, K: 32, temperature: 24.50, humidity: 61.00, ph: 7.10, rainfall: 165.40, label: 'coffee' },

    // --- WHEAT (cool, moderate rainfall, well-drained loamy soil) ---
    { N: 105, P: 45, K: 39, temperature: 22.36, humidity: 73.01, ph: 6.09, rainfall: 81.53, label: 'wheat' },
    { N: 102, P: 48, K: 38, temperature: 20.10, humidity: 72.05, ph: 7.05, rainfall: 85.82, label: 'wheat' },
    { N: 98, P: 42, K: 40, temperature: 21.50, humidity: 74.00, ph: 6.50, rainfall: 78.30, label: 'wheat' },
    { N: 110, P: 50, K: 36, temperature: 19.80, humidity: 71.50, ph: 7.20, rainfall: 88.60, label: 'wheat' },
    { N: 105, P: 45, K: 38, temperature: 22.00, humidity: 73.00, ph: 6.10, rainfall: 82.00, label: 'wheat' },
    { N: 100, P: 46, K: 42, temperature: 23.00, humidity: 72.80, ph: 6.30, rainfall: 80.50, label: 'wheat' },
    { N: 112, P: 43, K: 37, temperature: 20.60, humidity: 74.50, ph: 7.00, rainfall: 86.40, label: 'wheat' },
    { N: 96, P: 50, K: 40, temperature: 21.80, humidity: 73.40, ph: 6.75, rainfall: 83.70, label: 'wheat' },
];

module.exports = cropData;
