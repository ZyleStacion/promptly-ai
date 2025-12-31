import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      // TODO: Fix this
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.error) setError(data.error);
      else setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
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
            Forgot Password
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
              type="email"
              className="w-full p-3 bg-neutral-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 p-3 rounded-lg font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
