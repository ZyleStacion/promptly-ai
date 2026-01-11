import express from "express";
import auth from "../middleware/userMiddleware.js";     
import Chatbot from "../models/chatbot.js";            
import { chat, getModels } from "../controllers/ollamaController.js";

const router = express.Router();

router.post("/chat", chat);
router.get("/models", getModels);

// 🌐 Get chatbot config - PUBLIC (used by widget / dashboard)
// No auth required so widget can fetch chatbot details
router.get("/config/:id", async (req, res) => {
  try {
    const bot = await Chatbot.findById(req.params.id);

    if (!bot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    res.json({ success: true, chatbot: bot });
  } catch (err) {
    console.error("Chat config error:", err);
    res.status(500).json({ error: "Failed to load chatbot config" });
  }
});

// 🖼️ Get chatbot profile picture from MongoDB - PUBLIC
// Returns the image with proper content-type header
router.get("/picture/:id", async (req, res) => {
  try {
    const bot = await Chatbot.findById(req.params.id);

    if (!bot || !bot.profilePicture || !bot.profilePicture.data) {
      return res.status(404).json({ error: "Profile picture not found" });
    }

    const { data, mimeType } = bot.profilePicture;
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(data, 'base64');
    
    // Set proper headers
    res.setHeader('Content-Type', mimeType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Content-Length', imageBuffer.length);
    
    res.send(imageBuffer);
  } catch (err) {
    console.error("Failed to get profile picture:", err);
    res.status(500).json({ error: "Failed to load profile picture" });
  }
});

export default router;
