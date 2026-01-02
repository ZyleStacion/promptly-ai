import express from "express";
import auth from "../middleware/userMiddleware.js";
import Chatbot from "../models/chatbot.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = req.user;

    const chatbotCount = await Chatbot.countDocuments({
      userId: user._id,
    });

    res.json({
      plan: user.subscriptionPlan || "Basic",
      chatbotUsed: chatbotCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load usage" });
  }
});

export default router;
