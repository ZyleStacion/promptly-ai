import stripe from "stripe";
import User from "../models/user.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Payment from "../models/payment.js";

dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Store payment records
// Use shared Payment model from ../models/payment.js

const PRICE_PLAN_MAP = {
  // Pro
  "price_1Sk0ju3tBDM4Uh8AID3qhu5S": "Pro", // monthly
  "price_1Sk0s13tBDM4Uh8Ag7oIwytw": "Pro", // yearly
  // Enterprise
  "price_1SjxRI3tBDM4Uh8AU9CbUNeI": "Enterprise", // monthly
  "price_1Sk0tE3tBDM4Uh8AZFTTWsWW": "Enterprise", // yearly
};

const getPlanFromPriceId = (priceId) => {
  if (!priceId) return null;
  return PRICE_PLAN_MAP[priceId] || null;
};

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
    const planName = getPlanFromPriceId(priceId) || null;
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
        priceId,
        planName,
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
    console.log("Stripe webhook event:", event.type, "id:", event.id);
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

    // Create or update payment record
    const saved = await Payment.findOneAndUpdate(
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

    console.log("Payment saved/upserted:", saved ? `${saved._id} (${saved.stripeInvoiceId})` : "none");

    let planName = null;
    try {
      const firstLine = invoice.lines?.data?.[0];
      const priceId = firstLine?.price?.id || firstLine?.plan?.id;
      planName = getPlanFromPriceId(priceId);
    } catch (e) {
      planName = null;
    }
    // If user exists, update subscription status/ids as needed
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        subscriptionStatus: "active",
        subscriptionId: invoice.subscription || user.subscriptionId,
        stripeCustomerId: invoice.customer,
      });
      if (planName) updates.subscriptionPlan = planName;
      await User.findByIdAndUpdate(user._id, updates);
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

    // If session has a subscription id, fetch subscription to get price id
    let planName = null;
    try {
      if (session.subscription) {
        const sub = await stripeInstance.subscriptions.retrieve(session.subscription, { expand: ['items.data.price'] });
        const firstItem = sub.items?.data?.[0];
        const priceId = firstItem?.price?.id;
        planName = getPlanFromPriceId(priceId);
      } else if (session.metadata?.priceId) {
        planName = getPlanFromPriceId(session.metadata.priceId);
      }
    } catch (e) {
      console.warn('Could not fetch subscription to determine plan:', e.message);
    }

    // Update user subscription status & plan
    const updates = {
      stripeCustomerId: session.customer,
      subscriptionStatus: "active",
      subscriptionId: session.subscription,
    };
    if (planName) updates.subscriptionPlan = planName;

    await User.findByIdAndUpdate(userId, updates);

    console.log(`Checkout completed for user: ${userId}`);
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
};

// Finalize a checkout session by ID (can be called from frontend after redirect)
export const finalizeCheckout = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    // Retrieve session from Stripe (expand subscription.latest_invoice)
    const fullSession = await stripeInstance.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription', 'subscription.latest_invoice']
    });

    // Optional: ensure authenticated user matches session metadata.userId
    if (req.user && fullSession.metadata && fullSession.metadata.userId) {
      const reqUserId = req.user._id ? req.user._id.toString() : req.user.id;
      if (reqUserId !== fullSession.metadata.userId) {
        return res.status(403).json({ error: 'Unauthorized for this session' });
      }
    }

    // Find or fetch invoice object
    let invoiceObj = null;
    if (fullSession.subscription && fullSession.subscription.latest_invoice && typeof fullSession.subscription.latest_invoice === 'object') {
      invoiceObj = fullSession.subscription.latest_invoice;
    }
    const invoiceId = invoiceObj ? invoiceObj.id : (fullSession.latest_invoice || (fullSession.subscription && fullSession.subscription.latest_invoice));
    if (!invoiceObj && invoiceId) {
      try {
        invoiceObj = await stripeInstance.invoices.retrieve(invoiceId);
      } catch (e) {
        console.warn('Could not retrieve invoice by id during finalize:', invoiceId, e.message);
      }
    }

    // Find user by metadata or customer id
    let user = null;
    if (fullSession.metadata && fullSession.metadata.userId) {
      user = await User.findById(fullSession.metadata.userId).catch(() => null);
    }
    if (!user && fullSession.customer) {
      user = await User.findOne({ stripeCustomerId: fullSession.customer }).catch(() => null);
    }

    // Prepare payment payload
    // Normalize subscription/customer ids (they may be expanded objects)
    const normalizeId = (val) => {
      if (!val) return null;
      if (typeof val === 'string') return val;
      if (typeof val === 'object' && val.id) return val.id;
      return String(val);
    };

    const paymentPayload = {
      user: user ? user._id : null,
      stripeInvoiceId: invoiceObj ? invoiceObj.id : null,
      stripeCustomerId: normalizeId(fullSession.customer || (invoiceObj && invoiceObj.customer)),
      stripeSubscriptionId: normalizeId(fullSession.subscription || (invoiceObj && invoiceObj.subscription) || (fullSession.subscription && fullSession.subscription.id)),
      amountPaid: invoiceObj ? invoiceObj.amount_paid : (fullSession.payment_intent?.amount_received || 0),
      currency: invoiceObj ? invoiceObj.currency : (fullSession.payment_intent?.currency || null),
      status: invoiceObj ? invoiceObj.status : (fullSession.payment_status || 'paid'),
      hostedInvoiceUrl: invoiceObj ? invoiceObj.hosted_invoice_url : null,
      invoicePdf: invoiceObj ? invoiceObj.invoice_pdf : null,
      periodStart: invoiceObj ? (invoiceObj.lines?.data?.[0]?.period?.start || invoiceObj.period_start) : null,
      periodEnd: invoiceObj ? (invoiceObj.lines?.data?.[0]?.period?.end || invoiceObj.period_end) : null,
      createdAtStripe: invoiceObj ? invoiceObj.created : (fullSession.created || null),
      raw: invoiceObj || fullSession,
    };

    // Upsert payment record if we have an invoice id or payment intent
    if (paymentPayload.stripeInvoiceId || fullSession.payment_intent) {
      const saved = await Payment.findOneAndUpdate(
        { stripeInvoiceId: paymentPayload.stripeInvoiceId || `session_${fullSession.id}` },
        paymentPayload,
        { upsert: true, new: true }
      );
      console.log('Finalize: payment saved/upserted', saved ? `${saved._id} (${saved.stripeInvoiceId})` : 'none');
    } else {
      console.log('Finalize: no invoice or payment_intent available to create payment record');
    }

    // Update user subscription field
    if (user) {
      const planFromInvoice = invoiceObj ? getPlanFromPriceId(invoiceObj.lines?.data?.[0]?.price?.id || invoiceObj.lines?.data?.[0]?.plan?.id) : null;
      const planFromSession = fullSession.metadata?.planName || null;
      const planName = planFromInvoice || planFromSession || null;

      const userUpdates = {
        stripeCustomerId: normalizeId(fullSession.customer),
        subscriptionStatus: 'active',
        subscriptionId: normalizeId(fullSession.subscription || (invoiceObj && invoiceObj.subscription)),
      };
      if (planName) userUpdates.subscriptionPlan = planName;

      await User.findByIdAndUpdate(user._id, userUpdates);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error finalizing checkout session:', err);
    res.status(500).json({ error: err.message });
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

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let subscriptionId = user.subscriptionId || null;

    // If we don't have a stored subscription id, try to find one via Stripe customer
    if (!subscriptionId && user.stripeCustomerId) {
      const subs = await stripeInstance.subscriptions.list({ customer: user.stripeCustomerId, limit: 1 });
      if (subs && Array.isArray(subs.data) && subs.data.length > 0) {
        subscriptionId = subs.data[0].id;
      }
    }

    if (!subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found for user' });
    }

    // Cancel the subscription immediately
    try {
      await stripeInstance.subscriptions.del(subscriptionId);
    } catch (stripeErr) {
      console.error('Stripe cancel error:', stripeErr);
      return res.status(500).json({ error: stripeErr.message || 'Failed to cancel subscription' });
    }

    // Update user record in DB
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'canceled',
      subscriptionId: null,
      subscriptionPlan: 'Free',
    });

    return res.json({ message: 'Subscription canceled' });
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    return res.status(500).json({ error: err.message });
  }
};