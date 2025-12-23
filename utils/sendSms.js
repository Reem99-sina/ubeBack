const axios = require('axios');
const crypto = require('crypto');

// API credentials
const API_KEY = 'bDqJFiq9';
const API_SECRET = '7bz1lzh9';
const API_URL = 'https://api.laaffic.com/v3/';

// Function to generate MD5 sign
function generateSign(apiKey, apiSecret, timestamp) {
  const stringToHash = apiKey + apiSecret + timestamp;
  return crypto.createHash('md5').update(stringToHash).digest('hex');
}

// Send request function
export async function sendRequest(payload) {
  const timestamp = Math.floor(Date.now() / 1000).toString(); // current timestamp in seconds
  const sign = generateSign(API_KEY, API_SECRET, timestamp);

  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Sign': sign,
    'Timestamp': timestamp,
    'Api-Key': API_KEY
  };

  try {
    const response = await axios.post(API_URL, payload, { headers });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}



sendRequest(payload);
