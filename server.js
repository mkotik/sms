require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB, Text } = require("./db");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectDB();

const port = process.env.PORT || 3000;

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG,
  project: process.env.OPENAI_PROJ,
});

// Endpoint to receive incoming SMS messages
app.post("/sms", async (req, res) => {
  console.log(req.body);
  const from = req.body.From;
  const body = req.body.Body;

  //   const savedText = await Text.find();
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "The user has just received the following text: 'Hello, my name is Michael Wilcox, I'm a real estate investor in the area, are you interested in selling me your home?' The following message is the user's response to this message. Your job is to respond based on the willingness of the response. 0 means not interested, 1 means neutral, 2 means interested (even slightly). Do not respond with anything else besides the character 0, 1, or 2.",
      },
      { role: "user", content: body },
    ],
    model: "gpt-4o-mini",
  });

  const rating = Number(completion.choices[0].message.content);

  console.log(rating);
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString();

  const response = await Text.updateOne(
    { phoneNumber: from },
    {
      $set: { rating: rating, responseTime: currentDateString },
      $push: { textHistory: body },
    }
  );

  res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
