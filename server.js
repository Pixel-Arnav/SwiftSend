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
  
  // List of Twilio numbers from environment variables
  twilioNumbers = [
    process.env.TWILIO_NUMBER_1,
    process.env.TWILIO_NUMBER_2,
    process.env.TWILIO_NUMBER_3,
  ].filter(Boolean);  // Filter out any undefined numbers
}

// Route to handle sending SMS
app.post('/send-sms', (req, res) => {
  const { message, phoneNumber, count = 10 } = req.body; // Default count to 10

  if (client && twilioNumbers.length > 0) {
    // Send the same SMS 'count' number of times to the same phone number
    const promises = Array.from({ length: count }).map(() => {
      const randomTwilioNumber = twilioNumbers[Math.floor(Math.random() * twilioNumbers.length)];
      return client.messages.create({
        body: message,
        from: randomTwilioNumber,
        to: phoneNumber,  // Sending to the same number
      });
    });

    Promise.all(promises)
      .then(() => res.status(200).send(`Message sent ${count} times successfully!`))
      .catch(error => res.status(500).send(`Error sending messages: ${error.message}`));
  } else {
    res.status(200).send('Twilio is not configured. No messages were sent.');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});