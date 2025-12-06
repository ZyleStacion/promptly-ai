import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!newPassword || !confirm) return setError("Please fill in all fields");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    if (newPassword !== confirm) return setError("Passwords do not match");

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessage("Password reset successfully!");
        setTimeout(() => navigate("/signin"), 1500);
      }
    } catch (err) {
      setError("Something went wrong. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
        >
          ← Back
        </button>

        <div className="bg-neutral-950 p-8 rounded-xl border border-gray-800 shadow-lg">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text mb-4">
            Reset Password
          </h2>

          {message && (
            <p className="text-green-400 text-sm mb-4 bg-green-500/10 p-3 rounded border border-green-500/40">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded border border-red-500/40">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="password"
              className="w-full p-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              className="w-full p-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 p-3 rounded-lg font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
