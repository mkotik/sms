require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// To store conversation history
const conversationHistory = {};

// Endpoint to receive incoming SMS messages
app.post("/sms", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;
  console.log(body);

  // Initialize conversation history for the user if it doesn't exist
  if (!conversationHistory[from]) {
    conversationHistory[from] = [];
  }

  // Add the user's message to the conversation history
  conversationHistory[from].push({ role: "user", content: body });

  try {
    // Get the AI response
    const openaiResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: conversationHistory[from],
    });

    const aiMessage = openaiResponse.data.choices[0].message.content;

    // Add the AI's response to the conversation history
    console.log(aiMessage);
    conversationHistory[from].push({ role: "assistant", content: aiMessage });

    // Send the AI's response back to the user
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiMessage);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
