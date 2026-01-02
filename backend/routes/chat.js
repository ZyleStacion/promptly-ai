import express from "express";
import auth from "../middleware/userMiddleware.js";     
import Chatbot from "../models/chatbot.js";            
import { chat, getModels } from "../controllers/ollamaController.js";

const router = express.Router();

router.post("/chat", chat);
router.get("/models", getModels);

// 🔐 Get chatbot config (used by widget / dashboard)
router.get("/config/:id", auth, async (req, res) => {
  try {
    const bot = await Chatbot.findById(req.params.id);

    if (!bot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    res.json({ chatbot: bot });
  } catch (err) {
    console.error("Chat config error:", err);
    res.status(500).json({ error: "Failed to load chatbot config" });
  }
});

export default router;
