export interface SensorInput {
  moisture: number;
  ph: number;
  temperature: number;
  humidity: number;
  region: string;
  pastYield?: number;
}

export interface MLPrediction {
  recommendedCrop: string;
  cropConfidence: number;
  irrigationTime: string;
  irrigationConfidence: number;
  soilHealth: string;
  soilConfidence: number;
  anomalyDetected: boolean;
  predictedYield: number;
}

export function predictCropRecommendation(input: SensorInput): string {
  const { ph, temperature, humidity, moisture, region } = input;

  // Simplified ML logic based on agricultural rules
  if (region === 'North' && ph > 6.5 && ph < 7.5 && temperature > 20 && temperature < 30) {
    return 'Wheat';
  } else if (region === 'South' && ph > 6.0 && humidity > 60) {
    return 'Rice';
  } else if (ph > 7.0 && temperature > 25 && moisture > 40) {
    return 'Cotton';
  } else if (humidity > 70 && temperature > 22) {
    return 'Sugarcane';
  }
  return 'Rice';
}

export function predictIrrigation(input: SensorInput): string {
  const { moisture, temperature, humidity } = input;

  if (moisture < 30) {
    return 'Irrigate immediately - 12 liters per plant';
  } else if (moisture < 40) {
    return 'Irrigate after 2 hours - 10 liters per plant';
  } else if (moisture < 50) {
    return 'Irrigate after 4 hours - 8 liters per plant';
  }
  return 'No irrigation needed for 8 hours';
}

export function analyzeSoilHealth(input: SensorInput): string {
  const { ph, moisture } = input;

  if (ph >= 6.0 && ph <= 7.5 && moisture >= 40 && moisture <= 60) {
    return 'Good';
  } else if (ph >= 5.5 && ph <= 8.0 && moisture >= 30 && moisture <= 70) {
    return 'Moderate';
  } else if (ph < 5.5 || ph > 8.0) {
    return 'Nutrient Deficient';
  }
  return 'Poor';
}

export function detectAnomalies(
  current: SensorInput,
  previous?: SensorInput
): boolean {
  if (!previous) return false;

  const moistureDiff = Math.abs(current.moisture - previous.moisture);
  const tempDiff = Math.abs(current.temperature - previous.temperature);
  const phDiff = Math.abs(current.ph - previous.ph);

  // Detect anomalies if changes are too extreme
  return moistureDiff > 25 || tempDiff > 8 || phDiff > 1.0;
}

export function generateFullPrediction(
  input: SensorInput,
  previous?: SensorInput
): MLPrediction {
  return {
    recommendedCrop: predictCropRecommendation(input),
    cropConfidence: 90,
    irrigationTime: predictIrrigation(input),
    irrigationConfidence: 85,
    soilHealth: analyzeSoilHealth(input),
    soilConfidence: 88,
    anomalyDetected: detectAnomalies(input, previous),
    predictedYield: 4.2 + Math.random() * 0.5,
  };
}
