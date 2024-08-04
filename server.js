require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG,
  project: process.env.OPENAI_PROJ,
});

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// To store conversation history
const conversationHistory = {
  8484580377: [
    {
      role: "assistant",
      content:
        "Hello, I am a wholesaler. Are you interested in selling your home?",
    },
    { role: "user", content: "Yes, I am interested" },
  ],
};

// Endpoint to receive incoming SMS messages
app.post("/sms", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: body }],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);

  res.status(200).json(completion);
  //   console.log(req);
  //   console.log(req.body);
  //   console.log(body);
  // Initialize conversation history for the user if it doesn't exist
  //   if (!conversationHistory[from]) {
  //     conversationHistory[from] = [];
  //   }
  // Add the user's message to the conversation history
  //   conversationHistory[from].push({ role: "user", content: body });
  //   try {
  //     res.status(200).json({ message: "yolo" });
  // // Get the AI response
  // const openaiResponse = await openai.createChatCompletion({
  //   model: "gpt-4",
  //   messages: conversationHistory[from],
  // });
  // const aiMessage = openaiResponse.data.choices[0].message.content;
  // // Add the AI's response to the conversation history
  // console.log(aiMessage);
  // conversationHistory[from].push({ role: "assistant", content: aiMessage });
  // // Send the AI's response back to the user
  // const twiml = new twilio.twiml.MessagingResponse();
  // twiml.message(aiMessage);
  // res.writeHead(200, { "Content-Type": "text/xml" });
  // res.end(twiml.toString());
  //   } catch (error) {
  //     console.error("Error communicating with OpenAI:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
