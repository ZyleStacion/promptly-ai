import express from "express";
import { createCheckoutSession, handleWebhook, listPaymentsForUser, finalizeCheckout } from "../controllers/paymentController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = express.Router();

// Create a checkout session for payment
router.post("/checkout", userMiddleware, createCheckoutSession);

// Get user invoice records
router.get("/invoices", userMiddleware, listPaymentsForUser);

// Finalize checkout after redirect (calls Stripe to expand session and create payment record)
router.post("/finalize", userMiddleware, finalizeCheckout);

// Stripe webhook endpoint
router.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);

export default router;