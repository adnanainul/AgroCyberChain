#include <WiFi.h>
#include <HTTPClient.h>

// ==========================================
// CONFIGURATION
// ==========================================

// 1. Wi-Fi Credentials
const char* ssid = "light";
const char* password = "12345678";

// 2. Server Configuration
// IMPORTANT: Replace with your Computer's Local IP Address (CMD -> ipconfig)
// Example: "http://192.168.1.10:5000/api/iot/sensors"
const char* serverUrl = "http://10.229.207.242:5000/api/iot/sensors";

// 3. Sensor Pin Configuration (ESP32 GPIO Pins)
const int MOISTURE_PIN = 34; // Analog Pin
const int PH_PIN = 35;       // Analog Pin

// 4. DHT11 Sensor Configuration
// Set USE_DHT to true if you have a DHT11 sensor connected.
// Set to false to use static placeholder values instead.
#define USE_DHT true
#define DHT_PIN 4  // GPIO Pin where DHT11 Data pin is connected

#if USE_DHT
  #include "DHT.h"
  #define DHT_TYPE DHT11
  DHT dht(DHT_PIN, DHT_TYPE);
#endif

// ==========================================

void setup() {
  Serial.begin(115200);

  #if USE_DHT
    dht.begin();
    Serial.println("DHT11 sensor initialized.");
  #endif

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 1. Read Raw Sensor Data (0-4095 for ESP32)
  int moistureRaw = analogRead(MOISTURE_PIN);
  int phRaw = analogRead(PH_PIN);

  // 2. Convert to meaningful units (Calibration needed for your specific sensors)
  float moisturePercent = map(moistureRaw, 4095, 0, 0, 100); // Capacitive sensors usually read high for dry
  float phValue = map(phRaw, 0, 4095, 0, 140) / 10.0;        // Rough mapping 0-14.0

  // 3. Read Temperature & Humidity
  float temperature, humidity;

  #if USE_DHT
    // Read from real DHT11 sensor
    humidity = dht.readHumidity();
    temperature = dht.readTemperature(); // Celsius

    // Check if reading failed
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("ERROR: Failed to read from DHT sensor! Check wiring.");
      // Use fallback static values so we still send data
      temperature = 0.0;
      humidity = 0.0;
    }
  #else
    // Static placeholder values (no DHT11 sensor connected)
    temperature = 28.5;
    humidity = 60.0;
  #endif

  // 4. Prepare JSON Payload
  String jsonPayload = "{";
  jsonPayload += "\"moisture\": " + String(moisturePercent) + ",";
  jsonPayload += "\"ph\": " + String(phValue) + ",";
  jsonPayload += "\"temperature\": " + String(temperature) + ",";
  jsonPayload += "\"humidity\": " + String(humidity);
  jsonPayload += "}";

  // 5. Send HTTP POST Request
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    Serial.println("Sending data: " + jsonPayload);
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server Response: " + String(httpResponseCode));
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected. Attempting reconnect...");
    WiFi.reconnect();
  }

  // 6. Wait 3 seconds before next reading
  delay(3000);
}
