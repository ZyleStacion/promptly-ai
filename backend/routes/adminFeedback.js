import express from "express";
import auth from "../middleware/userMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import {
  getAllFeedbacks,
  replyFeedback,
  getPendingFeedbackCount,
} from "../controllers/adminFeedbackController.js";


const router = express.Router();

router.get("/", auth, admin, getAllFeedbacks);
router.post("/:id/reply", auth, admin, replyFeedback);

router.get(
  "/notifications/count",
  auth,
  admin,
  getPendingFeedbackCount
);



export default router;
