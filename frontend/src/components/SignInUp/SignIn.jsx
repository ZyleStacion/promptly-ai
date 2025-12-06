import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuBrain } from "react-icons/lu";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- GOOGLE LOGIN FIX ----------------
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const res = await fetch("http://localhost:3000/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          window.dispatchEvent(new Event("storage"));
          navigate("/dashboard");
        }
      },
    });

    // IMPORTANT → define height to prevent overlay
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      {
        theme: "outline",
        size: "large",
        width: "350",
      }
    );
  }, []);

  // ----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser({ email, password });

      if (!data.token) {
        setError(data.error || data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard");

    } catch (err) {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LuBrain className="text-4xl bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg p-1" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
              Promptly AI
            </h1>
          </div>
          <p className="text-gray-400">Welcome back</p>
        </div>

        {/* Form Card */}
        <div className="bg-neutral-950 border border-gray-800 rounded-xl p-8 pt-14 shadow-lg relative z-10">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            aria-label="Go back to home"
            className="absolute top-3 left-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md p-2 text-sm"
          >
            ← Back
          </button>

          {/* Auth switch buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button className="px-3 py-1 rounded-md text-sm bg-white text-gray-900 font-semibold">
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1 rounded-md text-sm bg-transparent border border-gray-700 text-white hover:bg-gray-800"
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {/* Error box */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm relative z-50">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>

              {/* FIXED Forgot Password link */}
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-400 font-semibold relative z-50"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Google Login Button */}
          <div
            id="google-login-btn"
            className="w-full flex justify-center relative"
            style={{ height: "50px", zIndex: 0 }}
          ></div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-semibold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
