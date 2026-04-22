#include <WiFi.h>
#include <HTTPClient.h>

// ==========================================
// 1. CONFIGURATION
// ==========================================

// Wi-Fi Credentials for your OnePlus hotspot
const char* ssid = "light";
const char* password = "12345678";

// IMPORTANT: Replace with your PC's IPv4 address (run 'ipconfig' in Command Prompt)
const char* serverUrl = "http://10.223.95.95:5000/api/iot/sensors";

// Hardware Pins
const int MOISTURE_PIN = 34; // Analog AO from Soil Moisture Sensor
const int RELAY_PIN = 25;    // Digital IN1 to 5V Relay Module

// Irrigation Threshold (0% to 100%)
const float MOISTURE_THRESHOLD = 30.0; // Water if moisture drops below 30%

// ==========================================
// 2. SETUP ROUTINE
// ==========================================

void setup() {
  Serial.begin(115200);

  // FIX 1: Configure ESP32 ADC properly
  analogReadResolution(12);        // 12-bit resolution: values from 0 to 4095
  analogSetAttenuation(ADC_11db);  // Allows reading the full 0–3.3V range

  // Configure hardware pins
  pinMode(RELAY_PIN, OUTPUT);

  // Safety First: Start with Water Pump turned OFF
  // Relay NC logic: LOW = Relay Active = NC Open = Pump OFF
  digitalWrite(RELAY_PIN, LOW);

  // Connect to Wi-Fi
  Serial.println("\nConnecting to Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWi-Fi connected successfully!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Starting agricultural monitoring...\n");
}

// ==========================================
// 3. MAIN LOOP
// ==========================================

void loop() {
  // 3.1: Read Raw Sensor Data
  int moistureRaw = analogRead(MOISTURE_PIN);

  // FIX 2: Use float math instead of map() for accurate percentage
  // 4095 = completely dry, 0 = fully submerged in water
  float moisturePercent = (1.0 - ((float)moistureRaw / 4095.0)) * 100.0;

  // Clamp value between 0 and 100
  if (moisturePercent < 0)   moisturePercent = 0;
  if (moisturePercent > 100) moisturePercent = 100;

  Serial.print("Raw ADC Value: ");
  Serial.println(moistureRaw);
  Serial.print("Soil Moisture: ");
  Serial.print(moisturePercent, 1); // 1 decimal place
  Serial.println("%");

  // 3.2: Automatic Water Pump Control
  if (moisturePercent < MOISTURE_THRESHOLD) {
    digitalWrite(RELAY_PIN, HIGH); // Pump ON
    Serial.println("  -> Action: Watering Plants (Pump ON)");
  } else {
    digitalWrite(RELAY_PIN, LOW);  // Pump OFF
    Serial.println("  -> Action: Soil is Hydrated (Pump OFF)");
  }

  // 3.3: Send Data to Backend Server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Build JSON payload (static defaults for sensors not yet connected)
    String jsonPayload = "{";
    jsonPayload += "\"moisture\": " + String(moisturePercent, 1) + ",";
    jsonPayload += "\"ph\": 6.8,";
    jsonPayload += "\"temperature\": 26.5,";
    jsonPayload += "\"humidity\": 55.0";
    jsonPayload += "}";

    Serial.println("  -> Sending data to dashboard...");
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.println("  -> Sync Successful (Code " + String(httpResponseCode) + ")");
    } else {
      Serial.print("  -> Sync Failed (Error Code: ");
      Serial.print(httpResponseCode);
      Serial.println(")");
      Serial.println("     Check: Is your backend running? Is the IP correct?");
    }

    http.end();

  } else {
    Serial.println("  -> Wi-Fi Disconnected! Reconnecting...");
    WiFi.reconnect();
  }

  Serial.println("------------------------------------------");

  // 3.4: Wait 5 seconds before next reading
  delay(30000);
}