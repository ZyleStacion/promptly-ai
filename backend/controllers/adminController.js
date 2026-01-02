import User from "../models/user.js";
import Chatbot from "../models/chatbot.js";
import Payment from "../models/payment.js";


/* =====================================================
   USERS
===================================================== */

// GET ALL USERS (ADMIN)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
};

// DELETE USER (ADMIN)
export const deleteUserByAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// TOGGLE ADMIN ROLE
export const toggleAdminRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: "Admin role updated",
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("Toggle admin error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
};

/* =====================================================
   CHATBOTS (ADMIN)
===================================================== */

// GET ALL CHATBOTS (ADMIN)
export const getAllChatbots = async (req, res) => {
  try {
    const chatbots = await Chatbot.find()
      .sort({ createdAt: -1 })
      .populate("userId", "email username");

    res.json({
      chatbots: chatbots.map((bot) => ({
        _id: bot._id,
        name: bot.name,
        description: bot.description,
        ownerEmail: bot.userId?.email || "Unknown",
        status: bot.status,
        createdAt: bot.createdAt,
      })),
    });
  } catch (err) {
    console.error("Get chatbots error:", err);
    res.status(500).json({ error: "Failed to load chatbots" });
  }
};

// DELETE CHATBOT (ADMIN)
export const deleteChatbotByAdmin = async (req, res) => {
  try {
    const chatbot = await Chatbot.findByIdAndDelete(req.params.id);

    if (!chatbot)
      return res.status(404).json({ error: "Chatbot not found" });

    res.json({ message: "Chatbot deleted by admin" });
  } catch (err) {
    console.error("Delete chatbot error:", err);
    res.status(500).json({ error: "Failed to delete chatbot" });
  }
};

/* =====================================================
   ADMIN DASHBOARD STATS
===================================================== */

export const getAdminStats = async (req, res) => {
  try {
    // Totals
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalChatbots = await Chatbot.countDocuments();
    const totalTransactions = await Payment.countDocuments({
      status: "paid", // recommended
    });

    // Activity (Last 14 Days)
    const days = 14;
    const dailySignups = [];
    const dailyChatbots = [];
    const dailyTransactions = [];

    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      // UTC-safe day range
      const start = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - i,
          0, 0, 0
        )
      );

      const end = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - i,
          23, 59, 59, 999
        )
      );

      const userCount = await User.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      const chatbotCount = await Chatbot.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });
      const transactionCount = await Payment.countDocuments({
        status: "paid",
        createdAt: { $gte: start, $lte: end },
      });

      dailyTransactions.push({
        date: start.toLocaleDateString(),
        count: transactionCount,
      });

      dailySignups.push({
        date: start.toLocaleDateString(),
        count: userCount,
      });

      dailyChatbots.push({
        date: start.toLocaleDateString(),
        count: chatbotCount,
      });
    }

    // User growth (last 7 vs previous 7)
    const last7 = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 86400000) },
    });

    const prev7 = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 14 * 86400000),
        $lt: new Date(Date.now() - 7 * 86400000),
      },
    });

    const growthPercentage =
      prev7 === 0
        ? 0
        : Number((((last7 - prev7) / prev7) * 100).toFixed(1));

    // Response
    res.json({
      totalUsers,
      totalAdmins,
      totalChatbots,
      totalTransactions,
      dailySignups,
      dailyChatbots,
      dailyTransactions, 
      growthPercentage, // removable
    });


  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
};
