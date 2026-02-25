export async function generateSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function generateSensorHash(sensorData: any): Promise<string> {
  const dataString = JSON.stringify({
    moisture: sensorData.moisture,
    ph: sensorData.ph,
    temperature: sensorData.temperature,
    humidity: sensorData.humidity,
    timestamp: sensorData.timestamp
  });
  return generateSHA256(dataString);
}

export async function generatePredictionHash(prediction: any): Promise<string> {
  const dataString = JSON.stringify({
    crop: prediction.recommended_crop,
    irrigation: prediction.irrigation_time,
    soilHealth: prediction.soil_health,
    yield: prediction.predicted_yield
  });
  return generateSHA256(dataString);
}

export async function generateTransactionHash(transaction: any): Promise<string> {
  const dataString = JSON.stringify({
    farmerId: transaction.farmer_id,
    quantity: transaction.quantity_tons,
    price: transaction.total_price,
    timestamp: transaction.created_at
  });
  return generateSHA256(dataString);
}
