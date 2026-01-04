import express from "express";
import { createCheckoutSession, handleWebhook, listPaymentsForUser, finalizeCheckout, cancelSubscription, resumeSubscription, getCurrentSubscription } from "../controllers/paymentController.js";
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

// Cancel subscription
router.post("/cancel-subscription", userMiddleware, cancelSubscription);
// Resume scheduled subscription cancellation
router.post("/resume-subscription", userMiddleware, resumeSubscription);
// Get current subscription for logged-in user
router.get("/current-subscription", userMiddleware, getCurrentSubscription);
export default router;