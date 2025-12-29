import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Core chatbot info
  name: { type: String, required: true },
  description: { type: String, default: "" },
  welcomeMessage: { type: String, default: "" },
  businessName: { type: String, default: "" },
  businessDescription: { type: String, default: "" },

  // Customization
  primaryColor: { type: String, default: "#3B82F6" },
  profilePicture: { type: String, default: null },
  status: { type: String, enum: ["active", "inactive"], default: "active" },

  // AI Configuration
  systemPrompt: { type: String, default: "You are a helpful assistant." },
  personality: { type: String, default: "friendly" }, // Removed enum to allow flexibility
  modelName: { type: String, default: "gemma3:1b-it-qat" },
  chatbotType: { type: String, enum: ["general", "sales", "support", "custom"], default: "general" },

  // Training data
  trainingData: [
    {
      type: { type: String, enum: ["text", "file"], required: true },
      content: { type: String, required: true },
      filename: { type: String, default: null },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
export default mongoose.models.Chatbot ||
  mongoose.model("Chatbot", ChatbotSchema);
