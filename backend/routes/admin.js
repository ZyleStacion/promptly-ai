import express from "express";
import auth from "../middleware/userMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getAdminStats,
  deleteUserByAdmin,
  toggleAdminRole
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", auth, admin, getAdminStats);
router.get("/users", auth, admin, getAllUsers);
router.delete("/delete/:id", auth, admin, deleteUserByAdmin);
router.put("/toggle-role/:id", auth, admin, toggleAdminRole);

export default router;
