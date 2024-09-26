const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve frontend

// Check if Twilio credentials are provided
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let client = null;
let twilioNumbers = [];

if (accountSid && authToken) {
  // Only initialize Twilio if the credentials are provided
  client = require('twilio')(accountSid, authToken);
  
  // List of Twilio numbers if you have any
  twilioNumbers = [
    'YOUR_TWILIO_NUMBER_1',
    'YOUR_TWILIO_NUMBER_2',
    'YOUR_TWILIO_NUMBER_3',
  ];
}

// Route to handle sending SMS
app.post('/send-sms', (req, res) => {
  const { message, phoneNumbers } = req.body;

  if (client && twilioNumbers.length > 0) {
    // If Twilio is configured, send SMS
    const promises = phoneNumbers.map(number => {
      const randomTwilioNumber = twilioNumbers[Math.floor(Math.random() * twilioNumbers.length)];
      return client.messages.create({
        body: message,
        from: randomTwilioNumber,
        to: number,
      });
    });

    Promise.all(promises)
      .then(() => res.status(200).send('Messages sent successfully!'))
      .catch(error => res.status(500).send(`Error sending messages: ${error.message}`));
  } else {
    // If Twilio is not configured, just respond with a message
    res.status(200).send('Twilio is not configured. No messages were sent.');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});