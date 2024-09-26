const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');

app.use(bodyParser.json());
app.use(express.static('public'));  // Serve frontend

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// List of virtual numbers you purchased or have
const twilioNumbers = [
  'YOUR_TWILIO_NUMBER_1',
  'YOUR_TWILIO_NUMBER_2',
  'YOUR_TWILIO_NUMBER_3',
  // Add more numbers here if needed or required
];

app.post('/send-sms', (req, res) => {
  const { message, phoneNumbers } = req.body;

  // Send SMS in parallel for all phone numbers
  const promises = phoneNumbers.map(number => {
    // Randomly select a Twilio number to send from
    const randomTwilioNumber = twilioNumbers[Math.floor(Math.random() * twilioNumbers.length)];

    return client.messages.create({
      body: message,
      from: randomTwilioNumber,
      to: number,
    });
  });

  Promise.all(promises)
    .then(results => res.status(200).send('Messages sent successfully!'))
    .catch(error => res.status(500).send('Error sending messages'));
});

// Heroku's dynamic port or fall back to port 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Bulk SMS app listening at http://localhost:${port}`);
});