import Feedback from "../models/feedback.js";

export const getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("user", "email username")
    .sort({ createdAt: -1 });

  res.json({ feedbacks });
};

export const replyFeedback = async (req, res) => {
  const { reply } = req.body;

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback)
    return res.status(404).json({ error: "Feedback not found" });

  feedback.adminReply = reply;
  feedback.status = "replied";
  feedback.repliedAt = new Date();
  feedback.isRead = false; 

  await feedback.save();

  res.json({ message: "Reply sent" });
};

