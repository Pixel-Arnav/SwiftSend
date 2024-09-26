
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const twilio = require('twilio');

app.use(bodyParser.json());
app.use(express.static('public'));  // Serve frontend

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// List of virtual numbers you purchased
const twilioNumbers = [
  'YOUR_TWILIO_NUMBER_1',
  'YOUR_TWILIO_NUMBER_2',
  'YOUR_TWILIO_NUMBER_3',
  // Add more numbers here
];

