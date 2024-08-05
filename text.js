const twilio = require("twilio");
require("dotenv").config();
const { connectDB, Text } = require("./db");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

const openingMessage = "Hey it's Mike, are you open to selling your house?";
const toNumber = "+18489001244";
connectDB();

// client.messages
//   .create({
//     body: openingMessage,
//     to: toNumber,
//     from: "+1 904 508 0427",
//   })
//   .then((message) => console.log(message.sid))
//   .catch((error) => console.error(error));

const newText = new Text({
  phoneNumber: toNumber,
  textHistory: [openingMessage],
});

newText
  .save()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
