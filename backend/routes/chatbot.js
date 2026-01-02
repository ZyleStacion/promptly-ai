import express from "express";
import {
  createChatbot,
  getChatbots,
  getChatbot,
  updateChatbot,
  deleteChatbot,
} from "../controllers/chatbotController.js";
import auth from "../middleware/userMiddleware.js";
import checkChatbotLimit from "../middleware/checkChatbotLimit.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create chatbot (plan-limited)
router.post("/", checkChatbotLimit, createChatbot);

// Get all chatbots for logged-in user
router.get("/", getChatbots);

// Get single chatbot
router.get("/:id", getChatbot);

// Update chatbot
router.put("/:id", updateChatbot);

// Delete chatbot
router.delete("/:id", deleteChatbot);

export default router;
