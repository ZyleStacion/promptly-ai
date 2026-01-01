import Chatbot from "../models/chatbot.js";
import { CHATBOT_LIMITS } from "../config/subscriptionLimits.js";

const checkChatbotLimit = async (req, res, next) => {
  try {
    const user = req.user;

    // 🔐 Admin has unlimited chatbots
    if (user.isAdmin) {
      return next();
    }

    const plan = user.subscriptionPlan || "Basic";
    const limit = CHATBOT_LIMITS[plan] ?? 1;

    const chatbotCount = await Chatbot.countDocuments({
      userId: user._id,
    });

    if (chatbotCount >= limit) {
      return res.status(403).json({
        error: "CHATBOT_LIMIT_REACHED",
        message: `Your ${plan} plan allows only ${limit} chatbot(s).`,
        limit,
        current: chatbotCount,
      });
    }

    next();
  } catch (err) {
    console.error("Chatbot limit error:", err);
    res.status(500).json({ error: "Failed to check chatbot limit" });
  }
};

export default checkChatbotLimit;
