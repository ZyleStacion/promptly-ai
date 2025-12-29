import express from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/paymentController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = express.Router();

// Create a checkout session for payment
router.post("/checkout", userMiddleware, createCheckoutSession);

// Stripe webhook endpoint
router.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);

export default router;