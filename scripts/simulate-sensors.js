import http from 'http';

function sendData() {
    // Generate random sensor data
    const data = JSON.stringify({
        temperature: (20 + Math.random() * 15).toFixed(1), // 20-35 C
        humidity: (40 + Math.random() * 40).toFixed(1),    // 40-80 %
        ph: (5.5 + Math.random() * 2).toFixed(1),          // 5.5-7.5
        // Generate RANDOM LOW MOISTURE (15-25%) to trigger critical alert!
        moisture: (Math.random() * (25 - 15) + 15).toFixed(1)
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/iot/sensors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        // console.log(`Status: ${res.statusCode}`);
        // res.on('data', (d) => process.stdout.write(d));
    });

    req.on('error', (error) => {
        console.error('Error sending data:', error.message);
        console.log('Make sure your backend server is running on port 5000');
    });

    req.write(data);
    req.end();

    console.log(`[Sensor Device] Sent Data -> pH: ${JSON.parse(data).ph}, Moisture: ${JSON.parse(data).moisture}%`);
}

console.log('=============================================');
console.log('   IoT HARDWARE SIMULATOR (ESP32 Mock)   ');
console.log('=============================================');
console.log('Simulating sensor data transmission every 3 seconds...');
console.log('Target: http://localhost:5000/api/iot/sensors');
console.log('Press Ctrl+C to stop.\n');

// Send immediately then interval
sendData();
setInterval(sendData, 3000);
