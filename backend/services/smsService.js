/**
 * Mock SMS Service
 * Simulates sending SMS via a provider like Twilio/Nexmo.
 * Since we don't have API keys, this logs to console.
 */

const sendSMS = async (phoneNumber, message) => {
    // In a real app, you would use:
    // await twilioClient.messages.create({ body: message, to: phoneNumber, from: '+1234567890' });

    console.log('\n=============================================');
    console.log(`[SMS GATEWAY] Sending to ${phoneNumber}...`);
    console.log(`[MSG CONTENT]: "${message}"`);
    console.log('=============================================\n');

    // Simulate network delay
    return new Promise((resolve) => setTimeout(() => {
        resolve({ success: true, sid: 'SM' + Date.now() });
    }, 500));
};

module.exports = { sendSMS };
