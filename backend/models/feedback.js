import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        labels: {
            type: [String],
            default: [],
        },

        screenshot: {
            type: String,
        },

        status: {
            type: String,
            enum: ["open", "replied", "closed"],
            default: "open",
        },

        adminReply: {
            type: String,
        },

        repliedAt: {
            type: Date,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
