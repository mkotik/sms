const twilio = require("twilio");
require("dotenv").config();
const { connectDB, Text } = require("./db");

const sendTexts = (phoneNumbers) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
  const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

  const client = new twilio(accountSid, authToken);
  const openingMessage = "Hey it's Mike, are you open to selling your house?";
  const toNumber = "+18489001244";
  connectDB();

  phoneNumbers.forEach((number) => {
    client.messages
      .create({
        body: openingMessage,
        to: number, // Text this number
        from: "+1 904 508 0427", // From a valid Twilio number
      })
      .then((message) => {
        console.log(`Message sent to ${number}: ${message.sid}`);

        const newText = new Text({
          phoneNumber: toNumber,
          textHistory: [openingMessage],
        });

        newText
          .save()
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      })
      .catch((error) =>
        console.error(`Failed to send message to ${number}:`, error)
      );
  });
};

module.exports = sendTexts;
