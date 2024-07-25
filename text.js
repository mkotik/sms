const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: "Yo respond to this one",
    to: "+19084048073", // Text this number
    from: "+1 904 508 0427", // From a valid Twilio number
  })
  .then((message) => console.log(message.sid))
  .catch((error) => console.error(error));
