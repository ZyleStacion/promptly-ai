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
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create chatbot (plan-limited)
router.post("/", checkChatbotLimit, upload.single("profilePicture"), createChatbot);

// Get all chatbots for logged-in user
router.get("/", getChatbots);

// Get single chatbot
router.get("/:id", getChatbot);

// Update chatbot
router.put("/:id", upload.single("profilePicture"), updateChatbot);

// Delete chatbot
router.delete("/:id", deleteChatbot);

export default router;
