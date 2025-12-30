import Chatbot from "../models/chatbot.js";

// CREATE CHATBOT
export const createChatbot = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      name,
      description,
      businessName,
      businessDescription,
      systemPrompt,
      personality,
      modelName,
      chatbotType,
      primaryColor,
      profilePicture,
      trainingData,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Chatbot name is required" });
    }

    const chatbot = await Chatbot.create({
      userId,
      name,
      description: description || "",
      businessName: businessName || name,
      businessDescription: businessDescription || description || "",
      systemPrompt: systemPrompt || "You are a helpful assistant.",
      personality: personality || "Friendly and helpful",
      modelName: modelName || "gemma3:1b-it-qat",
      chatbotType: chatbotType || "General AI Chatbot",
      primaryColor: primaryColor || "#3B82F6",
      profilePicture: profilePicture || null,
      trainingData: trainingData || [],
      status: "active",
    });

    return res.status(201).json({
      message: "Chatbot created successfully",
      chatbot,
    });
  } catch (err) {
    console.error("Error creating chatbot:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

// GET ALL CHATBOTS FOR USER
export const getChatbots = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatbots = await Chatbot.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      chatbots,
    });
  } catch (err) {
    console.error("Error fetching chatbots:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET SINGLE CHATBOT
export const getChatbot = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatbot = await Chatbot.findOne({ _id: id, userId });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    return res.status(200).json({
      success: true,
      chatbot,
    });
  } catch (err) {
    console.error("Error fetching chatbot:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// UPDATE CHATBOT
export const updateChatbot = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Ensure user can only update their own chatbot
    const chatbot = await Chatbot.findOne({ _id: id, userId });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    // Update allowed fields
    const allowedFields = [
      "name",
      "description",
      "businessName",
      "businessDescription",
      "systemPrompt",
      "personality",
      "modelName",
      "chatbotType",
      "primaryColor",
      "profilePicture",
      "trainingData",
      "welcomeMessage",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        chatbot[field] = updates[field];
      }
    });

    // Mark trainingData as modified if it was updated (for mongoose to detect the change)
    if (updates.trainingData !== undefined) {
      chatbot.markModified('trainingData');
    }

    chatbot.updatedAt = Date.now();
    await chatbot.save();

    return res.status(200).json({
      message: "Chatbot updated successfully",
      chatbot,
    });
  } catch (err) {
    console.error("Error updating chatbot:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE CHATBOT
export const deleteChatbot = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatbot = await Chatbot.findOneAndDelete({ _id: id, userId });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    return res.status(200).json({
      message: "Chatbot deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting chatbot:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
