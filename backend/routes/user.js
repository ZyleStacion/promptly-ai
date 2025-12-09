import express from "express";
import auth from "../middleware/userMiddleware.js";
import upload from "../middleware/upload.js";

import {
  getUser,
  updateUserInfo,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

// Normal user routes
router.get("/me", auth, getUser);

router.put(
  "/update-info",
  auth,
  upload.single("profileImage"),
  updateUserInfo
);

router.put("/change-password", auth, changePassword);

router.delete("/delete", auth, deleteAccount);

export default router;
