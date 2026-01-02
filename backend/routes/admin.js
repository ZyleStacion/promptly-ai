import express from "express";
import auth from "../middleware/userMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import {
  getAllUsers,
  getAdminStats,
  deleteUserByAdmin,
  toggleAdminRole,
  getAllChatbots,
  deleteChatbotByAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard
router.get("/stats", auth, admin, getAdminStats);

// Users
router.get("/users", auth, admin, getAllUsers);
router.delete("/delete/:id", auth, admin, deleteUserByAdmin);
router.put("/toggle-role/:id", auth, admin, toggleAdminRole);

// Chatbots
router.get("/chatbots", auth, admin, getAllChatbots);
router.delete("/chatbots/:id", auth, admin, deleteChatbotByAdmin);

export default router;
