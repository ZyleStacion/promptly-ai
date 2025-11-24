import Chatbot from "../models/chatbot.js";

// CREATE CHATBOT
export const createChatbot = async (req, res) => {
  try {
    // userId comes from JWT middleware
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      businessName,
      businessDescription,
      systemPrompt,
      personality,
      modelName,
    } = req.body;

    // Validate required fields
    if (!businessName || !businessDescription || !systemPrompt) {
      return res.status(400).json({
        error: "businessName, businessDescription, and systemPrompt are required.",
      });
    }

    const chatbot = await Chatbot.create({
      userId,
      businessName,
      businessDescription,
      systemPrompt,
      personality: personality || "Friendly and helpful",
      modelName: modelName || "llama3",
    });

    return res.status(201).json({
      message: "Chatbot created successfully",
      chatbot,
    });
  } catch (err) {
    console.error("Error creating chatbot:", err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Server error" });
  }
};