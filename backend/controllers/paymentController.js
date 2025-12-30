import stripe from "stripe";
import User from "../models/user.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Payment from "../models/payment.js";

dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Store payment records
const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripeInvoiceId: { type: String, index: true },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  amountPaid: Number,         // cents
  currency: String,
  status: String,             // paid, open, failed, etc.
  hostedInvoiceUrl: String,
  invoicePdf: String,
  periodStart: Number,        // epoch seconds
  periodEnd: Number,          // epoch seconds
  createdAtStripe: Number,    // stripe created timestamp
  raw: Object,                // raw Stripe object (optional)
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, userId } = req.body;

    if (!priceId || !userId) {
      return res
        .status(400)
        .json({ error: "Price ID and User ID are required" });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription", //
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: user.email,
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({
      message: "Checkout session created successfully",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

// Stripe Webhook
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  
const handleInvoicePaymentSucceeded = async (invoice) => {
  try {
    // Get user
    const user = await User.findOne({ stripeCustomerId: invoice.customer });
    if (!user) {
      console.warn("No user found for invoice customer:", invoice.customer);
    }

    // Upsert payment/invoice record
    await Payment.findOneAndUpdate(
      { stripeInvoiceId: invoice.id },
      {
        user: user ? user._id : null,
        stripeInvoiceId: invoice.id,
        stripeCustomerId: invoice.customer,
        stripeSubscriptionId: invoice.subscription,
        amountPaid: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        periodStart: invoice.lines?.data?.[0]?.period?.start || invoice.period_start,
        periodEnd: invoice.lines?.data?.[0]?.period?.end || invoice.period_end,
        createdAtStripe: invoice.created,
        raw: invoice,
      },
      { upsert: true, new: true }
    );

    // If user exists, update subscription status/ids as needed
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        subscriptionStatus: "active",
        subscriptionId: invoice.subscription || user.subscriptionId,
        stripeCustomerId: invoice.customer,
      });
    }

    console.log("Saved invoice:", invoice.id);
  } catch (error) {
    console.error("Error handling invoice payment success:", error);
  }
};

const handleInvoicePaymentFailed = async (invoice) => {
  try {
    console.log(`Payment failed for customer: ${invoice.customer}`);
    // TODO: Handle invalid invoices
  } catch (error) {
    console.error("Error handling invoice payment failure:", error);
  }
};

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(event.data.object);
      break;

    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

const handleCheckoutSessionCompleted = async (session) => {
  try {
    const userId = session.metadata.userId;

    // Update user subscription status in database
    await User.findByIdAndUpdate(userId, {
      stripeCustomerId: session.customer,
      subscriptionStatus: "active",
      subscriptionId: session.subscription,
    });

    console.log(`Checkout completed for user: ${userId}`);
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  try {
    // Find user by Stripe customer ID and update subscription status
    await User.findOneAndUpdate(
      { stripeCustomerId: subscription.customer },
      {
        subscriptionStatus: "canceled",
        subscriptionId: null,
      }
    );

    console.log(`Subscription canceled for customer: ${subscription.customer}`);
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
};

// View users subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.stripeCustomerId) {
      return res.status(200).json({
        subscriptionStatus: "none",
        message: "User has no active subscription",
      });
    }

    // Retrieve subscription from Stripe
    const subscriptions = await stripeInstance.subscriptions.list({
      customer: user.stripeCustomerId,
      limit: 1,
    });

    res.status(200).json({
      subscriptionStatus: user.subscriptionStatus,
      subscription: subscriptions.data[0] || null,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: error.message });
  }
};

export const listPaymentsForUser = async (req, res) => {
  try {
    // Get user
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-raw");

    res.json({ payments });
  } catch (err) {
    console.error("Error listing payments:", err);
    res.status(500).json({ error: err.message });
  }
};