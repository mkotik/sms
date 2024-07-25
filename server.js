const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

// This endpoint will receive incoming SMS messages
app.post("/sms", (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();

  // Log the message body and the sender's phone number
  console.log(`Message from ${req.body.From}: ${req.body.Body}`);

  // You can also send a reply back
  twiml.message("Thank you for your message!");

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
