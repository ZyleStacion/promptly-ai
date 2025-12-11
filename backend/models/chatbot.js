import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },

  messages: [
    {
      role: { type: String, enum: ["General AI Chatbot", "Sale Assistant Chatbot","Customer Support Chatbot"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
export default mongoose.models.Chatbot ||
  mongoose.model("Chatbot", ChatbotSchema);
