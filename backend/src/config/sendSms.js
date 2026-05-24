const twilio = require('twilio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function sendSms(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    console.log('✅ SMS sent:', message.sid);
    return message;
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    throw error;
  }
}

module.exports = sendSms;
