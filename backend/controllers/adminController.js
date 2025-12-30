import User from "../models/user.js";
import Chatbot from "../models/chatbot.js"; 

/* ============================
   GET ALL USERS (Admin only)
============================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to load users" });
  }
};

/* ============================
       DELETE USER
============================ */
export const deleteUserByAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

/* ============================
      GET ALL CHATBOTS (ADMIN)
============================ */
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
        createdAt: bot.createdAt,
        status: bot.status,
      })),
    });
  } catch (err) {
    console.error("Admin get chatbots error:", err);
    res.status(500).json({ error: "Failed to load chatbots" });
  }
};

/* ============================
     DELETE CHATBOT (ADMIN)
============================ */
export const deleteChatbotByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const chatbot = await Chatbot.findByIdAndDelete(id);

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    res.json({ message: "Chatbot deleted by admin" });
  } catch (err) {
    console.error("Admin delete chatbot error:", err);
    res.status(500).json({ error: "Failed to delete chatbot" });
  }
};


/* ============================
     TOGGLE ADMIN ROLE
============================ */
export const toggleAdminRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: "Admin role updated", isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

/* ============================
        ADMIN DASHBOARD STATS
============================ */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });

    let totalChatbots = 0;

    try {
      totalChatbots = await Chatbot.countDocuments();
    } catch {
      totalChatbots = 0;
    }

    // Last 14 days signups
    const days = 14;
    const dailySignups = [];

    for (let i = 0; i < days; i++) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      let count = 0;

      try {
        count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      } catch {
        count = 0;
      }

      dailySignups.unshift({
        date: start.toLocaleDateString(),
        count,
      });
    }

    // User growth comparison
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
      prev7 === 0 ? 0 : Number((((last7 - prev7) / prev7) * 100).toFixed(1));

    res.json({
      totalUsers: totalUsers || 0,
      totalAdmins: totalAdmins || 0,
      totalChatbots,
      dailySignups,
      growthPercentage,
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to load admin stats" });
  }
};
