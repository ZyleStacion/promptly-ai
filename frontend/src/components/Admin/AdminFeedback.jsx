import React, { useEffect, useState } from "react";
import { API_URL } from "../../api/api";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeId, setActiveId] = useState(null);

  const loadFeedbacks = async () => {
    const res = await fetch(`${API_URL}/admin/feedback`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setFeedbacks(data.feedbacks || []);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const sendReply = async (id) => {
    await fetch(`${API_URL}/admin/feedback/${id}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ reply: replyText }),
    });

    setReplyText("");
    setActiveId(null);
    loadFeedbacks();
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">User Feedback</h1>

      <div className="space-y-6">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="bg-neutral-800 p-6 rounded-xl border border-gray-700"
          >
            {/* Header */}
            <div className="flex justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300">
                    {fb.user?.email || "Deleted user"}
                  </p>

                  {fb.user?.isAdmin && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 font-semibold">
                      ADMIN
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  fb.status === "open"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {fb.status}
              </span>
            </div>

            {/* Description */}
            <p className="mb-3 text-gray-200">{fb.description}</p>

            {/* Labels */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {fb.labels?.map((label) => (
                <span
                  key={label}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Screenshot */}
            {fb.screenshot && (
              <img
                src={`${API_URL}${fb.screenshot}`}
                alt="screenshot"
                className="max-h-40 rounded mb-4 border"
              />
            )}

            {/* Admin reply */}
            {fb.adminReply ? (
              <div className="bg-neutral-700 p-4 rounded">
                <p className="font-semibold mb-1">Admin Reply</p>
                <p>{fb.adminReply}</p>
              </div>
            ) : (
              <>
                {activeId === fb._id ? (
                  <>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 rounded bg-gray-900 border border-gray-700 mb-3"
                      placeholder="Type your reply..."
                    />
                    <button
                      onClick={() => sendReply(fb._id)}
                      className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Send Reply
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveId(fb._id)}
                    className="text-indigo-400 hover:underline"
                  >
                    Reply
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeedback;
