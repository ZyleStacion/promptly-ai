import express from "express";
import { createCheckoutSession, handleWebhook, listPaymentsForUser } from "../controllers/paymentController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = express.Router();

// Create a checkout session for payment
router.post("/checkout", userMiddleware, createCheckoutSession);

// Get user invoice records
router.get("/invoices", userMiddleware, listPaymentsForUser);

// Stripe webhook endpoint
router.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);

export default router;