import Feedback from "../models/feedback.js";

export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user: req.user.id,
      description: req.body.description,
      labels: JSON.parse(req.body.labels || "[]"),
      screenshot: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

export const getMyFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json({ feedbacks });
};

// GET unread notification count
export const getUnreadNotifications = async (req, res) => {
  const count = await Feedback.countDocuments({
    user: req.user.id,
    status: "replied",
    isRead: false,
  });

  res.json({ count });
};

// GET notifications list + mark as read
export const getNotifications = async (req, res) => {
  const notifications = await Feedback.find({
    user: req.user.id,
    status: "replied",
  }).sort({ repliedAt: -1 });

  // mark all as read
  await Feedback.updateMany(
    { user: req.user.id, status: "replied", isRead: false },
    { isRead: true }
  );

  res.json({ notifications });
};

