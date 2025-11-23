import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessName: { type: String, required: true },
  businessDescription: { type: String, required: true },
  personality: { type: String, default: "Friendly and helpful" },
  modelName: { type: String, default: "llama3" }, // Ollama model
  systemPrompt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chatbot", ChatbotSchema);