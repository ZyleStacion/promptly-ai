import express from "express";
import auth from "../middleware/userMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createFeedback,
  getMyFeedbacks,
  getUnreadNotifications,
  getNotifications,
} from "../controllers/feedbackController.js";

const router = express.Router();

// User submits feedback
router.post(
  "/",
  auth,
  upload.single("screenshot"),
  createFeedback
);

// User sees their own feedback history
router.get("/my", auth, getMyFeedbacks);
router.get("/notifications/count", auth, getUnreadNotifications);
router.get("/notifications", auth, getNotifications);

export default router;
