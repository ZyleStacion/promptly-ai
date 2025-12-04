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

/**
 * @route   GET /user/me
 * @desc    Get logged-in user details
 * @access  Private
 */
router.get("/me", auth, getUser);

/**
 * @route   PUT /user/update-info
 * @desc    Update username, email, and profile image
 * @access  Private
 */
router.put(
  "/update-info",
  auth,
  upload.single("profileImage"), // handles file upload
  updateUserInfo
);

/**
 * @route   PUT /user/change-password
 * @desc    Change user's password
 * @access  Private
 */
router.put("/change-password", auth, changePassword);

/**
 * @route   DELETE /user/delete
 * @desc    Delete the logged-in user's account
 * @access  Private
 */
router.delete("/delete", auth, deleteAccount);

export default router;
