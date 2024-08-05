const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_PUBLIC_URL;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const TextSchema = new mongoose.Schema({
  followedUp: { type: Boolean, default: false },
  rating: { type: Number, required: false },
  phoneNumber: { type: String, required: true },
  textHistory: {
    type: [String],
    default: [],
    required: true,
  },
  creationDate: { type: Date, default: Date.now },
  responseTime: { type: Date, required: false },
});
const Text = mongoose.model("Text", TextSchema);

module.exports = { connectDB, Text };
